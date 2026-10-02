"use client";

import { useState, useEffect } from "react";
import { ServiceItem, DEFAULT_SERVICES } from "../data/servicesData";

const WA_PHONE = "6282250580331";

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);

  useEffect(() => {
    // 1. Coba ambil dari Laravel API
    const fetchServices = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      try {
        const res = await fetch(`${apiUrl}/services`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
            localStorage.setItem("admin_services", JSON.stringify(data));
            return;
          }
        }
      } catch (e) {
        // Fallback ke localStorage
      }

      // 2. Fallback localStorage
      const local = localStorage.getItem("admin_services");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setServices(parsed);
            return;
          }
        } catch (e) {
          // ignore
        }
      }

      // 3. Fallback default data
      setServices(DEFAULT_SERVICES);
      localStorage.setItem("admin_services", JSON.stringify(DEFAULT_SERVICES));
    };

    fetchServices();
  }, []);

  const formatPrice = (price?: number | string) => {
    if (!price && price !== 0) return "Hubungi Admin";
    if (typeof price === "string") {
      const num = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num) && num > 0) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(num);
      }
      return price;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getWaLink = (service: ServiceItem) => {
    const text = service.waCustomMessage || 
      `Halo Batur Ngelamang! Saya tertarik dan ingin tanya lebih lanjut tentang layanan "${service.name}". Boleh info ketersediaan & jadwalnya?`;
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="services" className="py-28 bg-white relative overflow-hidden">
      {/* Decorative gradient glow background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-500/10 to-blue-500/10 text-teal-700 text-sm font-bold rounded-full mb-4 tracking-widest uppercase border border-teal-500/20">
            Layanan & Fasilitas Tambahan
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Layanan Ekstra Liburan Kamu.<br />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Lengkap, Fleksibel, & Terpercaya.
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Butuh transportasi privat, dokumentasi drone cinematic, atau porter pendakian? Kami sediakan layanan pendukung agar liburan kamu makin nyaman.
          </p>
        </div>

        {/* ── Services Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((srv, index) => {
            const priceFormatted = formatPrice(srv.price);

            return (
              <div
                key={srv.id || index}
                className="group bg-slate-50 rounded-3xl border border-slate-200/80 hover:border-transparent flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1.5 overflow-hidden"
              >
                <div>
                  {/* Image Banner */}
                  <div className="w-full aspect-[16/10] overflow-hidden bg-slate-200 relative">
                    <img
                      src={srv.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                    
                    {srv.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-extrabold text-slate-800 shadow-sm">
                        {srv.category}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors duration-300 leading-snug mb-2">
                      {srv.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {srv.description}
                    </p>

                    {/* Features list if any */}
                    {srv.features && srv.features.length > 0 && (
                      <div className="mb-6 space-y-2 border-t border-slate-200/60 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Termasuk:
                        </span>
                        <ul className="space-y-1.5">
                          {srv.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                              <span className="text-teal-600 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer: Price & CTA */}
                <div className="p-6 pt-0">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/70 mb-4 group-hover:border-teal-500/30 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Biaya Layanan
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-slate-900">
                        {priceFormatted}
                      </span>
                      {srv.priceUnit && (
                        <span className="text-xs font-semibold text-slate-500">
                          {srv.priceUnit}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href={getWaLink(srv)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-[#25D366] text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-green-500/20"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Pesan Layanan via WA
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
