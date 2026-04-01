"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{session.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:text-purple-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm text-gray-600 hover:text-purple-600"
    >
      Sign in
    </button>
  );
}
