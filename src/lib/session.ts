import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "./store";
import type { Profile, Role } from "./types";

export const SESSION_COOKIE = "istaff-user";

export async function requireProfile(role?: Role): Promise<Profile> {
  const profile = await getProfile(cookies().get(SESSION_COOKIE)?.value);
  if (!profile) redirect("/");
  if (role && profile.role !== role) redirect("/events");
  return profile;
}
