import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  return (
    <AppShell title="Account">
      <div className="mx-auto max-w-sm px-6 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">Your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Coming soon — preferences, reading history and personalised topics will live here.
        </p>
      </div>
    </AppShell>
  );
}
