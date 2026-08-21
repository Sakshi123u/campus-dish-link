const TONES: Record<string, string> = {
  green: "bg-success-soft text-success",
  orange: "bg-warning-soft text-warning",
  blue: "bg-info-soft text-info",
  gray: "bg-muted text-muted-foreground",
  red: "bg-destructive/10 text-destructive",
};

export function StatusBadge({
  label,
  tone = "gray",
}: {
  label: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      {label}
    </span>
  );
}

export function statusTone(status: string): keyof typeof TONES {
  switch (status) {
    case "new":
    case "Order Placed":
      return "gray";
    case "accepted":
    case "Confirmed":
      return "blue";
    case "preparing":
    case "Preparing":
      return "orange";
    case "ready":
    case "Ready":
      return "green";
    case "completed":
    case "Collected":
      return "green";
    default:
      return "gray";
  }
}

export const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
