import { prisma } from "@/lib/prisma";

export async function createNotification(clientId: string, title: string, body: string, href?: string) {
  return prisma.notification.create({
    data: { clientId, title, body, href },
  });
}
