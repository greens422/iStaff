import { postEvent } from "../../actions";
import { requireProfile } from "@/lib/session";
import { Shell, buttonClass, inputClass } from "../../ui";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "location", label: "Address", type: "text" },
  { name: "startTime", label: "Starts", type: "datetime-local" },
  { name: "endTime", label: "Ends", type: "datetime-local" },
  { name: "staffNeeded", label: "Staff needed", type: "number" },
  { name: "staffType", label: "Staff type (e.g. Bartender)", type: "text" },
  { name: "certifications", label: "Required certifications (comma separated)", type: "text", optional: true },
  { name: "indoorOutdoor", label: "Indoor or outdoor?", type: "text" },
  { name: "transportationComp", label: "Transportation compensation", type: "text" },
  { name: "whatToBring", label: "What to bring", type: "text" },
  { name: "contactInfo", label: "Contact for the shift", type: "text" },
];

export default async function NewEventPage() {
  const profile = await requireProfile("coordinator");
  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">Post an event</h1>
      <form action={postEvent} className="mt-6 space-y-4">
        {FIELDS.map((f) => (
          <label key={f.name} className="block text-sm">
            {f.label}
            <input
              name={f.name}
              type={f.type}
              required={!f.optional}
              min={f.type === "number" ? 1 : undefined}
              className={`${inputClass} mt-1`}
            />
          </label>
        ))}
        <label className="block text-sm">
          Description
          <textarea name="description" required rows={3} className={`${inputClass} mt-1`} />
        </label>
        <button className={buttonClass}>Post event</button>
      </form>
    </Shell>
  );
}
