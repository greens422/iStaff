import { beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createEvent, decideApplication, expressInterest, readDb } from "@/lib/store";
import type { EventRow } from "@/lib/types";

function eventInput(title: string, start: string, end: string): Omit<EventRow, "id"> {
  return {
    title,
    description: "d",
    location: "1 Main St",
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
    staffNeeded: 2,
    staffType: "Server",
    requiredCertifications: [],
    askDetails: { indoorOutdoor: "", transportationComp: "", whatToBring: "", contactInfo: "" },
    createdBy: "coord-1",
  };
}

beforeEach(() => {
  process.env.ISTAFF_DATA_FILE = path.join(mkdtempSync(path.join(tmpdir(), "istaff-")), "db.json");
});

describe("core loop", () => {
  it("rejects an event that ends before it starts", async () => {
    await expect(
      createEvent(eventInput("Bad", "2026-10-01T18:00", "2026-10-01T17:00")),
    ).rejects.toThrow("End time");
  });

  it("blocks an overlapping second interest and names the clash", async () => {
    const a = await createEvent(eventInput("Gala", "2026-10-01T18:00", "2026-10-01T22:00"));
    const b = await createEvent(eventInput("Wedding", "2026-10-01T21:00", "2026-10-02T01:00"));
    expect(await expressInterest(a.id, "staff-1")).toEqual({ ok: true });
    const result = await expressInterest(b.id, "staff-1");
    expect(result.ok).toBe(false);
    expect(!result.ok && result.message).toContain("Gala");
    expect((await readDb()).applications).toHaveLength(1);
  });

  it("allows back-to-back events and other staff on the same slot", async () => {
    const a = await createEvent(eventInput("Gala", "2026-10-01T18:00", "2026-10-01T22:00"));
    const b = await createEvent(eventInput("Late", "2026-10-01T22:00", "2026-10-02T01:00"));
    expect(await expressInterest(a.id, "staff-1")).toEqual({ ok: true });
    expect(await expressInterest(b.id, "staff-1")).toEqual({ ok: true });
    expect(await expressInterest(a.id, "staff-2")).toEqual({ ok: true });
  });

  it("frees the slot when a coordinator rejects, keeps it when approved", async () => {
    const a = await createEvent(eventInput("Gala", "2026-10-01T18:00", "2026-10-01T22:00"));
    const b = await createEvent(eventInput("Wedding", "2026-10-01T21:00", "2026-10-02T01:00"));
    await expressInterest(a.id, "staff-1");
    const [app] = (await readDb()).applications;
    await decideApplication(app.id, "approved");
    expect((await expressInterest(b.id, "staff-1")).ok).toBe(false);
    await decideApplication(app.id, "rejected");
    expect((await expressInterest(b.id, "staff-1")).ok).toBe(true);
  });
});
