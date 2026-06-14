import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin || admin.disabled) return null;

        // Check lockout
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);

        if (!valid) {
          const attempts = admin.failedAttempts + 1;
          const MAX_ATTEMPTS = 5;
          const LOCKOUT_MINUTES = 15;
          await prisma.admin.update({
            where: { id: admin.id },
            data: {
              failedAttempts: attempts,
              lockedUntil: attempts >= MAX_ATTEMPTS
                ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
                : null,
            },
          });
          return null;
        }

        // Successful login — reset counter
        if (admin.failedAttempts > 0) {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedAttempts: 0, lockedUntil: null },
          });
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        } as any;
      },
    }),
  ],
});
