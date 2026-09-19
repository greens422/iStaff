import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { SUGGESTED_QUESTIONS, answerQuestion } from "@/lib/ask";
import { Shell, buttonClass, inputClass } from "../ui";

export const dynamic = "force-dynamic";

export default async function AskPage({
  searchParams,
}: {
  searchParams: { event?: string; q?: string };
}) {
  const profile = await requireProfile();
  const { events } = await readDb();
  const event = events.find((e) => e.id === searchParams.event) ?? events[0];
  const question = searchParams.q?.trim();

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">Ask</h1>
      {!event ? (
        <p className="mt-6 text-muted">No events to ask about yet.</p>
      ) : (
        <form method="get" className="mt-6 space-y-4">
          <label className="block text-sm">
            Event
            <select name="event" defaultValue={event.id} className={`${inputClass} mt-1`}>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Your question
            <input name="q" defaultValue={question} list="suggestions" required className={`${inputClass} mt-1`} />
            <datalist id="suggestions">
              {SUGGESTED_QUESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <button className={buttonClass}>Ask</button>
          {question && (
            <p role="status" className="rounded-card border border-line bg-surface p-4 text-sm">
              {answerQuestion(event, question)}
            </p>
          )}
        </form>
      )}
    </Shell>
  );
}
