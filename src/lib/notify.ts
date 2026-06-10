import { prisma } from "@/lib/prisma";
import { sendPush } from "./push";

export async function createNotification(clientId: string, title: string, body: string, href?: string) {
  const notification = await prisma.notification.create({
    data: { clientId, title, body, href },
  });

  // Also trigger push notification for the client
  sendPush("client", clientId, {
    title,
    body,
    url: href,
  }).catch(console.error);

  return notification;
}
