import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { FoodCard } from "@/components/FoodCard";
import { CATEGORIES, MENU } from "@/lib/data";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Smart Food Court" },
      { name: "description", content: "Full food court menu with pizza, burgers, beverages, snacks and desserts with live availability." },
      { property: "og:title", content: "Menu — Smart Food Court" },
      { property: "og:description", content: "Full food court menu with prices, stalls and availability." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [filter, setFilter] = useState<string>("All");
  const items = filter === "All" ? MENU : MENU.filter((m) => m.category === filter);

  return (
    <AppLayout role="student" title="Menu">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-md px-4 py-1.5 text-sm ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} showAvailability />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
