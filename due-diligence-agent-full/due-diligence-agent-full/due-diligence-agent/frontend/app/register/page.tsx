"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { errorMessage } from "@/lib/auth-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthHero from "@/components/layout/AuthHero";

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    try {
      await register(fullName, email, password);
    } catch (err) {
      setError(errorMessage(err, "Could not create your account."));
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1">
      <AuthHero />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">
            Create an account
          </h1>
          <p className="mb-8 mt-1 text-sm text-ink-muted">
            New accounts start as a Buyer. Ask an administrator to change your role.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-brick">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Create account
            </Button>
          </form>
          <p className="mt-8 text-sm text-ink-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brass hover:text-brass-dark">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
