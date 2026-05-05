import { redirect } from "next/navigation";
import {
  continueAsGuestAction,
  sendMagicLinkAction,
} from "@/actions/auth";
import { getCurrentUser } from "@/server/auth/currentUser";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const { message } = await searchParams;

  if (user && !user.isAnonymous) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-4 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              SubTrack
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              {user?.isAnonymous ? "Upgrade guest account" : "Sign in"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {user?.isAnonymous
                ? "Add an email to keep your guest subscriptions and continue without the trial cap."
                : "Use a magic link or continue as a guest with a limited trial workspace."}
            </p>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              {message}
            </div>
          )}

          <form action={sendMagicLinkAction} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-900">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              {user?.isAnonymous ? "Send upgrade link" : "Send magic link"}
            </button>
          </form>

          {!user && (
            <form action={continueAsGuestAction} className="mt-3">
              <button
                type="submit"
                className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue as guest
              </button>
            </form>
          )}

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Guest mode is limited to 10 subscriptions and does not include import
            or export. Clearing browser data can remove guest access.
          </p>
        </div>
      </div>
    </main>
  );
}
