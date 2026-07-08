import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ArrowLeft, Loader2, Search as SearchIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { ArticleImage } from "@/components/ArticleImage";
import { BottomNav } from "@/components/BottomNav";
import { CategoryBadge } from "@/components/CategoryBadge";
import {
  displayTitle,
  relativeTime,
  supabase,
  type NewsArticle,
} from "@/lib/supabase";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
});

async function searchNews(term: string): Promise<NewsArticle[]> {
  const t = term.trim();
  if (!t) return [];
  // PostgREST .or accepts comma-separated filters; escape commas/parens
  const safe = t.replace(/[,()]/g, " ").trim();
  const pattern = `%${safe}%`;
  const { data, error } = await supabase
    .from("NewsData")
    .select("*")
    .or(
      `ai_title.ilike.${pattern},title.ilike.${pattern},ai_summary.ilike.${pattern},description.ilike.${pattern},source.ilike.${pattern}`,
    )
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return (data ?? []) as NewsArticle[];
}

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce URL updates so the query key stabilizes
  useEffect(() => {
    const id = setTimeout(() => {
      if (input !== q) {
        navigate({ search: { q: input }, replace: true });
      }
    }, 250);
    return () => clearTimeout(id);
  }, [input, q, navigate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchNews(q),
    enabled: q.trim().length > 1,
  });

  const results = query.data ?? [];

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-card/95 px-3 py-3 backdrop-blur">
        <Link
          to="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search news…"
            className="w-full rounded-full border bg-background py-2 pl-9 pr-9 text-sm outline-none focus:border-primary"
          />
          {input && (
            <button
              onClick={() => setInput("")}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {q.trim().length <= 1 ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">
            Type at least 2 characters to search titles, summaries, and sources.
          </p>
        ) : query.isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : query.isError ? (
          <p className="px-6 py-8 text-center text-sm text-destructive">
            {(query.error as Error).message}
          </p>
        ) : results.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">
            No results for "{q}".
          </p>
        ) : (
          <div className="space-y-3 px-4 pt-4">
            <p className="text-xs text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {results.map((article) => (
              <Link
                key={article.id}
                to="/article/$id"
                params={{ id: String(article.id) }}
                className="flex gap-3 overflow-hidden rounded-xl border bg-card p-3 shadow-sm"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <ArticleImage article={article} />
                </div>
                <div className="min-w-0 flex-1">
                  <CategoryBadge category={article.category} />
                  <h4 className="mt-1 font-display text-[14px] font-bold leading-snug line-clamp-3">
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
      </main>

      <BottomNav />
    </div>
  );
}
