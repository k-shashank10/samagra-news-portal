import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dieqnfirctlfkhlbnwdp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXFuZmlyY3RsZmtobGJud2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzEyNzgsImV4cCI6MjA5OTAwNzI3OH0.mki05SqtFRo_jrEid0LE0BhB_5nVseFbgHlPeBtNC3M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type NewsArticle = {
  id: number;
  created_at: string;
  category: string | null;
  title: string | null;
  description: string | null;
  source: string | null;
  content: string | null;
  ai_summary: string | null;
  ai_title: string | null;
  url: string | null;
};

export const displayTitle = (a: NewsArticle) =>
  (a.ai_title && a.ai_title.trim()) || a.title || "Untitled";

export const displayContent = (a: NewsArticle) =>
  (a.ai_summary && a.ai_summary.trim()) || a.content || a.description || "";

export const PAGE_SIZE = 20;

export const CATEGORIES = [
  "Business",
  "Entertainment",
  "General",
  "Health",
  "Science",
  "Sports",
  "Technology",
] as const;

export type Category = (typeof CATEGORIES)[number];

export async function fetchNews(opts: {
  category?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<NewsArticle[]> {
  const page = opts.page ?? 0;
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("NewsData")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts.category) {
    q = q.ilike("category", opts.category);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as NewsArticle[];
}

export async function fetchArticle(id: number): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from("NewsData")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as NewsArticle | null;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
