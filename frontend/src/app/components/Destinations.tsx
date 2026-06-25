"use client";

import { DESTINATIONS_DATA, DestinationData } from "../data/destinationsData";

const WA_PHONE = "6282250580331";

interface Props {
  data: DestinationData;
}

export default function Destinations({ data }: Props) {
  const { spots, heroTagline, accentColor } = data;

  return (
    <section id="destinations" className="py-28 bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section Header ───────────────────────────────── */}
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-1.5 text-sm font-bold rounded-full mb-4 tracking-widest uppercase transition-colors duration-500
              ${accentColor === "bg-emerald-600"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            Destinasi Unggulan
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Surga yang Menunggu<br />untuk Dijelajahi
          </h2>
          <p
            key={data.key} // trigger re-render animation
            className="text-slate-500 text-lg max-w-2xl mx-auto animate-fade-in"
          >
            {heroTagline}
          </p>
        </div>

        {/* ── Card Grid ─────────────────────────────────────── */}
        <div
          key={data.key}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in"
        >
          {spots.map((d, i) => (
            <div
              key={`${data.key}-${i}`}
              className="relative group rounded-3xl overflow-hidden cursor-pointer h-[480px] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Color overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${d.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              {/* Dark base gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tag badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                  {d.tag}
                </span>
              </div>

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-black text-white mb-2">{d.name}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {d.desc}
                </p>
                <a
                  href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                    `Halo! Saya tertarik dengan paket ${d.name} di ${data.label}. Bisa info jadwal dan detailnya?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-teal-400 transition opacity-0 group-hover:opacity-100 duration-500 delay-150"
                >
                  Tanya Jadwal →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
