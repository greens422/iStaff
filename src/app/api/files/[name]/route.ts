import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { getProfile, uploadsDir } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const profile = await getProfile(cookies().get(SESSION_COOKIE)?.value);
  if (profile?.role !== "coordinator") return new Response("Forbidden", { status: 403 });
  const safe = path.basename(params.name);
  try {
    const bytes = await fs.readFile(path.join(uploadsDir(), safe));
    return new Response(bytes);
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
