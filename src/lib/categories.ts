import {
  Briefcase,
  Film,
  Newspaper,
  HeartPulse,
  FlaskConical,
  Trophy,
  Cpu,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type CategoryMeta = {
  name: string;
  icon: LucideIcon;
  color: string; // tailwind bg utility class using semantic tokens
  text: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  Business: { name: "Business", icon: Briefcase, color: "bg-cat-business", text: "text-white" },
  Entertainment: { name: "Entertainment", icon: Film, color: "bg-cat-entertainment", text: "text-white" },
  General: { name: "General", icon: Newspaper, color: "bg-cat-general", text: "text-white" },
  Health: { name: "Health", icon: HeartPulse, color: "bg-cat-health", text: "text-white" },
  Science: { name: "Science", icon: FlaskConical, color: "bg-cat-science", text: "text-white" },
  Sports: { name: "Sports", icon: Trophy, color: "bg-cat-sports", text: "text-white" },
  Technology: { name: "Technology", icon: Cpu, color: "bg-cat-technology", text: "text-white" },
};

export const ALL_META: CategoryMeta = {
  name: "All",
  icon: LayoutGrid,
  color: "bg-primary",
  text: "text-primary-foreground",
};

export function metaFor(cat: string | null | undefined): CategoryMeta {
  if (!cat) return { name: "General", icon: Newspaper, color: "bg-cat-general", text: "text-white" };
  // case-insensitive match
  const key = Object.keys(CATEGORY_META).find(
    (k) => k.toLowerCase() === cat.toLowerCase(),
  );
  return key ? CATEGORY_META[key] : CATEGORY_META.General;
}
