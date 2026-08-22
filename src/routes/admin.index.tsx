import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { STALLS, stallName } from "@/lib/data";
import { overallStatus, useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Smart Food Court" },
      { name: "description", content: "Admin overview of total orders, pending orders, revenue and how orders are distributed across stalls." },
      { property: "og:title", content: "Admin Overview — Smart Food Court" },
      { property: "og:description", content: "Total orders, pending orders, revenue and stall distribution." },
    ],
  }),
  component: AdminOverview,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AdminOverview() {
  const { orders } = useApp();
  const completed = orders.filter((o) => overallStatus(o) === "Collected").length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  const byStall = STALLS.map((s) => ({
    name: s.name,
    value: orders.reduce(
      (n, o) => n + o.subOrders.filter((sub) => sub.stall === s.id).length,
      0,
    ),
  })).filter((s) => s.value > 0);

  const byStatus = ["Order Placed", "Confirmed", "Preparing", "Ready", "Collected"].map((st) => ({
    name: st,
    orders: orders.filter((o) => overallStatus(o) === st).length,
  }));

  return (
    <AppLayout role="admin" title="Admin Dashboard">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Orders" value={orders.length} tone="blue" />
          <StatCard label="Pending Orders" value={orders.length - completed} tone="orange" />
          <StatCard label="Completed Orders" value={completed} tone="green" />
          <StatCard label="Today's Revenue" value={`₹${revenue}`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-4 text-sm font-medium">Orders Overview</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-4 text-sm font-medium">Orders by Stall</p>
            {byStall.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byStall} dataKey="value" nameKey="name" outerRadius={80} label>
                    {byStall.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="mb-4 text-sm font-medium">Order Distribution</p>
          <div className="flex flex-col items-center gap-2 text-sm">
            <Box label="Student Order" tone="accent" />
            <Arrow />
            <Box label="Order Coordinator" tone="primary" />
            <Arrow />
            <div className="flex flex-wrap justify-center gap-4">
              {STALLS.slice(0, 3).map((s) => (
                <Box key={s.id} label={stallName(s.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Box({ label, tone }: { label: string; tone?: "primary" | "accent" }) {
  const cls =
    tone === "primary"
      ? "border-primary/40 bg-success-soft text-success"
      : tone === "accent"
        ? "border-accent/40 bg-warning-soft text-warning"
        : "border-border bg-muted text-foreground";
  return <div className={`rounded-md border px-4 py-2 text-center ${cls}`}>{label}</div>;
}

function Arrow() {
  return <span className="text-muted-foreground">↓</span>;
}
