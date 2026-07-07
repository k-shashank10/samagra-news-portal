import { X } from "lucide-react";
import { ALL_META, CATEGORY_META } from "@/lib/categories";
import { CATEGORIES } from "@/lib/supabase";

export function CategoryDrawer({
  open,
  onClose,
  active,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
  onSelect: (cat: string | null) => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[82%] max-w-[320px] bg-card shadow-xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="font-display text-lg font-bold">Categories</p>
            <p className="text-xs text-muted-foreground">Filter your feed</p>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3">
          <Item
            meta={ALL_META}
            selected={active === null}
            onClick={() => {
              onSelect(null);
              onClose();
            }}
          />
          <div className="my-2 h-px bg-border" />
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c];
            const isActive = active?.toLowerCase() === c.toLowerCase();
            return (
              <Item
                key={c}
                meta={meta}
                selected={isActive}
                onClick={() => {
                  onSelect(c);
                  onClose();
                }}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Item({
  meta,
  selected,
  onClick,
}: {
  meta: { name: string; icon: any; color: string };
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
        selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-md ${selected ? "bg-white/20" : meta.color} text-white`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-medium">{meta.name}</span>
    </button>
  );
}
