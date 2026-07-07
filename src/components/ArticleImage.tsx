import type { NewsArticle } from "@/lib/supabase";

export function ArticleImage({ article }: { article: NewsArticle }) {
  const meta = article.category ?? "General";
  const seed = encodeURIComponent(`${article.id}-${meta}`);
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
