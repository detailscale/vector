"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BugPlay, Phone } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/login/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        try {
          const data = await res.json();
          setError(data?.error || "please check your credentials");
        } catch {
          setError("please check your credentials");
        }
        return;
      }
      router.push("/ops");
    } catch {
      setError("network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="blp_prop">
      <div className="min-h-screen bg-black text-white flex">
        <div className="flex-1 p-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-12">Operator Panel</h1>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm mb-2">
                  Login Name
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#ff9e2a] text-black px-3 py-1 text-sm font-mono placeholder:text-black/60"
                  placeholder="operator username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#ff9e2a] text-black px-3 py-1 text-sm font-mono placeholder:text-black/60"
                  placeholder="password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-neutral-600 uppercase disabled:opacity-60 text-white px-6 py-2 text-sm hover:bg-neutral-500 transition-colors"
              >
                {submitting ? "executing" : "login"}
              </button>
              {error && (
                <div className="text-sm text-red-400">fault: {error}</div>
              )}
            </form>

            <div className="mt-8">
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Redirect to Student Login
              </a>
            </div>

            <div className="mt-12 space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Contact Us
                </a>
              </div>
              <div className="flex items-center text-sm">
                <BugPlay className="h-4 w-4 mr-2" />
                <button id="thisIsUsedInDevIgnoreIt">
                  <p className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Attach Debugger
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-16 text-xs text-neutral-400 space-y-1">
              <p>
                S/N XXXXXX-X | SID XXXXXXX-X | Version XX XXX XX | Netid XXXX
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:flex hidden">
          <div className="max-w-lg">
            <h2 className="text-lg mb-6">Availble user accounts (local)</h2>

            <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <div>
                <div className="mb-1">s</div>
                <div className="text-orange-400">test1</div>
                <div className="text-orange-400">test2</div>
                <div className="text-orange-400">test3</div>
              </div>
              <div>
                <div className="text-orange-400">test4</div>
                <div className="text-orange-400">test5</div>
              </div>
            </div>

            <div className="mt-8 text-sm">
              <p>Contact [MASTER] for accounts database (in development)</p>
              <p>For any issues, please reach out to support.</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-8 right-8 text-xs text-neutral-400 leading-relaxed">
          <p className="text-pretty">
            Note: This login only works with operator accounts, for other users,
            visit{" "}
            <a href="/login" className="text-cyan-400 hover:text-cyan-300">
              this page
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
