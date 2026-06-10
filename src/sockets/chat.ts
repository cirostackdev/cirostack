import type { Server as SocketServer, Socket } from "socket.io";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { addAdmin, removeAdmin } from "../lib/chat-state";

// ─── Token helpers ────────────────────────────────────────────────────────────

const SECRET = process.env.NEXTAUTH_SECRET ?? "changeme";

export function createSocketToken(adminId: string): string {
  const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
  const payload = `${adminId}:${expiry}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + sig;
}

function verifySocketToken(token: string): { adminId: string } | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const payload = Buffer.from(b64, "base64url").toString();
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  const [adminId, expiryStr] = payload.split(":");
  if (Date.now() > parseInt(expiryStr, 10)) return null;
  return { adminId };
}

// ─── Chat socket setup ────────────────────────────────────────────────────────

export function setupChatSocket(io: SocketServer) {
  io.on("connection", async (socket: Socket) => {
    // ── Visitor events ────────────────────────────────────────────────────────

    socket.on(
      "visitor:join",
      async (data: {
        visitorId: string;
        name?: string;
        email?: string;
        topic?: string;
        pageUrl?: string;
        conversationId?: string;
      }) => {
        try {
          let conversation;

          if (data.conversationId) {
            // Returning visitor – rejoin existing conversation
            conversation = await prisma.conversation.findFirst({
              where: { id: data.conversationId, visitorId: data.visitorId },
            });
          }

          if (!conversation) {
            // New conversation
            conversation = await prisma.conversation.create({
              data: {
                visitorId: data.visitorId,
                visitorName: data.name,
                visitorEmail: data.email,
                topic: data.topic,
                status: "open",
                metadata: { pageUrl: data.pageUrl },
              },
            });

            // System welcome message
            const welcome = await prisma.message.create({
              data: {
                conversationId: conversation.id,
                senderType: "system",
                body: "Welcome to CiroStack support! An agent will be with you shortly.",
              },
            });

            // Notify all connected admins
            socket.broadcast.to("admins").emit("conversation:new", {
              conversation: {
                ...conversation,
                latestMessage: welcome.body,
              },
            });
          }

          socket.join(`conv:${conversation.id}`);
          socket.data.visitorId = data.visitorId;
          socket.data.conversationId = conversation.id;
          socket.data.role = "visitor";

          socket.emit("conversation:created", {
            conversationId: conversation.id,
          });
        } catch (err) {
          console.error("[socket visitor:join]", err);
        }
      }
    );

    socket.on(
      "visitor:message",
      async (data: { conversationId: string; body: string }) => {
        if (
          !data.body?.trim() ||
          socket.data.role !== "visitor" ||
          socket.data.conversationId !== data.conversationId
        )
          return;

        try {
          // Check if conversation is closed
          const conv = await prisma.conversation.findUnique({
            where: { id: data.conversationId },
            select: { status: true },
          });
          if (conv?.status === "closed") {
            socket.emit("error", { message: "This conversation has been closed." });
            return;
          }

          const message = await prisma.message.create({
            data: {
              conversationId: data.conversationId,
              senderType: "visitor",
              body: data.body.trim().slice(0, 4000),
            },
          });

          // Update conversation updatedAt
          await prisma.conversation.update({
            where: { id: data.conversationId },
            data: { updatedAt: new Date() },
          });

          // Broadcast to agents in this conversation room
          io.to(`conv:${data.conversationId}`).except(socket.id).emit("visitor:message", { message });

          // Push notification to all admins
          import("../lib/push").then(({ sendPushToAllAdmins }) =>
            sendPushToAllAdmins({ title: "New chat message", body: message.body.slice(0, 100), url: `/admin/conversations/${data.conversationId}` })
          ).catch(() => {});
        } catch (err) {
          console.error("[socket visitor:message]", err);
        }
      }
    );

    socket.on(
      "visitor:typing",
      (data: { conversationId: string; typing: boolean }) => {
        if (socket.data.role !== "visitor") return;
        socket
          .to(`conv:${data.conversationId}`)
          .emit("visitor:typing", { conversationId: data.conversationId, typing: data.typing });
      }
    );

    // ── Admin events ──────────────────────────────────────────────────────────

    socket.on("admin:join", async (data: { token: string }) => {
      const verified = verifySocketToken(data.token);
      if (!verified) {
        socket.emit("error", { message: "Invalid token" });
        return;
      }

      try {
        const admin = await prisma.admin.findUnique({
          where: { id: verified.adminId },
        });
        if (!admin || admin.disabled) return;

        socket.data.adminId = admin.id;
        socket.data.adminName = admin.name;
        socket.data.role = "admin";

        socket.join("admins");
        addAdmin(socket.id);

        await prisma.admin.update({
          where: { id: admin.id },
          data: { online: true },
        });

        // Tell all visitors an admin came online
        socket.broadcast.emit("agent:online", { online: true });

        // Send open conversations to this admin
        const open = await prisma.conversation.findMany({
          where: { status: "open" },
          orderBy: { updatedAt: "desc" },
          take: 50,
          include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        });
        socket.emit("conversations:list", { conversations: open });
      } catch (err) {
        console.error("[socket admin:join]", err);
      }
    });

    socket.on("admin:claim", async (data: { conversationId: string }) => {
      if (socket.data.role !== "admin") return;
      try {
        // Check if already assigned to someone else
        const existing = await prisma.conversation.findUnique({
          where: { id: data.conversationId },
          select: { assignedToId: true },
        });
        if (existing?.assignedToId && existing.assignedToId !== socket.data.adminId) {
          socket.emit("error", {
            message: "This conversation is already assigned to another agent.",
          });
          return;
        }

        const conv = await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { assignedToId: socket.data.adminId },
        });
        socket.join(`conv:${data.conversationId}`);
        socket.emit("admin:claimed", { conversation: conv });

        // Notify visitor that an agent has joined
        const msg = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderType: "system",
            body: `${socket.data.adminName} has joined the conversation.`,
          },
        });
        io.to(`conv:${data.conversationId}`).emit("agent:message", { message: msg });
      } catch (err) {
        console.error("[socket admin:claim]", err);
      }
    });

    socket.on(
      "admin:message",
      async (data: { conversationId: string; body: string; fileUrl?: string }) => {
        if (socket.data.role !== "admin" || !data.body?.trim()) return;

        try {
          const message = await prisma.message.create({
            data: {
              conversationId: data.conversationId,
              senderType: "agent",
              senderId: socket.data.adminId,
              senderName: socket.data.adminName,
              body: data.body.trim().slice(0, 4000),
              ...(data.fileUrl ? { fileUrl: data.fileUrl } : {}),
            },
          });

          await prisma.conversation.update({
            where: { id: data.conversationId },
            data: { updatedAt: new Date() },
          });

          io.to(`conv:${data.conversationId}`).emit("agent:message", { message });
        } catch (err) {
          console.error("[socket admin:message]", err);
        }
      }
    );

    socket.on(
      "admin:typing",
      (data: { conversationId: string; typing: boolean }) => {
        if (socket.data.role !== "admin") return;
        socket
          .to(`conv:${data.conversationId}`)
          .emit("agent:typing", { typing: data.typing });
      }
    );

    socket.on("admin:close", async (data: { conversationId: string }) => {
      if (socket.data.role !== "admin") return;
      try {
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { status: "closed" },
        });

        const msg = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderType: "system",
            body: "This conversation has been closed.",
          },
        });
        io.to(`conv:${data.conversationId}`).emit("agent:message", { message: msg });
        io.to(`conv:${data.conversationId}`).emit("conversation:closed", {
          conversationId: data.conversationId,
        });
      } catch (err) {
        console.error("[socket admin:close]", err);
      }
    });

    // ── Admin mark-read ───────────────────────────────────────────────────────

    socket.on("admin:read", async (data: { conversationId: string }) => {
      if (socket.data.role !== "admin") return;
      try {
        await prisma.message.updateMany({
          where: {
            conversationId: data.conversationId,
            senderType: "visitor",
            read: false,
          },
          data: { read: true },
        });
      } catch (err) {
        console.error("[socket admin:read]", err);
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────────────

    socket.on("disconnect", async () => {
      if (socket.data.role === "admin" && socket.data.adminId) {
        removeAdmin(socket.id);

        // Mark offline only if no other connections remain for this admin
        const remaining = Array.from(io.sockets.sockets.values()).filter(
          (s) => s.id !== socket.id && s.data.adminId === socket.data.adminId
        );
        if (remaining.length === 0) {
          await prisma.admin.update({
            where: { id: socket.data.adminId },
            data: { online: false },
          }).catch(() => {});
        }

        if (getAdminCount() === 0) {
          socket.broadcast.emit("agent:online", { online: false });
        }
      }
    });
  });
}

function getAdminCount() {
  // Re-import to get current value (this module is a singleton so it works)
  const { getAdminCount: count } = require("../lib/chat-state");
  return count();
}
