"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function AuthButton() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.2 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-100 pl-2 pr-3 py-1 transition-colors"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="avatar"
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="w-7 h-7 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">
            {session.user?.name?.[0] ?? "?"}
          </div>
        )}
        <span className="text-sm text-gray-700 max-w-[120px] truncate">
          {session.user?.name?.split(" ")[0]}
        </span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-800 truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>👤</span> My Account
          </Link>
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>🚀</span> Upgrade Plan
          </Link>
          <div className="border-t border-gray-100 mt-1" />
          <button
            onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span>↩️</span> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
