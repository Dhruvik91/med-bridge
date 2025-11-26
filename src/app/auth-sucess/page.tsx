"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

type Status = "idle" | "validating" | "missing" | "done";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loading } = useAuth();

  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("missing");
      return;
    }

    // AuthProvider will pick the token from the URL, store it, and redirect.
    setStatus("validating");
  }, [searchParams]);

  useEffect(() => {
    if (!loading && status === "validating") {
      // In normal flow, AuthProvider will already have redirected to /dashboard.
      // This is a fallback in case redirect did not happen for some reason.
      setStatus("done");
      router.replace("/dashboard");
    }
  }, [loading, status, router]);

  if (status === "missing") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-50 mb-2">Invalid callback</h1>
          <p className="text-sm text-slate-300 mb-6">
            We couldn&apos;t find a valid authentication token in the URL. Please
            try signing in with Google again.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/auth/signin")}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
          >
            Go back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
        <h1 className="text-xl font-semibold text-slate-50 mb-2">
          Authenticating your account
        </h1>
        <p className="text-sm text-slate-300">
          Please wait while we securely verify your login with Google.
        </p>
      </div>
    </main>
  );
}

