"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/portal/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
      toast.success("Check your email for the login code");
    } else {
      toast.error("Failed to send code. Try again.");
    }
    setSending(false);
  }

  if (sent) {
    return <OtpForm email={email} onBack={() => setSent(false)} />;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Client Portal</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enter your email to receive a login code</p>
        </div>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" autoFocus />
          </div>
          <Button type="submit" className="w-full" disabled={sending}>{sending ? "Sending…" : "Send login code"}</Button>
        </form>
      </div>
    </div>
  );
}

function OtpForm({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    const result = await signIn("portal-credentials", {
      email,
      otp,
      redirect: false,
      callbackUrl: "/portal/dashboard",
    });
    if (result?.ok) {
      router.push("/portal/dashboard");
    } else {
      toast.error("Invalid or expired code. Try again.");
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Enter your code</h1>
          <p className="text-muted-foreground mt-2 text-sm">We sent a 6-digit code to <strong>{email}</strong></p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Login code</Label>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="000000" className="text-center text-2xl tracking-widest font-mono" autoFocus required />
          </div>
          <Button type="submit" className="w-full" disabled={verifying}>{verifying ? "Verifying…" : "Sign in"}</Button>
          <button type="button" onClick={onBack} className="w-full text-sm text-muted-foreground hover:text-foreground">Use a different email</button>
        </form>
      </div>
    </div>
  );
}
