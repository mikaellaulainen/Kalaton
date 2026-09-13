
"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [dbSpots, setDbSpots] = useState<any[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [search, setSearch] = useState("");

  // Haetaan kalastuspaikat Supabasesta
  useEffect(() => {
    async function loadSpots() {
      const { data, error } = await supabase
        .from("fishing_spots")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      console.log("Supabase spots:", data);
      setDbSpots(data);
    }

    loadSpots();
  }, []);

  // Luodaan kartta
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [25.5, 61.5],
      zoom: 6,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Lisätään Supabasesta haetut paikat kartalle
  useEffect(() => {
    if (!mapRef.current || dbSpots.length === 0) return;

    dbSpots.forEach((spot) => {
      new maplibregl.Marker()
        .setLngLat([spot.longitude, spot.latitude])
        .setPopup(
          new maplibregl.Popup({ maxWidth: "320px" }).setHTML(`
            <div style="color: #111; font-family: sans-serif;">
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 12px;">
                🎣 ${spot.name}
              </h3>

              <div style="margin-bottom: 8px;">
                <strong>🐟 Kalalajit</strong>
                <div>${spot.fish}</div>
              </div>

              <div style="margin-bottom: 8px;">
                <strong>🎫 Kalastuslupa</strong>
                <div>${spot.permit}</div>
              </div>

              <div style="margin-bottom: 8px;">
                <strong>🚗 Pysäköinti</strong>
                <div>${spot.parking}</div>
              </div>

              <div style="margin-bottom: 8px;">
                <strong>🚤 Veneluiska</strong>
                <div>${spot.boat_ramp}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong>⚠️ Rajoitukset</strong>
                <div>${spot.restrictions}</div>
              </div>

              <a
                href="${spot.permit_url}"
                style="
                  display: block;
                  background: #000;
                  color: #fff;
                  text-align: center;
                  padding: 10px 12px;
                  border-radius: 8px;
                  text-decoration: none;
                  font-weight: 600;
                "
              >
                🎫 Katso kalastuslupa
              </a>
            </div>
          `)
        )
        .addTo(mapRef.current!);
    });
  }, [dbSpots]);

  const searchResults = search.trim()
    ? dbSpots.filter((spot) =>
        spot.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  function selectSpot(longitude: number, latitude: number) {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 11,
      duration: 1200,
    });

    setSearch("");
  }

  return (
    <main className="relative h-screen w-screen">
      {/* Kartta */}
      <div
        ref={mapContainer}
        className="h-full w-full"
      />

      {/* Hakukenttä */}
      <div className="absolute left-4 top-4 z-10 w-80 max-w-[calc(100%-2rem)]">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hae kalastuspaikkaa..."
              className="min-w-0 flex-1 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none"
              style={{ caretColor: "black" }}
            />

            <button
              onClick={() => {
                const result = dbSpots.find((spot) =>
                  spot.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                );

                if (result) {
                  selectSpot(
                    result.longitude,
                    result.latitude
                  );
                }
              }}
              className="bg-black px-4 py-3 text-white hover:bg-gray-800"
            >
              Hae
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="border-t border-gray-200">
              {searchResults.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() =>
                    selectSpot(
                      spot.longitude,
                      spot.latitude
                    )
                  }
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100"
                >
                  <div className="font-medium text-black">
                    🎣 {spot.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {spot.fish}
                  </div>
                </button>
              ))}
            </div>
          )}

          {search.trim() && searchResults.length === 0 && (
            <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
              Ei kalastuspaikkoja
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
