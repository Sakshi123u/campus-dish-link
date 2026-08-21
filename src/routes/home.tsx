import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { FoodCard } from "@/components/FoodCard";
import { Input } from "@/components/ui/input";
import { CATEGORIES, MENU } from "@/lib/data";
import banner from "@/assets/banner.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Student Home — Smart Food Court" },
      { name: "description", content: "Browse categories and popular items, then order food from any college food court stall." },
      { property: "og:title", content: "Student Home — Smart Food Court" },
      { property: "og:description", content: "Browse categories and popular items from the college food court." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [query, setQuery] = useState("");
  const popular = MENU.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase()),
  ).slice(0, 6);

  return (
    <AppLayout role="student" title="Home">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Hello, Student 👋</h2>
          <p className="text-sm text-muted-foreground">What would you like to eat today?</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border">
          <img src={banner} alt="College food court" width={1536} height={512} className="h-48 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-4 mx-auto flex max-w-md gap-2 px-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for food..."
              className="bg-card"
            />
            <span className="flex h-9 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        <section>
          <h3 className="mb-3 text-base font-semibold">Categories</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/menu"
                className="rounded-lg border border-border bg-card px-4 py-5 text-center text-sm font-medium hover:border-primary"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold">Popular Items</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popular.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
          {popular.length === 0 && (
            <p className="text-sm text-muted-foreground">No items match your search.</p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
