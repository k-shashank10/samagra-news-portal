import { metaFor } from "@/lib/categories";

export function CategoryBadge({ category, size = "sm" }: { category: string | null | undefined; size?: "sm" | "md" }) {
  const meta = metaFor(category);
  const Icon = meta.icon;
  const label = category || meta.name;
  const pad = size === "md" ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wide ${pad} ${meta.color} ${meta.text}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
