import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { findConflict, describeRange } from "./conflicts";
import type { Application, Database, EventRow, Profile } from "./types";

const SEED: Database = {
  profiles: [
    { id: "coord-1", role: "coordinator", name: "Casey (Coordinator)" },
    { id: "staff-1", role: "staff", name: "Sam (Staff)" },
    { id: "staff-2", role: "staff", name: "Riley (Staff)" },
  ],
  events: [],
  applications: [],
};

function dataFile(): string {
  return process.env.ISTAFF_DATA_FILE ?? path.join(process.cwd(), ".data", "db.json");
}

export async function readDb(): Promise<Database> {
  try {
    return JSON.parse(await fs.readFile(dataFile(), "utf8")) as Database;
  } catch {
    await writeDb(SEED);
    return structuredClone(SEED);
  }
}

async function writeDb(db: Database): Promise<void> {
  await fs.mkdir(path.dirname(dataFile()), { recursive: true });
  await fs.writeFile(dataFile(), JSON.stringify(db, null, 2));
}

export async function getProfile(id: string | undefined): Promise<Profile | undefined> {
  return (await readDb()).profiles.find((p) => p.id === id);
}

export async function createEvent(input: Omit<EventRow, "id">): Promise<EventRow> {
  if (Date.parse(input.endTime) <= Date.parse(input.startTime)) {
    throw new Error("End time must be after start time.");
  }
  const db = await readDb();
  const event = { ...input, id: randomUUID() };
  db.events.push(event);
  await writeDb(db);
  return event;
}

export type InterestResult =
  | { ok: true }
  | { ok: false; message: string };

export async function expressInterest(eventId: string, staffId: string): Promise<InterestResult> {
  const db = await readDb();
  const event = db.events.find((e) => e.id === eventId);
  if (!event) return { ok: false, message: "That event no longer exists." };
  if (db.applications.some((a) => a.eventId === eventId && a.staffId === staffId)) {
    return { ok: false, message: "You have already applied to this event." };
  }
  const clash = findConflict(event, staffId, db.applications, db.events);
  if (clash) {
    return {
      ok: false,
      message: `Clashes with "${clash.title}" (${describeRange(clash)}).`,
    };
  }
  const application: Application = {
    id: randomUUID(),
    eventId,
    staffId,
    status: "interested",
    createdAt: new Date().toISOString(),
  };
  db.applications.push(application);
  await writeDb(db);
  return { ok: true };
}

export async function decideApplication(
  applicationId: string,
  status: "approved" | "rejected",
): Promise<void> {
  const db = await readDb();
  const application = db.applications.find((a) => a.id === applicationId);
  if (!application) throw new Error("Application not found.");
  application.status = status;
  await writeDb(db);
}
