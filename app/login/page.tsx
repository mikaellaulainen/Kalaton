"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setMessage("Kirjautuminen epäonnistui.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-black">
          Admin-kirjautuminen
        </h1>

        <p className="mb-6 text-gray-600">
          Kirjaudu hallinnoidaksesi kalastuspaikkoja.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block font-medium text-black">
              Sähköposti
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sahkoposti@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Salasana
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>
      </div>
    </main>
  );
}