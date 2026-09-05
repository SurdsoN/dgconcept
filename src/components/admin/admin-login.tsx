"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Incorrect password");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-lg font-semibold text-ink">Admin Login</h1>
        <p className="mt-1 text-sm text-muted">
          Enter the admin password to manage blog posts.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && <p className="text-xs text-brand">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Log In"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
