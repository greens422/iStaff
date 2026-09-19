import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { Shell } from "../../../ui";
import { DecisionButtons } from "./DecisionButtons";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile("coordinator");
  const { events, applications, profiles } = await readDb();
  const event = events.find((e) => e.id === params.id);
  if (!event) notFound();
  const rows = applications.filter((a) => a.eventId === event.id);

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <p className="text-sm text-muted">
        {rows.filter((a) => a.status === "approved").length} of {event.staffNeeded} filled
      </p>
      {rows.length === 0 && <p className="mt-6 text-muted">No applicants yet.</p>}
      <ul className="mt-6 space-y-3">
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-card border border-line bg-surface p-4"
          >
            <div>
              <p className="font-medium">{profiles.find((p) => p.id === a.staffId)?.name}</p>
              <p className="text-sm capitalize text-muted">{a.status}</p>
            </div>
            {a.status === "interested" && <DecisionButtons applicationId={a.id} eventId={event.id} />}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
