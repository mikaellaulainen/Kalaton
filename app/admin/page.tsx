"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [name, setName] = useState("");
  const [fish, setFish] = useState("");
  const [permit, setPermit] = useState("");
  const [permitUrl, setPermitUrl] = useState("");
  const [parking, setParking] = useState("");
  const [boatRamp, setBoatRamp] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Tarkistetaan kirjautuminen
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
    }

    checkAuth();
  }, []);

  async function addFishingSpot(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("fishing_spots")
      .insert({
        name,
        fish,
        permit,
        permit_url: permitUrl,
        parking,
        boat_ramp: boatRamp,
        restrictions,
        longitude: Number(longitude),
        latitude: Number(latitude),
      });

    if (error) {
      console.error("Supabase error:", error);
      setMessage("Virhe: kalastuspaikan lisääminen epäonnistui.");
      setLoading(false);
      return;
    }

    setMessage("Kalastuspaikka lisätty onnistuneesti! 🎣");

    setName("");
    setFish("");
    setPermit("");
    setPermitUrl("");
    setParking("");
    setBoatRamp("");
    setRestrictions("");
    setLongitude("");
    setLatitude("");

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Tarkistetaan kirjautuminen...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Admin
            </h1>

            <p className="text-gray-600">
              Hallitse kalastuspaikkoja
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-black hover:bg-gray-50"
          >
            Kirjaudu ulos
          </button>
        </div>

        <form
          onSubmit={addFishingSpot}
          className="space-y-5 rounded-xl bg-white p-6 shadow"
        >
          <div>
            <label className="mb-2 block font-medium text-black">
              Kalastuspaikan nimi
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Esim. Kymijoki"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Kalalajit
            </label>

            <input
              type="text"
              value={fish}
              onChange={(e) => setFish(e.target.value)}
              placeholder="Esim. Lohi, taimen, kuha"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Kalastuslupa
            </label>

            <input
              type="text"
              value={permit}
              onChange={(e) => setPermit(e.target.value)}
              placeholder="Esim. Kalastuslupa tarvitaan"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Kalastusluvan linkki
            </label>

            <input
              type="url"
              value={permitUrl}
              onChange={(e) => setPermitUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Pysäköinti
            </label>

            <textarea
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              placeholder="Esim. Pysäköintipaikkoja löytyy alueelta"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Veneluiska
            </label>

            <textarea
              value={boatRamp}
              onChange={(e) => setBoatRamp(e.target.value)}
              placeholder="Esim. Veneluiska löytyy alueelta"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Rajoitukset
            </label>

            <textarea
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="Esim. Tarkista ajantasaiset kalastusrajoitukset"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-black">
              Sijainti
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-black">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Esim. 26.95"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-black">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Esim. 60.55"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-black">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Lisätään..." : "Lisää kalastuspaikka"}
          </button>
        </form>
      </div>
    </main>
  );
}