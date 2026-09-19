import type { Application, EventRow } from "./types";

const HOLDING = new Set(["interested", "approved"]);

export function findConflict(
  candidate: EventRow,
  staffId: string,
  applications: Application[],
  events: EventRow[],
): EventRow | undefined {
  const start = Date.parse(candidate.startTime);
  const end = Date.parse(candidate.endTime);
  const heldIds = new Set(
    applications
      .filter((a) => a.staffId === staffId && HOLDING.has(a.status))
      .map((a) => a.eventId),
  );
  return events.find(
    (e) =>
      e.id !== candidate.id &&
      heldIds.has(e.id) &&
      Date.parse(e.startTime) < end &&
      start < Date.parse(e.endTime),
  );
}

export function describeRange(event: EventRow): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${fmt.format(new Date(event.startTime))} – ${fmt.format(new Date(event.endTime))}`;
}
