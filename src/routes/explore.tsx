import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useCategoryFilter } from "@/lib/category-store";
import {
  displayContent,
  displayTitle,
  fetchNews,
  PAGE_SIZE,
  relativeTime,
  type NewsArticle,
} from "@/lib/supabase";
import { ArticleImage } from "@/components/ArticleImage";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  const { category } = useCategoryFilter();
  const query = useInfiniteQuery({
    queryKey: ["explore", category],
    queryFn: ({ pageParam = 0 }) => fetchNews({ category, page: pageParam as number }),
    getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length),
    initialPageParam: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinel.current || !scrollRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "400px 0px" },
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [query]);

  const articles = query.data?.pages.flat() ?? [];

  return (
    <AppShell title="Explore" fullBleed>
      <div
        ref={scrollRef}
        className="snap-y-mandatory no-scrollbar h-[calc(100dvh-56px-64px)] overflow-y-scroll pb-16"
      >
        {query.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm text-muted-foreground">No articles available.</p>
          </div>
        ) : (
          <>
            {articles.map((a) => (
              <ExploreCard key={a.id} article={a} />
            ))}
            <div ref={sentinel} className="h-4" />
            {query.isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function ExploreCard({ article }: { article: NewsArticle }) {
  const summary = displayContent(article);
  const truncated = summary.length > 320 ? summary.slice(0, 320).trimEnd() + "…" : summary;
  return (
    <section className="snap-start-always relative flex h-[calc(100dvh-56px-64px)] w-full flex-col">
      <div className="relative h-[52%] w-full overflow-hidden bg-muted">
        <ArticleImage article={article} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        <div className="absolute left-4 top-4">
          <CategoryBadge category={article.category} size="md" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-4 pt-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {article.source ?? "Samagra"} · {relativeTime(article.created_at)}
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          {displayTitle(article)}
        </h2>
        <p className="text-[15px] leading-relaxed text-foreground/80 line-clamp-6">
          {truncated || "No summary available."}
        </p>
        <div className="mt-auto pt-2">
          <Link
            to="/article/$id"
            params={{ id: String(article.id) }}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-sm active:scale-[0.99]"
          >
            View Full Article
          </Link>
        </div>
      </div>
    </section>
  );
}
