import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { stallName, type FoodItem } from "@/lib/data";
import { useApp } from "@/lib/store";

export function FoodCard({ item, showAvailability = false }: { item: FoodItem; showAvailability?: boolean }) {
  const { addToCart } = useApp();

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        width={512}
        height={512}
        className="mb-3 h-28 w-full rounded-md object-contain"
      />
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-xs text-muted-foreground">{stallName(item.stall)}</p>
      {showAvailability && (
        <p className={`mt-1 text-xs ${item.available ? "text-success" : "text-destructive"}`}>
          {item.available ? "Available" : "Unavailable"}
        </p>
      )}
      <p className="mt-1 text-sm font-semibold">₹{item.price}</p>
      <Button
        size="sm"
        variant="outline"
        className="mt-3 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
        disabled={!item.available}
        onClick={() => {
          addToCart(item);
          toast.success(`${item.name} added to cart`);
        }}
      >
        Add
      </Button>
    </div>
  );
}
