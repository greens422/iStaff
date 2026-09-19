import Link from "next/link";
import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { describeRange } from "@/lib/conflicts";
import { Shell, outlineButtonClass } from "../ui";
import { InterestButton } from "./InterestButton";

export const dynamic = "force-dynamic";

export default async function HubPage() {
  const profile = await requireProfile();
  const { events, applications } = await readDb();
  const mine = new Map(
    applications.filter((a) => a.staffId === profile.id).map((a) => [a.eventId, a.status]),
  );

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">The Hub</h1>
      {events.length === 0 && (
        <p className="mt-6 text-muted">
          No events yet.{" "}
          {profile.role === "coordinator" ? "Post the first one." : "Check back soon."}
        </p>
      )}
      <ul className="mt-6 space-y-4">
        {events.map((event) => (
          <li key={event.id} className="rounded-card border border-line bg-surface p-5">
            <h2 className="text-lg font-medium">{event.title}</h2>
            <p className="text-sm text-muted">{describeRange(event)}</p>
            <p className="text-sm text-muted">{event.location}</p>
            <p className="mt-3 text-sm">{event.description}</p>
            <p className="mt-3 text-sm">
              {event.staffNeeded} × {event.staffType}
              {event.requiredCertifications.length > 0 &&
                ` · Needs: ${event.requiredCertifications.join(", ")}`}
            </p>
            <div className="mt-4">
              {profile.role === "staff" ? (
                <InterestButton eventId={event.id} applied={mine.has(event.id)} />
              ) : (
                <Link href={`/events/${event.id}/applicants`} className={outlineButtonClass}>
                  Review applicants
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
