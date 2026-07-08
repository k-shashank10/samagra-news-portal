import { Bookmark } from "lucide-react";
import { toggleSaved, useIsSaved } from "@/lib/saved-store";

export function SaveButton({
  id,
  variant = "icon",
}: {
  id: number;
  variant?: "icon" | "pill";
}) {
  const saved = useIsSaved(id);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(id);
  };

  if (variant === "pill") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
          saved
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border text-foreground hover:bg-muted"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save article"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
