import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { uploadCertification } from "../actions";
import { Shell, buttonClass, inputClass } from "../ui";

export const dynamic = "force-dynamic";

const LABEL = { pending: "Not verified (awaiting review)", verified: "Verified", rejected: "Rejected" };

export default async function ProfilePage() {
  const profile = await requireProfile("staff");
  const { events, applications, certifications } = await readDb();
  const worked = applications
    .filter((a) => a.staffId === profile.id && a.status === "approved")
    .flatMap((a) => events.filter((e) => e.id === a.eventId));
  const mine = certifications.filter((c) => c.staffId === profile.id);
  const joined = new Date(profile.joinedAt).toLocaleDateString("en-CA", { month: "long", year: "numeric" });

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">{profile.name}</h1>
      <p className="text-sm text-muted">Joined {joined}</p>

      <h2 className="mt-8 text-lg font-medium">Events worked</h2>
      {worked.length === 0 ? (
        <p className="mt-2 text-muted">None yet.</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm">
          {worked.map((e) => (
            <li key={e.id}>{e.title}</li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-medium">Certifications</h2>
      {mine.length === 0 && <p className="mt-2 text-muted">None uploaded.</p>}
      <ul className="mt-2 space-y-2">
        {mine.map((c) => (
          <li key={c.id} className="rounded-card border border-line bg-surface p-3 text-sm">
            <span className="font-medium">{c.name}</span>{" "}
            <span className={c.status === "verified" ? "text-ok" : c.status === "rejected" ? "text-danger" : "text-muted"}>
              {LABEL[c.status]}
            </span>
          </li>
        ))}
      </ul>

      <form action={uploadCertification} className="mt-6 space-y-3">
        <label className="block text-sm">
          Certification name
          <input name="name" required className={`${inputClass} mt-1`} />
        </label>
        <label className="block text-sm">
          Document
          <input name="file" type="file" required className={`${inputClass} mt-1`} />
        </label>
        <button className={buttonClass}>Upload for review</button>
      </form>
    </Shell>
  );
}
