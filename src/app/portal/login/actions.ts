"use server";

import { clientSignIn } from "@/auth-client";
import { AuthError } from "next-auth";

export async function verifyPortalOtp(
  email: string,
  otp: string
): Promise<{ error?: string }> {
  try {
    await clientSignIn("credentials", {
      email,
      otp,
      redirectTo: "/portal/dashboard",
    });
  } catch (err) {
    // NEXT_REDIRECT is not an AuthError — re-throw so Next.js can handle the redirect
    if (err instanceof AuthError) {
      return { error: "Invalid or expired code. Try again." };
    }
    throw err;
  }
  return {};
}
