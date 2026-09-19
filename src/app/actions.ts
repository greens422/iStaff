"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, requireProfile } from "@/lib/session";
import { createEvent, decideApplication, expressInterest, getProfile } from "@/lib/store";
import type { InterestResult } from "@/lib/store";

export async function signIn(formData: FormData): Promise<void> {
  const profile = await getProfile(String(formData.get("userId")));
  if (!profile) redirect("/");
  cookies().set(SESSION_COOKIE, profile.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect("/events");
}

export async function signOut(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
  redirect("/");
}

export async function postEvent(formData: FormData): Promise<void> {
  const coordinator = await requireProfile("coordinator");
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  await createEvent({
    title: text("title"),
    description: text("description"),
    location: text("location"),
    startTime: new Date(text("startTime")).toISOString(),
    endTime: new Date(text("endTime")).toISOString(),
    staffNeeded: Number(text("staffNeeded")),
    staffType: text("staffType"),
    requiredCertifications: text("certifications")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    askDetails: {
      indoorOutdoor: text("indoorOutdoor"),
      transportationComp: text("transportationComp"),
      whatToBring: text("whatToBring"),
      contactInfo: text("contactInfo"),
    },
    createdBy: coordinator.id,
  });
  revalidatePath("/events");
  redirect("/events");
}

export async function showInterest(eventId: string): Promise<InterestResult> {
  const staff = await requireProfile("staff");
  const result = await expressInterest(eventId, staff.id);
  revalidatePath("/events");
  return result;
}

export async function decide(
  applicationId: string,
  eventId: string,
  status: "approved" | "rejected",
): Promise<void> {
  await requireProfile("coordinator");
  await decideApplication(applicationId, status);
  revalidatePath(`/events/${eventId}/applicants`);
}
