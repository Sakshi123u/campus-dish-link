import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { stallName } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart & Checkout — Smart Food Court" },
      { name: "description", content: "Review your food court cart items, update quantities and place a single multi-stall order." },
      { property: "og:title", content: "Cart & Checkout — Smart Food Court" },
      { property: "og:description", content: "Review cart items and place a single multi-stall order." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart, checkout, cartTotal } = useApp();
  const navigate = useNavigate();

  return (
    <AppLayout role="student" title="Your Cart">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs text-success">
            {cart.length} Items
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Stall</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.itemId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{stallName(item.stall)}</td>
                  <td className="px-4 py-3">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-3 rounded-md border border-border px-2 py-1">
                      <button onClick={() => setQty(item.itemId, item.qty - 1)} aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      {item.qty}
                      <button onClick={() => setQty(item.itemId, item.qty + 1)} aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">₹{item.price * item.qty}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
          <p className="text-base font-semibold">Total: ₹{cartTotal}</p>
        </div>

        <div className="flex justify-end">
          <Button
            disabled={cart.length === 0}
            onClick={() => {
              const order = checkout();
              if (order) {
                toast.success(`Order ${order.id} placed and split across ${order.subOrders.length} stall(s)`);
                navigate({ to: "/track" });
              }
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
