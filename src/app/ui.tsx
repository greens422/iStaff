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
        <Link href="/events" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <img src="/icon.png" alt="" className="h-7 w-7 rounded-md" />
          iStaff
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm">
          <Link href="/events">Hub</Link>
          {profile.role === "staff" && <Link href="/schedule">My Schedule</Link>}
          <Link href="/ask">Ask</Link>
          <Link href="/messages">Messages</Link>
          {profile.role === "staff" && <Link href="/profile">Profile</Link>}
          {profile.role === "coordinator" && <Link href="/events/new">Post event</Link>}
          {profile.role === "coordinator" && <Link href="/certifications">Certifications</Link>}
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
