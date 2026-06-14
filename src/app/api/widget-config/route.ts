import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required
export async function GET() {
  const config = await prisma.widgetConfig.findFirst();
  const hours = await prisma.businessHours.findMany({ orderBy: { day: "asc" } });

  // Determine if currently within business hours
  const now = new Date();
  const tz = hours[0]?.timezone || "UTC";
  const currentDay = now.getDay();
  const todayHours = hours.find((h) => h.day === currentDay);
  let isOnline = false;

  if (todayHours?.enabled) {
    const [sh, sm] = todayHours.startTime.split(":").map(Number);
    const [eh, em] = todayHours.endTime.split(":").map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    isOnline = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  return NextResponse.json({
    config: config || {
      primaryColor: "#6366f1",
      position: "bottom-right",
      welcomeMessage: "Hi! How can we help you?",
      offlineMessage: "We're currently offline. Leave a message and we'll get back to you.",
      preChatForm: false,
      preChatFields: null,
      showBranding: true,
      autoOpenDelay: null,
    },
    isOnline,
    businessHours: hours,
  });
}
