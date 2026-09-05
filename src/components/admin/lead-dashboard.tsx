"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { Lead } from "@/lib/leads";

function toCsv(leads: Lead[]): string {
  const header = ["Name", "Email", "Source", "Date"];
  const rows = leads.map((lead) => [lead.name, lead.email, lead.source, lead.date]);
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

export function LeadDashboard({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete the lead "${lead.email}"? This can't be undone.`)) return;

    setDeletingId(lead.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete that lead.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    const csv = toCsv(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dgconcept-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <AdminTabs active="leads" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Leads</h1>
            <p className="mt-1 text-sm text-muted">
              Everyone who downloaded the free guide — {leads.length} total.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={leads.length === 0}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-brand">{error}</p>}

        <div className="mt-6 space-y-2">
          {leads.map((lead) => (
            <Card key={lead.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{lead.name}</p>
                <p className="truncate text-xs text-muted">{lead.email}</p>
                <p className="text-xs text-muted">
                  {lead.source} — {lead.date}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deletingId === lead.id}
                onClick={() => handleDelete(lead)}
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === lead.id ? "Deleting..." : "Delete"}
              </Button>
            </Card>
          ))}
          {leads.length === 0 && (
            <p className="text-sm text-muted">No leads yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
