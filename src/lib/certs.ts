import type { Certification, EventRow } from "./types";

export function isVerified(certs: Certification[], staffId: string, name: string): boolean {
  const wanted = name.trim().toLowerCase();
  return certs.some(
    (c) => c.staffId === staffId && c.status === "verified" && c.name.trim().toLowerCase() === wanted,
  );
}

export function missingCertifications(event: EventRow, certs: Certification[], staffId: string): string[] {
  return event.requiredCertifications.filter((name) => !isVerified(certs, staffId, name));
}
