"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { verifyPortalOtp, verifyPortalPassword } from "./actions";

type Step = "email" | "otp" | "password";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [hasPassword, setHasPassword] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const [otpRes, pwRes] = await Promise.all([
        fetch("/api/portal/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
        fetch("/api/portal/auth/has-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
      ]);
      if (pwRes.ok) {
        const { hasPassword: hp } = await pwRes.json();
        setHasPassword(hp);
        if (hp) { setStep("password"); setSending(false); return; }
      }
      if (otpRes.ok) {
        toast.success("Check your email for the login code");
        setStep("otp");
      } else {
        toast.error("Failed to send code. Try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
    setSending(false);
  }

  if (step === "otp") return <OtpForm email={email} onBack={() => setStep("email")} />;
  if (step === "password") return <PasswordForm email={email} onUseCode={() => { setStep("otp"); }} onBack={() => setStep("email")} />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Client Portal</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to your CiroStack client portal</p>
        </div>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" autoFocus />
          </div>
          <Button type="submit" className="w-full" disabled={sending}>{sending ? "Checking…" : "Continue"}</Button>
        </form>
      </div>
    </div>
  );
}

function OtpForm({ email, onBack }: { email: string; onBack: () => void }) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    const result = await verifyPortalOtp(email, otp);
    if (result?.error) {
      toast.error(result.error);
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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

function PasswordForm({ email, onUseCode, onBack }: { email: string; onUseCode: () => void; onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    const result = await verifyPortalPassword(email, password);
    if (result?.error) {
      toast.error(result.error);
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Signing in as <strong>{email}</strong></p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoFocus
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={verifying}>{verifying ? "Signing in…" : "Sign in"}</Button>
          <button type="button" onClick={onUseCode} className="w-full text-sm text-muted-foreground hover:text-foreground">
            Use email code instead
          </button>
          <button type="button" onClick={onBack} className="w-full text-sm text-muted-foreground hover:text-foreground">
            Use a different email
          </button>
        </form>
      </div>
    </div>
  );
}
