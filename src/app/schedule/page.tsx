import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { describeRange } from "@/lib/conflicts";
import { Shell } from "../ui";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const profile = await requireProfile("staff");
  const { events, applications } = await readDb();
  const entries = applications
    .filter((a) => a.staffId === profile.id && a.status !== "rejected")
    .flatMap((a) => {
      const event = events.find((e) => e.id === a.eventId);
      return event ? [{ event, status: a.status }] : [];
    })
    .sort((x, y) => Date.parse(x.event.startTime) - Date.parse(y.event.startTime));

  const byDay = Map.groupBy(entries, (e) =>
    new Date(e.event.startTime).toLocaleDateString("en-CA", { dateStyle: "full" }),
  );

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">My Schedule</h1>
      {entries.length === 0 && <p className="mt-6 text-muted">Nothing yet. Mark interest in an event on the Hub.</p>}
      {[...byDay].map(([day, items]) => (
        <section key={day} className="mt-6">
          <h2 className="text-sm font-medium text-muted">{day}</h2>
          <ul className="mt-2 space-y-3">
            {items.map(({ event, status }) => (
              <li key={event.id} className="rounded-card border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted">{describeRange(event)}</p>
                    <p className="text-sm text-muted">{event.location}</p>
                  </div>
                  <span
                    className={`rounded-control border px-2 py-1 text-xs ${
                      status === "approved" ? "border-ok text-ok" : "border-line text-muted"
                    }`}
                  >
                    {status === "approved" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Shell>
  );
}
