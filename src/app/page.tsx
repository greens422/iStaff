import { signIn } from "./actions";
import { readDb } from "@/lib/store";
import { StaffDots } from "./StaffDots";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    title: "Post a shift",
    body: "A coordinator posts an event: how many staff, what role, which certifications, and the shift details.",
  },
  {
    title: "Staff mark themselves interested",
    body: "Open shifts show up on The Hub. Staff see what's required and tap in.",
  },
  {
    title: "iStaff checks for conflicts",
    body: "Before the application goes through, it's checked against everything else that staff member is pending or confirmed for. Overlapping shifts are blocked.",
  },
  {
    title: "A coordinator reviews every applicant",
    body: "No auto-accept, no matter how many people apply. Every applicant is approved or rejected by hand.",
  },
  {
    title: "Certifications are verified, not self-reported",
    body: "A staff member stays \"not qualified\" until they upload the document and a coordinator checks it.",
  },
  {
    title: "Confirmed staff and coordinators message directly",
    body: "Once someone's on the shift, questions go straight to the coordinator — no group chat noise.",
  },
];

const STAFF_FEATURES = [
  "Browse open shifts on The Hub",
  "See exactly which requirements you still need — availability, certs, transportation",
  "My Schedule keeps every pending and confirmed shift in one place",
  "Ask questions answered from the event's real details, not a generic FAQ",
];

const COORDINATOR_FEATURES = [
  "Post a shift with staff count, role, certifications, and details in one form",
  "Review every applicant and approve by hand",
  "Verify certification uploads before they count",
  "Message staff directly, one thread per person",
];

const FACTS = [
  { label: "No auto-accept", body: "Every applicant is approved by a person, every time." },
  { label: "No self-attested certs", body: "A certification only counts once a coordinator verifies it." },
  { label: "Conflict-blocked scheduling", body: "You can't apply to a shift that overlaps one you're already on." },
];

export default async function SignInPage() {
  const { profiles } = await readDb();
  return (
    <main className="relative bg-canvas">
      <StaffDots />

      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#0f2438]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2438]/90 via-[#0f2438]/70 to-[#0f2438]/95" />

        <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12">
          <header className="flex items-center gap-3">
            <img src="/icon.png" alt="" className="h-9 w-9 rounded-xl" />
            <span className="text-lg font-semibold text-white">iStaff</span>
          </header>

          <div className="flex flex-1 flex-col justify-center py-16">
            <h1 className="text-6xl font-bold leading-[0.95] tracking-tight text-white sm:text-8xl">
              Staffing.
              <br />
              Made simple.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Post a shift, find verified staff, and confirm who's showing up — all in one place.
            </p>
          </div>

          <p className="relative mx-auto mt-8 animate-bounce text-xs text-white/50">
            Scroll to learn more ↓
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-6 py-24 sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">How it works</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          From posted shift to confirmed staff
        </h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <ol className="space-y-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold text-brand">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mx-auto w-full max-w-[280px] rounded-[2rem] border border-line bg-surface p-3 shadow-sm lg:sticky lg:top-24">
            <div className="rounded-2xl bg-canvas p-4">
              <p className="text-xs font-semibold text-muted">The Hub</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-card border border-line bg-surface p-3">
                  <p className="text-xs font-semibold text-ink">Riverside Summer Festival</p>
                  <p className="mt-1 text-[11px] text-muted">Sat · 2–10pm · Bartender</p>
                  <div className="mt-2 rounded-control border border-line px-2 py-1 text-center text-[11px] text-ink">
                    I'm interested
                  </div>
                </div>
                <div className="rounded-card border border-line bg-surface p-3">
                  <p className="text-xs font-semibold text-ink">Downtown Tech Conference</p>
                  <p className="mt-1 text-[11px] text-muted">Mon · 7am–4pm · Registration</p>
                  <div className="mt-2 rounded-control bg-brand px-2 py-1 text-center text-[11px] text-brand-ink">
                    Applied
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#0f2438] py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8fc0e8]">
            One app, two sides
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Built for both roles</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">For staff</h3>
              <ul className="mt-4 space-y-3">
                {STAFF_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-white/75">
                    <span className="text-[#8fc0e8]">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">For coordinators</h3>
              <ul className="mt-4 space-y-3">
                {COORDINATOR_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-white/75">
                    <span className="text-[#8fc0e8]">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-6 py-24 sm:px-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {FACTS.map((f) => (
            <div key={f.label} className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-lg font-semibold text-ink">{f.label}</p>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-md px-6 py-24 sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Try it</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Pick who you want to be</h2>
        <p className="mt-3 text-sm text-muted">
          Demo sign-in. Real email and password sign-in comes later.
        </p>
        <div className="mt-8 space-y-3">
          {profiles.map((p) => (
            <form key={p.id} action={signIn}>
              <input type="hidden" name="userId" value={p.id} />
              <button className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm font-medium text-ink transition hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                Continue as {p.name}
              </button>
            </form>
          ))}
        </div>
      </section>

      <footer className="relative border-t border-line px-6 py-10 text-center text-sm text-muted sm:px-12">
        iStaff — a demo staffing platform. Built with Next.js.
      </footer>
    </main>
  );
}
