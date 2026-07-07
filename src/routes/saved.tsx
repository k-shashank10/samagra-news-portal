import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

function SavedPage() {
  return (
    <AppShell title="Saved">
      <div className="mx-auto max-w-sm px-6 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Bookmark className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">Saved articles</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Coming soon — you'll be able to bookmark stories here for later.
        </p>
      </div>
    </AppShell>
  );
}
