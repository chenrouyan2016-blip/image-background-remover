"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

// 模拟数据，后期接 D1 数据库
const MOCK_USER_DATA = {
  plan: "Free",
  creditsUsed: 2,
  creditsTotal: 3,
  memberSince: "April 2026",
  history: [] as { id: string; date: string; status: string }[],
};

function CreditBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min((used / total) * 100, 100);
  const remaining = total - used;
  const isLow = remaining <= 1;
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Credits used</span>
        <span className={`font-semibold ${isLow ? "text-red-500" : "text-gray-800"}`}>
          {used} / {total}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? "bg-red-400" : "bg-purple-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-xs mt-1.5 ${isLow ? "text-red-500 font-medium" : "text-gray-400"}`}>
        {remaining === 0
          ? "No credits left — upgrade to continue"
          : `${remaining} credit${remaining !== 1 ? "s" : ""} remaining`}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your dashboard</h2>
          <p className="text-gray-500 mb-6">Track your usage and manage your account.</p>
          <button
            onClick={() => signIn("google")}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const data = MOCK_USER_DATA;
  const remaining = data.creditsTotal - data.creditsUsed;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Profile card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full mb-3"
                />
              ) : (
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">👤</span>
                </div>
              )}
              <p className="font-semibold text-gray-900">{session.user?.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{session.user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                {data.plan} Plan
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">Member since {data.memberSince}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            Sign out
          </button>
        </div>

        {/* Right: Usage + Upgrade */}
        <div className="md:col-span-2 space-y-4">

          {/* Credits card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Credits</h2>
            <CreditBar used={data.creditsUsed} total={data.creditsTotal} />

            {remaining === 0 && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                You&apos;ve used all your free credits.
              </div>
            )}
          </div>

          {/* Upgrade card */}
          {data.plan === "Free" && (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-lg mb-1">Upgrade to Pro</p>
                  <p className="text-purple-200 text-sm mb-4">
                    Get 100 full-HD images/month for $12. Or buy a one-time credit pack from $5.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/pricing"
                      className="bg-white text-purple-600 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-purple-50 transition-colors"
                    >
                      See plans →
                    </Link>
                    <a
                      href="mailto:support@imageremover.shop?subject=Interested in Pro Plan"
                      className="border border-purple-300 text-white font-medium px-5 py-2 rounded-lg text-sm hover:bg-purple-500 transition-colors"
                    >
                      Join waitlist
                    </a>
                  </div>
                </div>
                <span className="text-4xl ml-4">🚀</span>
              </div>
            </div>
          )}

          {/* History card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Processing History</h2>
            {data.history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm">No images processed yet.</p>
                <Link
                  href="/"
                  className="inline-block mt-3 text-sm text-purple-600 hover:underline"
                >
                  Remove a background →
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {data.history.map((h) => (
                  <li key={h.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-600">{h.date}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      h.status === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                    }`}>{h.status}</span>
                  </li>
                ))}
              </ul>
            )}
            {data.plan === "Free" && (
              <p className="text-xs text-gray-400 mt-4">
                Full processing history available on{" "}
                <Link href="/pricing" className="text-purple-500 hover:underline">Pro plan</Link>.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
