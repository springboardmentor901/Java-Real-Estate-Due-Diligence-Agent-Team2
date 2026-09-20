"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { errorMessage } from "@/lib/auth-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthHero from "@/components/layout/AuthHero";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(errorMessage(err, "Could not log in. Check your email and password."));
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1">
      <AuthHero />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">
            Welcome back
          </h1>
          <p className="mb-8 mt-1 text-sm text-ink-muted">Log in to your due diligence account.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-brick">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Log in
            </Button>
          </form>
          <p className="mt-8 text-sm text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brass hover:text-brass-dark">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
