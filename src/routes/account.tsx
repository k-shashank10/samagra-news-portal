import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronRight,
  Info,
  Moon,
  Sun,
  Trash2,
  Type,
  Laptop,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { clearSaved, useSavedIds } from "@/lib/saved-store";
import { usePrefs, type TextSize, type Theme } from "@/lib/prefs-store";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const saved = useSavedIds();
  const { theme, textSize, setTheme, setTextSize } = usePrefs();

  return (
    <AppShell title="Account">
      <div className="space-y-6 px-4 pb-4 pt-4">
        <Section title="Appearance">
          <Row icon={themeIcon(theme)} label="Theme">
            <Segmented<Theme>
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "Auto" },
              ]}
            />
          </Row>
          <Row icon={<Type className="h-4 w-4" />} label="Reading size">
            <Segmented<TextSize>
              value={textSize}
              onChange={setTextSize}
              options={[
                { value: "sm", label: "S" },
                { value: "md", label: "M" },
                { value: "lg", label: "L" },
              ]}
            />
          </Row>
        </Section>

        <Section title="Your data">
          <Link
            to="/saved"
            className="flex items-center justify-between rounded-xl border bg-card px-4 py-3.5 shadow-sm hover:bg-muted/40"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bookmark className="h-4 w-4" />
              </span>
              <span className="font-medium">Saved articles</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {saved.length}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
          <button
            onClick={() => {
              if (saved.length === 0) return;
              if (confirm(`Clear all ${saved.length} saved article${saved.length === 1 ? "" : "s"}?`)) {
                clearSaved();
              }
            }}
            disabled={saved.length === 0}
            className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3.5 shadow-sm hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </span>
              <span className="font-medium">Clear saved articles</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </Section>

        <Section title="About">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
                <Info className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold">Samagra News</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Concise, AI-summarised headlines across business, tech,
                  health, sports and more — mobile first.
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Version</dt>
                    <dd className="font-medium">1.0.0</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Content</dt>
                    <dd className="font-medium">Read-only</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            Made with care · Samagra News © {new Date().getFullYear()}
          </p>
        </Section>
      </div>
    </AppShell>
  );
}

function themeIcon(theme: Theme) {
  if (theme === "dark") return <Moon className="h-4 w-4" />;
  if (theme === "light") return <Sun className="h-4 w-4" />;
  return <Laptop className="h-4 w-4" />;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm">
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-full bg-muted p-0.5 text-xs font-medium">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1.5 transition ${
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
