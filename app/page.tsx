"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const fishingSpots = [
  {
    name: "Lohjanjärvi",
    coordinates: [24.1, 60.25] as [number, number],
    fish: "Kuha, hauki, ahven",
    permit: "Kalastuslupa tarvitaan",
    permitUrl: "#",
    parking: "Pysäköintipaikkoja löytyy alueelta",
    boatRamp: "Veneluiska löytyy alueelta",
    restrictions: "Tarkista ajantasaiset kalastusrajoitukset",
  },
  {
    name: "Hiidenvesi",
    coordinates: [24.25, 60.4] as [number, number],
    fish: "Kuha, hauki, ahven",
    permit: "Kalastuslupa tarvitaan",
    permitUrl: "#",
    parking: "Pysäköintipaikkoja löytyy rannan läheltä",
    boatRamp: "Veneluiska löytyy alueelta",
    restrictions: "Tarkista ajantasaiset kalastusrajoitukset",
  },
  {
    name: "Päijänne",
    coordinates: [25.55, 61.5] as [number, number],
    fish: "Kuha, hauki, ahven, taimen",
    permit: "Tarkista lupa-alue",
    permitUrl: "#",
    parking: "Pysäköintipaikkoja löytyy useilta alueilta",
    boatRamp: "Veneluiska löytyy useilta alueilta",
    restrictions: "Tarkista ajantasaiset kalastusrajoitukset",
  },
  {
    name: "Saimaa",
    coordinates: [28.0, 61.3] as [number, number],
    fish: "Kuha, hauki, ahven, taimen",
    permit: "Tarkista lupa-alue",
    permitUrl: "#",
    parking: "Pysäköintipaikkoja löytyy useilta alueilta",
    boatRamp: "Veneluiska löytyy useilta alueilta",
    restrictions: "Tarkista ajantasaiset kalastusrajoitukset",
  },
];

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [search, setSearch] = useState("");

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

    fishingSpots.forEach((spot) => {
      new maplibregl.Marker()
        .setLngLat(spot.coordinates)
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
                <div>${spot.boatRamp}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong>⚠️ Rajoitukset</strong>
                <div>${spot.restrictions}</div>
              </div>

              <a
                href="${spot.permitUrl}"
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
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const searchResults = search.trim()
    ? fishingSpots.filter((spot) =>
        spot.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  function selectSpot(
    coordinates: [number, number]
  ) {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: coordinates,
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
                const result = fishingSpots.find((spot) =>
                  spot.name.toLowerCase().includes(search.toLowerCase())
                );

                if (result && mapRef.current) {
                  mapRef.current.flyTo({
                    center: result.coordinates,
                    zoom: 11,
                    duration: 1200,
                  });
                }
              }}
              className="bg-black px-4 py-3 text-white hover:bg-gray-800 hover:bg-gray-800"
            >
              Hae
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="border-t border-gray-200">
              {searchResults.map((spot) => (
                <button
                  key={spot.name}
                  onClick={() => selectSpot(spot.coordinates)}
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