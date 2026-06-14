/**
 * DB-based rate limiting — works across serverless instances.
 * Checks FormSubmission count per email within a time window.
 */
import { prisma } from "@/lib/prisma";

export async function isFormRateLimited(email: string, type: string, maxPerHour = 3): Promise<boolean> {
  if (!email) return false;
  const since = new Date(Date.now() - 60 * 60_000);
  const count = await prisma.formSubmission.count({
    where: {
      type,
      createdAt: { gte: since },
      data: { path: ["email"], equals: email.toLowerCase() },
    },
  });
  return count >= maxPerHour;
}
