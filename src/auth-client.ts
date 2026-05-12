import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientAuthConfig } from "./auth-client.config";

export const {
  handlers: clientHandlers,
  signIn: clientSignIn,
  signOut: clientSignOut,
  auth: clientAuth,
} = NextAuth({
  ...clientAuthConfig,
  secret: process.env.PORTAL_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "portal-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP Code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const otp = credentials?.otp as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email) return null;

        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) return null;

        // OTP-based login
        if (otp) {
          if (!client.otpCode || !client.otpExpiry) return null;
          if (new Date() > client.otpExpiry) return null;
          if (client.otpCode !== otp) return null;

          // Clear OTP after successful use
          await prisma.client.update({
            where: { id: client.id },
            data: { otpCode: null, otpExpiry: null },
          });

          return {
            id: client.id,
            email: client.email,
            name: client.name ?? client.email,
          } as any;
        }

        // Password-based login
        if (password && client.passwordHash) {
          const valid = await bcrypt.compare(password, client.passwordHash);
          if (!valid) return null;

          return {
            id: client.id,
            email: client.email,
            name: client.name ?? client.email,
          } as any;
        }

        return null;
      },
    }),
  ],
});
