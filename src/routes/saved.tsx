import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Loader2, Trash2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ArticleImage } from "@/components/ArticleImage";
import { CategoryBadge } from "@/components/CategoryBadge";
import { SaveButton } from "@/components/SaveButton";
import { clearSaved, useSavedIds } from "@/lib/saved-store";
import {
  displayTitle,
  relativeTime,
  supabase,
  type NewsArticle,
} from "@/lib/supabase";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

async function fetchByIds(ids: number[]): Promise<NewsArticle[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("NewsData")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  const byId = new Map<number, NewsArticle>();
  (data ?? []).forEach((a) => byId.set((a as NewsArticle).id, a as NewsArticle));
  // preserve saved order (most recently saved first)
  return ids.map((id) => byId.get(id)).filter(Boolean) as NewsArticle[];
}

function SavedPage() {
  const ids = useSavedIds();
  const query = useQuery({
    queryKey: ["saved-articles", ids.join(",")],
    queryFn: () => fetchByIds(ids),
  });

  return (
    <AppShell title="Saved">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="font-display text-2xl font-bold">Saved</h2>
        {ids.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all saved articles?")) clearSaved();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {ids.length === 0 ? (
        <EmptyState />
      ) : query.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : query.isError ? (
        <p className="px-4 py-8 text-center text-sm text-destructive">
          {(query.error as Error).message}
        </p>
      ) : (
        <div className="space-y-3 px-4 pt-4">
          {(query.data ?? []).map((article) => (
            <Link
              key={article.id}
              to="/article/$id"
              params={{ id: String(article.id) }}
              className="flex gap-3 overflow-hidden rounded-xl border bg-card p-3 shadow-sm"
            >
              <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                <ArticleImage article={article} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CategoryBadge category={article.category} />
                  <SaveButton id={article.id} />
                </div>
                <h4 className="mt-1.5 font-display text-[15px] font-bold leading-snug line-clamp-3">
                  {displayTitle(article)}
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {article.source ?? "Samagra"} · {relativeTime(article.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Bookmark className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">No saved articles</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tap the bookmark icon on any story to save it for later.
      </p>
    </div>
  );
}
