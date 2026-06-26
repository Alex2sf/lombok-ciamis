"use client";

import { DestinationData, TripPackage, DESTINATIONS_DATA } from "../data/destinationsData";

const WA_PHONE = "6282250580331";

interface Props {
  data: DestinationData;
}

export default function TripPackages({ data }: Props) {
  let { packages, label, accentColor } = data;

  // Fallback to default packages if not defined/empty (e.g. from older localStorage structure)
  if (!packages || packages.length === 0) {
    packages = DESTINATIONS_DATA[data.key]?.packages || [];
  }

  const isEmerald = accentColor === "bg-emerald-600";

  // Helper to format currency
  const formatPrice = (price?: number | string) => {
    if (!price) return null;
    if (typeof price === "string") return price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="packages" className="py-28 bg-[#f8f5f0] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section Header ───────────────────────────────── */}
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-1.5 text-sm font-bold rounded-full mb-4 tracking-widest uppercase transition-colors duration-500
              ${isEmerald ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
          >
            Pilihan Paket Trip
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Paket Hemat & Fasilitas Lengkap<br />
            <span
              key={label}
              className={`transition-colors duration-500 ${isEmerald ? "text-emerald-600" : "text-blue-600"} animate-fade-in`}
            >
              Untuk Trip {label}
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Pilih paket yang paling cocok dengan kebutuhan liburan kamu. Semua paket sudah dilengkapi dengan standar pelayanan terbaik kami.
          </p>
        </div>

        {/* ── Packages Grid ─────────────────────────────────── */}
        {packages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto">
            <span className="text-4xl mb-3 block">🧳</span>
            <h3 className="font-extrabold text-slate-800 text-lg mb-1">Paket Belum Tersedia</h3>
            <p className="text-slate-500 text-sm">Hubungi admin untuk penawaran harga terbaik.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${packages.length > 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"}`}>
            {packages.map((pkg, i) => {
              const hasPrice = !!pkg.price;
              const priceText = formatPrice(pkg.price);
              const isCompact = packages.length > 3;
              
              return (
                <div
                  key={`${data.key}-pkg-${i}`}
                  className="group relative bg-white rounded-3xl border border-slate-100 hover:border-transparent flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Image Banner */}
                  {pkg.image && (
                    <div className={`w-full overflow-hidden bg-slate-100 relative ${isCompact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                    </div>
                  )}

                  <div className={`flex-grow flex flex-col justify-between ${isCompact ? "p-5" : "p-8"}`}>
                    <div>
                      {/* Header */}
                      <div className={isCompact ? "mb-4" : "mb-6"}>
                        <h3 className={`font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300 ${isCompact ? "text-lg line-clamp-1" : "text-2xl"}`}>
                          {pkg.name}
                        </h3>
                        {pkg.description && (
                          <p className={`text-slate-500 leading-relaxed mt-2 ${isCompact ? "text-xs line-clamp-2" : "text-sm"}`}>
                            {pkg.description}
                          </p>
                        )}
                      </div>

                      {/* Price Card */}
                      <div className={`bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-900 group-hover:border-transparent transition-all duration-500 ${isCompact ? "p-4 mb-4" : "p-5 mb-6"}`}>
                        {hasPrice ? (
                          <div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest block mb-1">
                              Mulai Dari
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className={`font-black text-slate-950 group-hover:text-white transition-colors ${isCompact ? "text-xl" : "text-3xl"}`}>
                                {priceText}
                              </span>
                              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-400">
                                / Pax
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest block mb-1">
                              Harga Khusus
                            </span>
                            <span className={`font-black text-slate-950 group-hover:text-white transition-colors ${isCompact ? "text-lg" : "text-2xl"}`}>
                              Hubungi Admin
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className={isCompact ? "mb-6" : "mb-8"}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                            Fasilitas & Layanan:
                          </span>
                          <ul className={`space-y-3 ${isCompact ? "max-h-[160px] overflow-y-auto pr-1 scrollbar-thin" : ""}`}>
                            {pkg.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm leading-tight">
                                <span className={`text-sm mt-0.5 ${isEmerald ? "text-emerald-500" : "text-blue-500"}`}>
                                  ✓
                                </span>
                                <span className={isCompact ? "text-xs" : "text-sm"}>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <a
                      href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                        hasPrice
                          ? `Halo! Saya tertarik dengan paket "${pkg.name}" (${priceText}) untuk trip ke ${label}. Boleh tanya detail & ketersediaan slotnya?`
                          : `Halo! Saya tertarik dengan paket "${pkg.name}" untuk trip ke ${label}. Bisa tanya info harga khusus dan detailnya?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full text-white text-center rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                        ${isCompact ? "py-3 text-sm" : "py-4 text-base"}
                        ${isEmerald 
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 hover:shadow-emerald-500/20" 
                          : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:shadow-blue-500/20"}`}
                    >
                      Booking Sekarang
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
