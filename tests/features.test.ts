import { beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { addCertification, readDb, reviewCertification, sendMessage } from "@/lib/store";
import { answerQuestion } from "@/lib/ask";
import { isVerified } from "@/lib/certs";
import type { EventRow } from "@/lib/types";

const event: EventRow = {
  id: "e1",
  title: "Gala",
  description: "",
  location: "1 Main St",
  startTime: "2026-10-01T18:00:00.000Z",
  endTime: "2026-10-01T22:00:00.000Z",
  staffNeeded: 1,
  staffType: "Server",
  requiredCertifications: ["Smart Serve"],
  askDetails: {
    indoorOutdoor: "indoor",
    transportationComp: "$20 taxi voucher",
    whatToBring: "black shoes",
    contactInfo: "Jo 555-0100",
  },
  createdBy: "coord-1",
};

beforeEach(() => {
  process.env.ISTAFF_DATA_FILE = path.join(mkdtempSync(path.join(tmpdir(), "istaff-")), "db.json");
});

describe("certifications", () => {
  it("stay unverified until a coordinator approves", async () => {
    const cert = await addCertification("staff-1", "Smart Serve", { name: "c.pdf", bytes: Buffer.from("x") });
    expect(isVerified((await readDb()).certifications, "staff-1", "smart serve")).toBe(false);
    await reviewCertification(cert.id, "coord-1", "verified");
    expect(isVerified((await readDb()).certifications, "staff-1", "smart serve")).toBe(true);
    expect(isVerified((await readDb()).certifications, "staff-2", "smart serve")).toBe(false);
  });

  it("rejects an empty upload", async () => {
    await expect(addCertification("staff-1", "Smart Serve", { name: "c.pdf", bytes: Buffer.alloc(0) })).rejects.toThrow();
  });
});

describe("ask", () => {
  it("answers from the event's own details", () => {
    expect(answerQuestion(event, "What do I need to bring?")).toContain("black shoes");
    expect(answerQuestion(event, "Is transportation paid?")).toContain("taxi voucher");
    expect(answerQuestion(event, "Will it be indoor?")).toContain("indoor");
    expect(answerQuestion(event, "Do you have pets?")).toContain("Message the coordinator");
  });
});

describe("messages", () => {
  it("only flow between a staff member and a coordinator", async () => {
    await sendMessage("staff-1", "coord-1", "hi");
    await expect(sendMessage("staff-1", "staff-2", "hi")).rejects.toThrow();
    await expect(sendMessage("staff-1", "coord-1", "  ")).rejects.toThrow();
    expect((await readDb()).messages).toHaveLength(1);
  });
});
