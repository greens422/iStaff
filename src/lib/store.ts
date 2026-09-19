import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { findConflict, describeRange } from "./conflicts";
import type { Application, Certification, Database, EventRow, Message, Profile } from "./types";

const SEED: Database = {
  profiles: [
    { id: "coord-1", role: "coordinator", name: "Casey (Coordinator)", joinedAt: "2026-01-05T00:00:00.000Z" },
    { id: "staff-1", role: "staff", name: "Sam (Staff)", joinedAt: "2026-03-12T00:00:00.000Z" },
    { id: "staff-2", role: "staff", name: "Riley (Staff)", joinedAt: "2026-06-20T00:00:00.000Z" },
  ],
  events: [],
  applications: [],
  certifications: [],
  messages: [],
};

export const COORDINATOR_ID = "coord-1";

export function uploadsDir(): string {
  return path.join(path.dirname(dataFile()), "uploads");
}

function dataFile(): string {
  return process.env.ISTAFF_DATA_FILE ?? path.join(process.cwd(), ".data", "db.json");
}

export async function readDb(): Promise<Database> {
  try {
    const stored = JSON.parse(await fs.readFile(dataFile(), "utf8")) as Partial<Database>;
    return { ...structuredClone(SEED), ...stored };
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

export async function addCertification(
  staffId: string,
  name: string,
  file: { name: string; bytes: Buffer },
): Promise<Certification> {
  if (!name.trim()) throw new Error("Certification name is required.");
  if (file.bytes.length === 0) throw new Error("Choose a file to upload.");
  const id = randomUUID();
  const fileName = `${id}${path.extname(file.name)}`;
  await fs.mkdir(uploadsDir(), { recursive: true });
  await fs.writeFile(path.join(uploadsDir(), fileName), file.bytes);
  const db = await readDb();
  const cert: Certification = { id, staffId, name: name.trim(), fileName, status: "pending" };
  db.certifications.push(cert);
  await writeDb(db);
  return cert;
}

export async function reviewCertification(
  certId: string,
  coordinatorId: string,
  status: "verified" | "rejected",
): Promise<void> {
  const db = await readDb();
  const cert = db.certifications.find((c) => c.id === certId);
  if (!cert) throw new Error("Certification not found.");
  cert.status = status;
  cert.verifiedBy = coordinatorId;
  cert.verifiedAt = new Date().toISOString();
  await writeDb(db);
}

export async function sendMessage(senderId: string, recipientId: string, body: string): Promise<Message> {
  const db = await readDb();
  const sender = db.profiles.find((p) => p.id === senderId);
  const recipient = db.profiles.find((p) => p.id === recipientId);
  if (!sender || !recipient || sender.role === recipient.role) {
    throw new Error("Messages go between one staff member and one coordinator.");
  }
  if (!body.trim()) throw new Error("Message is empty.");
  const message: Message = {
    id: randomUUID(),
    senderId,
    recipientId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  db.messages.push(message);
  await writeDb(db);
  return message;
}
