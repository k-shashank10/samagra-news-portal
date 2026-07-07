import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";

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

export const Route = createFileRoute("/")({
  component: FeedPage,
});

function FeedPage() {
  const { category } = useCategoryFilter();
  const query = useInfiniteQuery({
    queryKey: ["news", category],
    queryFn: ({ pageParam = 0 }) => fetchNews({ category, page: pageParam as number }),
    getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length),
    initialPageParam: 0,
  });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const el = sentinel.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [query]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await query.refetch();
    setRefreshing(false);
  };

  const articles = query.data?.pages.flat() ?? [];
  const [hero, ...rest] = articles;

  return (
    <AppShell title="Samagra News">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="font-display text-2xl font-bold">
          {category ? category : "Top Stories"}
        </h2>
        <button
          onClick={onRefresh}
          disabled={refreshing || query.isFetching}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing || query.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {query.isLoading ? (
        <FeedSkeleton />
      ) : query.isError ? (
        <ErrorState message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4 px-4 pt-4">
          {hero && <HeroCard article={hero} />}
          <MixedList articles={rest} />
          <div ref={sentinel} className="h-8" />
          {query.isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!query.hasNextPage && articles.length > 5 && (
            <p className="pb-4 pt-2 text-center text-xs text-muted-foreground">You're all caught up ✨</p>
          )}
        </div>
      )}
    </AppShell>
  );
}

function HeroCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="group block overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <ArticleImage article={article} />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={article.category} size="md" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-xl font-bold leading-tight line-clamp-3">
            {displayTitle(article)}
          </h3>
          <p className="mt-1.5 text-[11px] uppercase tracking-wide text-white/80">
            {article.source ?? "Samagra"} · {relativeTime(article.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function MixedList({ articles }: { articles: NewsArticle[] }) {
  // Pattern: wide, wide, [grid of 2], repeat
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < articles.length) {
    blocks.push(<WideCard key={key++} article={articles[i++]} />);
    if (i < articles.length) blocks.push(<WideCard key={key++} article={articles[i++]} />);
    if (i + 1 < articles.length) {
      blocks.push(
        <div key={key++} className="grid grid-cols-2 gap-3">
          <GridCard article={articles[i++]} />
          <GridCard article={articles[i++]} />
        </div>,
      );
    } else if (i < articles.length) {
      blocks.push(<WideCard key={key++} article={articles[i++]} />);
    }
  }
  return <div className="space-y-4">{blocks}</div>;
}

function WideCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="flex gap-3 overflow-hidden rounded-xl border bg-card p-3 shadow-sm active:scale-[0.995] transition"
    >
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
        <ArticleImage article={article} />
      </div>
      <div className="min-w-0 flex-1">
        <CategoryBadge category={article.category} />
        <h4 className="mt-1.5 font-display text-[15px] font-bold leading-snug line-clamp-3">
          {displayTitle(article)}
        </h4>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {article.source ?? "Samagra"} · {relativeTime(article.created_at)}
        </p>
      </div>
    </Link>
  );
}

function GridCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <ArticleImage article={article} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <CategoryBadge category={article.category} />
        <h4 className="font-display text-sm font-bold leading-snug line-clamp-3">
          {displayTitle(article)}
        </h4>
        <p className="mt-auto text-[10px] text-muted-foreground">
          {relativeTime(article.created_at)}
        </p>
      </div>
    </Link>
  );
}

// Placeholder image built from category + title so cards never look empty.
export function ArticleImage({ article }: { article: NewsArticle }) {
  const meta = article.category ?? "General";
  const seed = encodeURIComponent(`${article.id}-${meta}`);
  // Use a deterministic gradient background per category color.
  return (
    <div className="relative h-full w-full">
      <img
        src={`https://picsum.photos/seed/${seed}/800/500`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-muted" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 rounded-xl border bg-card p-3">
          <div className="h-24 w-28 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center">
      <p className="font-display text-lg font-semibold">No articles yet</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Nothing to show for this category. Try a different one from the menu.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center">
      <p className="font-display text-lg font-semibold">Couldn't load feed</p>
      <p className="mt-2 break-words text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
