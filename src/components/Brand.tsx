import { UtensilsCrossed } from "lucide-react";

export function Brand({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <UtensilsCrossed className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-base font-semibold leading-tight">Smart Food Court</span>
        {withTagline && (
          <span className="block text-xs text-muted-foreground">Order Smart. Eat Fast.</span>
        )}
      </span>
    </div>
  );
}
