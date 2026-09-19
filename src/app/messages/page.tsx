import Link from "next/link";
import { requireProfile } from "@/lib/session";
import { COORDINATOR_ID, readDb } from "@/lib/store";
import { postMessage } from "../actions";
import { Shell, buttonClass, inputClass } from "../ui";

export const dynamic = "force-dynamic";

export default async function MessagesPage({ searchParams }: { searchParams: { with?: string } }) {
  const profile = await requireProfile();
  const { profiles, messages } = await readDb();
  const others = profiles.filter((p) => p.role !== profile.role);
  const partner =
    profile.role === "staff"
      ? profiles.find((p) => p.id === COORDINATOR_ID)
      : others.find((p) => p.id === searchParams.with) ?? others[0];
  const thread = partner
    ? messages.filter(
        (m) =>
          (m.senderId === profile.id && m.recipientId === partner.id) ||
          (m.senderId === partner.id && m.recipientId === profile.id),
      )
    : [];

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">Messages</h1>
      {profile.role === "coordinator" && (
        <nav aria-label="Conversations" className="mt-4 flex gap-2">
          {others.map((p) => (
            <Link
              key={p.id}
              href={`/messages?with=${p.id}`}
              aria-current={p.id === partner?.id ? "page" : undefined}
              className={`rounded-control border px-3 py-1 text-sm ${
                p.id === partner?.id ? "border-brand text-brand" : "border-line"
              }`}
            >
              {p.name}
            </Link>
          ))}
        </nav>
      )}
      {partner && (
        <>
          <p className="mt-4 text-sm text-muted">Chat with {partner.name}</p>
          <ul className="mt-3 space-y-2">
            {thread.length === 0 && <li className="text-muted">No messages yet.</li>}
            {thread.map((m) => (
              <li
                key={m.id}
                className={`max-w-[80%] rounded-card px-3 py-2 text-sm ${
                  m.senderId === profile.id
                    ? "ml-auto bg-brand text-brand-ink"
                    : "border border-line bg-surface"
                }`}
              >
                {m.body}
              </li>
            ))}
          </ul>
          <form action={postMessage} className="mt-4 flex gap-2">
            <input type="hidden" name="to" value={partner.id} />
            <input name="body" required aria-label="Message" className={inputClass} />
            <button className={buttonClass}>Send</button>
          </form>
        </>
      )}
    </Shell>
  );
}
