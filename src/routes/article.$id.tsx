import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

import { CategoryBadge } from "@/components/CategoryBadge";
import { BottomNav } from "@/components/BottomNav";
import { SaveButton } from "@/components/SaveButton";
import {
  displayContent,
  displayTitle,
  fetchArticle,
  relativeTime,
} from "@/lib/supabase";
import { ArticleImage } from "@/components/ArticleImage";

export const Route = createFileRoute("/article/$id")({
  component: ArticleDetail,
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-center text-sm text-muted-foreground">Article not found.</div>
  ),
});

function ArticleDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const numericId = Number(id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["article", numericId],
    queryFn: () => fetchArticle(numericId),
    enabled: !Number.isNaN(numericId),
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-card/95 px-3 py-3 backdrop-blur">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-1.5 rounded-full p-2 hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="truncate font-display text-sm font-semibold">Article</p>
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="p-6 text-center text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : !data ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          Article not found.
          <div className="mt-4">
            <Link to="/" className="text-primary underline">Back to feed</Link>
          </div>
        </div>
      ) : (
        <article className="flex-1">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <ArticleImage article={data} />
          </div>
          <div className="space-y-4 px-5 pt-5">
            <CategoryBadge category={data.category} size="md" />
            <h1 className="font-display text-2xl font-bold leading-tight">
              {displayTitle(data)}
            </h1>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {data.source ?? "Samagra"} · {relativeTime(data.created_at)}
            </p>
            <div className="prose prose-sm max-w-none whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">
              {displayContent(data) || "No content available."}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <SaveButton id={data.id} variant="pill" />
              {data.url && (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                >
                  Read original source
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </article>
      )}

      <BottomNav />
    </div>
  );
}
