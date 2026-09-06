"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { TOOLS, type ToolAccess, type ToolId } from "@/lib/tool-access";
import { COUNTRIES } from "@/lib/countries";

const COUNTRY_NAME: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.name]),
);

function CountryPicker({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (code: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted">
          {selected.length === 0
            ? "No countries restricted — open to everyone."
            : `${selected.length} ${selected.length === 1 ? "country" : "countries"} restricted`}
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-brand hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onToggle(code)}
              className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand"
            >
              {COUNTRY_NAME[code] ?? code}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search countries to restrict..."
        className="mt-3"
      />
      <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border">
        {filtered.map((c) => (
          <label
            key={c.code}
            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-ink hover:bg-surface-muted"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.code)}
              onChange={() => onToggle(c.code)}
              className="h-4 w-4 rounded border-border"
            />
            {c.name}
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="p-3 text-sm text-muted">No countries match &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  );
}

export function ToolAccessDashboard({ toolAccess }: { toolAccess: ToolAccess }) {
  const router = useRouter();
  const [access, setAccess] = useState<ToolAccess>(toolAccess);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const toggleCountry = (toolId: ToolId, code: string) => {
    setAccess((prev) => {
      const current = prev[toolId];
      const next = current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code];
      return { ...prev, [toolId]: next };
    });
    setStatus("idle");
    setMessage(null);
  };

  const clearTool = (toolId: ToolId) => {
    setAccess((prev) => ({ ...prev, [toolId]: [] }));
    setStatus("idle");
    setMessage(null);
  };

  const handleSave = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/tool-access", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(access),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(
        "Saved! Pushed to GitHub — Vercel is now deploying. Restrictions take effect once the new deployment finishes, usually within a minute or two.",
      );
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <AdminTabs active="access" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Regional Access</h1>
            <p className="mt-1 text-sm text-muted">
              Restrict visitors from specific countries out of a free tool —
              they&apos;re redirected to an &quot;Access Denied&quot; page
              instead. Only takes effect once deployed on Vercel.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          {TOOLS.map((tool) => (
            <Card key={tool.id} className="p-6">
              <h2 className="text-lg font-semibold text-ink">{tool.label}</h2>
              <p className="mt-0.5 text-xs text-muted">{tool.path}</p>
              <div className="mt-4">
                <CountryPicker
                  selected={access[tool.id]}
                  onToggle={(code) => toggleCountry(tool.id, code)}
                  onClear={() => clearTool(tool.id)}
                />
              </div>
            </Card>
          ))}
        </div>

        {message && (
          <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-600" : "text-brand"}`}>
            {message}
          </p>
        )}

        <div className="mt-6">
          <Button type="button" onClick={handleSave} disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </section>
  );
}
