import { signIn } from "./actions";
import { readDb } from "@/lib/store";
import { buttonClass } from "./ui";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { profiles } = await readDb();
  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-3xl font-semibold text-brand">iStaff</h1>
      <p className="mt-2 text-muted">
        Demo sign-in. Pick who you want to be. Real email and password sign-in comes later.
      </p>
      <div className="mt-8 space-y-3">
        {profiles.map((p) => (
          <form key={p.id} action={signIn}>
            <input type="hidden" name="userId" value={p.id} />
            <button className={`${buttonClass} w-full text-left`}>Continue as {p.name}</button>
          </form>
        ))}
      </div>
    </main>
  );
}
