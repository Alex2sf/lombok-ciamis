"use client";

import { useState, useEffect } from "react";
import { DestinationKey, DESTINATIONS_DATA, DESTINATION_KEYS, DestinationData } from "../data/destinationsData";

interface Props {
  active: DestinationKey;
  onChange: (key: DestinationKey) => void;
}

const FLAG: Record<DestinationKey, string> = {
  lombok: "🏝️",
  ciamis: "🌿",
};

const ACCENT: Record<DestinationKey, string> = {
  lombok: "from-blue-600 to-teal-500",
  ciamis: "from-emerald-600 to-green-400",
};

export default function DestinationSelector({ active, onChange }: Props) {
  const [destinations, setDestinations] = useState<Record<string, DestinationData>>(DESTINATIONS_DATA);

  useEffect(() => {
    const local = localStorage.getItem("admin_destinations");
    if (local) {
      try {
        setDestinations(JSON.parse(local));
      } catch (e) {
        // noop
      }
    }
  }, []);

  return (
    <div
      id="destination-selector"
      className="flex justify-center"
      aria-label="Pilih Destinasi"
    >
      {/* Pill container */}
      <div className="inline-flex items-center gap-1 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl shadow-black/20">
        {DESTINATION_KEYS.map((key) => {
          const dest = destinations[key] || DESTINATIONS_DATA[key];
          const isActive = active === key;

          return (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => onChange(key)}
              aria-pressed={isActive}
              className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-400 overflow-hidden
                ${isActive ? "text-white shadow-lg" : "text-white/60 hover:text-white/90 hover:bg-white/10"}`}
            >
              {/* Active fill gradient */}
              {isActive && (
                <span
                  className={`absolute inset-0 bg-gradient-to-r ${ACCENT[key]} opacity-100 rounded-xl transition-all duration-400`}
                  aria-hidden="true"
                />
              )}

              <span className="relative z-10 text-base leading-none">{FLAG[key]}</span>
              <span className="relative z-10 flex flex-col items-start leading-tight">
                <span className="font-black">{dest.label}</span>
                <span className="text-[10px] font-medium opacity-75 tracking-wide">
                  {dest.region}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
