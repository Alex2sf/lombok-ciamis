"use client";

import { useState } from "react";
import { DestinationData } from "../data/destinationsData";

const WA_PHONE = "6282250580331";

interface Props {
  data: DestinationData;
}

export default function Itinerary({ data }: Props) {
  const [activeDay, setActiveDay] = useState(0);
  const { itinerary, label, accentColor } = data;

  // Reset active day when destination changes
  const currentItinerary = itinerary[activeDay] ?? itinerary[0];

  const isEmerald = accentColor === "bg-emerald-600";

  return (
    <section id="itinerary" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-1.5 text-sm font-bold rounded-full mb-4 tracking-widest uppercase transition-colors duration-500
              ${isEmerald ? "bg-emerald-100 text-emerald-700" : "bg-teal-100 text-teal-700"}`}
          >
            Sample Itinerary
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            4 Hari Tak Terlupakan<br />
            <span
              key={label}
              className={`transition-colors duration-500 ${isEmerald ? "text-emerald-600" : "text-blue-600"} animate-fade-in`}
            >
              di {label}
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Ini hanya contoh. Jadwal aktual menyesuaikan tanggal keberangkatan.
            Tanya admin untuk detail itinerary terkini!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* ── Day Tabs ───────────────────────────────────── */}
          <div className="flex lg:flex-col gap-3 w-full lg:w-64 flex-shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {itinerary.map((item, i) => {
              const active = activeDay === i;
              return (
                <button
                  key={`${data.key}-day-${i}`}
                  onClick={() => setActiveDay(i)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-left transition-all duration-300 flex-shrink-0 w-full
                    ${active
                      ? isEmerald
                        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/30"
                        : "bg-blue-600 text-white shadow-xl shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-xs opacity-70 font-medium">{item.day}</div>
                    <div className="text-sm leading-tight">
                      {item.title.split(" ").slice(0, 2).join(" ")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Active Content ─────────────────────────────── */}
          <div
            key={`${data.key}-${activeDay}`}
            className={`flex-1 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl transition-all duration-500 animate-fade-in
              ${isEmerald
                ? "bg-gradient-to-br from-slate-900 to-emerald-950"
                : "bg-gradient-to-br from-slate-900 to-blue-950"
              }`}
          >
            {/* Decorative blob */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none
                ${isEmerald ? "bg-emerald-500/20" : "bg-blue-500/20"}`}
            />

            <div className="relative z-10">
              <span
                className={`inline-block px-4 py-1 backdrop-blur text-sm font-bold rounded-full mb-4 border
                  ${isEmerald
                    ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/30"
                    : "bg-blue-500/30 text-blue-200 border-blue-400/30"
                  }`}
              >
                {currentItinerary.day}
              </span>
              <h3 className="text-3xl font-black mb-4">
                {currentItinerary.icon} {currentItinerary.title}
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {currentItinerary.desc}
              </p>
              <a
                href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                  `Halo! Saya ingin tanya detail itinerary ${data.label} — ${currentItinerary.day}: ${currentItinerary.title}. Ada jadwal tersedia?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Tanya Detail Itinerary Ini
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
