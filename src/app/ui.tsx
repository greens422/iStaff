import Link from "next/link";
import { signOut } from "./actions";
import type { Profile } from "@/lib/types";

export const buttonClass =
  "rounded-control bg-brand px-4 py-2 text-sm font-medium text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50";

export const outlineButtonClass =
  "rounded-control border border-line bg-surface px-4 py-2 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const inputClass =
  "w-full rounded-control border border-line bg-surface px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";

export function Shell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <header className="flex items-center justify-between py-5">
        <Link href="/events" className="text-lg font-semibold text-brand">
          iStaff
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {profile.role === "coordinator" && <Link href="/events/new">Post event</Link>}
          <span className="text-muted">{profile.name}</span>
          <form action={signOut}>
            <button className="underline">Sign out</button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
