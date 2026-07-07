import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { CategoryDrawer } from "./CategoryDrawer";
import { useCategoryFilter } from "@/lib/category-store";

export function AppShell({
  children,
  title = "Samagra News",
  fullBleed = false,
}: {
  children: ReactNode;
  title?: string;
  fullBleed?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { category, setCategory } = useCategoryFilter();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-background">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold leading-none">{title}</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {category ? `Filtered · ${category}` : "All categories"}
          </p>
        </div>
      </header>

      <main className={fullBleed ? "flex-1" : "flex-1 pb-24"}>{children}</main>

      <BottomNav />

      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={category}
        onSelect={setCategory}
      />
    </div>
  );
}
