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
    if (err instanceof AuthError) {
      return { error: "Invalid or expired code. Try again." };
    }
    throw err;
  }
  return {};
}

export async function verifyPortalPassword(
  email: string,
  password: string
): Promise<{ error?: string }> {
  try {
    await clientSignIn("credentials", {
      email,
      password,
      redirectTo: "/portal/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect password. Try again or use an email code." };
    }
    throw err;
  }
  return {};
}
