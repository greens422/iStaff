import { Fragment } from "react";
import { signIn } from "./actions";
import { readDb } from "@/lib/store";
import { StaffDots } from "./StaffDots";
import { ScrollReveal } from "./ScrollReveal";

export const dynamic = "force-dynamic";

const DAYS = ["Fri 19", "Sat 20", "Sun 21", "Mon 22", "Tue 23", "Wed 24", "Thu 25"];

const STEPS = [
  {
    title: "Post a shift",
    body: "A coordinator posts an event: how many staff, what role, which certifications, and the shift details.",
    time: "8:00 AM",
    span: 4,
    bg: "#1e3a5c",
    fg: "#ffffff",
  },
  {
    title: "Staff mark themselves interested",
    body: "Open shifts show up on The Hub. Staff see what's required and tap in.",
    time: "9:30 AM",
    span: 7,
    bg: "#3f8fd1",
    fg: "#ffffff",
  },
  {
    title: "iStaff checks for conflicts",
    body: "Before the application goes through, it's checked against everything else that staff member is pending or confirmed for. Overlapping shifts are blocked.",
    time: "11:00 AM",
    span: 5,
    bg: "#a8d4ef",
    fg: "#1a2233",
  },
  {
    title: "A coordinator reviews every applicant",
    body: "No auto-accept, no matter how many people apply. Every applicant is approved or rejected by hand.",
    time: "12:30 PM",
    span: 3,
    bg: "#2e7d32",
    fg: "#ffffff",
  },
  {
    title: "Certifications are verified, not self-reported",
    body: "A staff member stays \"not qualified\" until they upload the document and a coordinator checks it.",
    time: "2:00 PM",
    span: 6,
    bg: "#d97706",
    fg: "#ffffff",
  },
  {
    title: "Confirmed staff and coordinators message directly",
    body: "Once someone's on the shift, questions go straight to the coordinator — no group chat noise.",
    time: "3:30 PM",
    span: 2,
    bg: "#64748b",
    fg: "#ffffff",
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
    <main className="relative bg-calendar-grid">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2438]/60 via-[#0f2438]/40 to-[#0f2438]/75" />

        <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12">
          <header className="flex items-center gap-3">
            <img src="/icon.png" alt="" className="h-28 w-28 rounded-xl" />
            <span className="text-2xl font-semibold text-white">iStaff</span>
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
        <ScrollReveal className="mt-12 overflow-x-auto rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <div
            className="grid min-w-[640px] gap-x-2 gap-y-3"
            style={{ gridTemplateColumns: "84px repeat(7, minmax(0, 1fr))" }}
          >
            <div style={{ gridRow: 1, gridColumn: 1 }} />
            {DAYS.map((day, i) => (
              <div
                key={day}
                style={{ gridRow: 1, gridColumn: i + 2 }}
                className="border-b border-line pb-2 text-center text-xs font-semibold text-muted"
              >
                {day}
              </div>
            ))}

            {STEPS.map((step, i) => (
              <Fragment key={step.title}>
                <div
                  style={{ gridRow: i + 2, gridColumn: 1 }}
                  className="flex items-start justify-end pr-2 pt-4 text-right text-[11px] text-muted"
                >
                  {step.time}
                </div>
                <div
                  style={{
                    gridRow: i + 2,
                    gridColumn: `2 / span ${step.span}`,
                    background: step.bg,
                    color: step.fg,
                    transitionDelay: `${i * 90}ms`,
                  }}
                  className="calendar-bar flex min-h-[112px] flex-col justify-center gap-1.5 rounded-lg px-4 py-4"
                >
                  <p className="text-sm font-semibold">
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-xs leading-snug opacity-80">{step.body}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="relative bg-[#0f2438] py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8fc0e8]">
            One app, two sides
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Built for both roles</h2>
          <ScrollReveal className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="folder-card" style={{ "--folder-rotate": "-2deg" } as React.CSSProperties}>
              <div className="inline-flex h-9 items-center rounded-t-xl border border-[#d97706]/40 bg-[#d97706]/15 px-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-white">For staff</span>
              </div>
              <ul className="-mt-px space-y-3 rounded-b-2xl rounded-tr-2xl border border-[#d97706]/40 bg-[#d97706]/15 p-6">
                {STAFF_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-white/75">
                    <span className="text-[#fdba74]">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="folder-card"
              style={{ "--folder-rotate": "2deg", transitionDelay: "150ms" } as React.CSSProperties}
            >
              <div className="inline-flex h-9 items-center rounded-t-xl border border-[#a8d4ef]/40 bg-[#a8d4ef]/15 px-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-white">For coordinators</span>
              </div>
              <ul className="-mt-px space-y-3 rounded-b-2xl rounded-tr-2xl border border-[#a8d4ef]/40 bg-[#a8d4ef]/15 p-6">
                {COORDINATOR_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-white/75">
                    <span className="text-[#a8d4ef]">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
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

      <section className="relative overflow-hidden py-24">
        <img
          src="/signin-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "55% 30%" }}
        />
        <div className="absolute inset-0 bg-[#1e3a5c]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2438]/30 via-[#0f2438]/40 to-[#0f2438]/75" />

        <div className="relative mx-auto max-w-md px-6 sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8fc0e8]">Try it</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Pick who you want to be</h2>
          <p className="mt-3 text-sm text-white/70">
            Demo sign-in. Real email and password sign-in comes later.
          </p>
          <ScrollReveal className="mt-8">
            <div className="phone-float mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
              <div className="rounded-[2rem] bg-[#0f2438]/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">iStaff</p>
                <div className="mt-4 space-y-3">
                  {profiles.map((p, i) => (
                    <form
                      key={p.id}
                      action={signIn}
                      className="signin-item"
                      style={{ transitionDelay: `${i * 120}ms` }}
                    >
                      <input type="hidden" name="userId" value={p.id} />
                      <button className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Continue as {p.name}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="relative border-t border-line px-6 py-10 text-center text-sm text-muted sm:px-12">
        iStaff — a demo staffing platform. Built with Next.js.
      </footer>
    </main>
  );
}
