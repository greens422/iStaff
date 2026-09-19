import { requireProfile } from "@/lib/session";
import { readDb } from "@/lib/store";
import { Shell } from "../ui";
import { CertButtons } from "./CertButtons";

export const dynamic = "force-dynamic";

export default async function CertificationQueuePage() {
  const profile = await requireProfile("coordinator");
  const { certifications, profiles } = await readDb();
  const pending = certifications.filter((c) => c.status === "pending");

  return (
    <Shell profile={profile}>
      <h1 className="text-2xl font-semibold">Certification queue</h1>
      {pending.length === 0 && <p className="mt-6 text-muted">Nothing waiting for review.</p>}
      <ul className="mt-6 space-y-3">
        {pending.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">{profiles.find((p) => p.id === c.staffId)?.name}</p>
              <a href={`/api/files/${c.fileName}`} target="_blank" rel="noreferrer" className="text-sm underline">
                View document
              </a>
            </div>
            <CertButtons certId={c.id} />
          </li>
        ))}
      </ul>
    </Shell>
  );
}
