export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "green" | "orange" | "blue";
}) {
  const color =
    tone === "green"
      ? "text-success"
      : tone === "orange"
        ? "text-warning"
        : tone === "blue"
          ? "text-info"
          : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
