"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import FloatingWA from "./components/FloatingWA";
import Destinations from "./components/Destinations";
import Itinerary from "./components/Itinerary";
import TripPackages from "./components/TripPackages";
import ServicesSection from "./components/ServicesSection";
import GalleryTestimonials from "./components/GalleryTestimonials";
import FAQ from "./components/FAQ";
import BlogPreview from "./components/BlogPreview";
import DestinationSelector from "./components/DestinationSelector";
import { DESTINATIONS_DATA, DestinationKey } from "./data/destinationsData";

const WA_PHONE = "6282250580331";

const stats = [
  { value: "5,000+", label: "Kawan Jalan" },
  { value: "4.9★", label: "Ulasan Google" },
  { value: "50+", label: "Spot Seru" },
  { value: "7 Tahun", label: "Nemenin Trip" },
];

const whyUs = [
  {
    icon: "🗺️", title: "Terencana, Anti Ribet",
    desc: "Mulai dari transportasi, penginapan nyaman, tiket masuk spot wisata, sampai makan siang-malam udah beres. Lu tinggal bawa baju aja, sisanya biar kita yang urus.",
  },
  {
    icon: "📸", title: "Dokumentasi Foto & Video Gratis",
    desc: "Tim kita bawa kamera mirrorless plus drone. Lu pulang liburan dapet ratusan foto estetik buat feed Instagram, nggak perlu bayar sewa fotografer lagi.",
  },
  {
    icon: "🦺", title: "Guide Lokal Berpengalaman",
    desc: "Guide kami orang asli daerah tujuan yang tahu persis jalan tikus dan spot foto tersembunyi yang nggak bakal lu temuin di Google Maps.",
  },
  {
    icon: "💬", title: "Respon Chat Cepat",
    desc: "Tanya apa aja lewat WhatsApp, admin kita bakal jawab cepet dan ramah. Nggak pakai nunggu seharian cuma buat tahu detail jadwal.",
  },
  {
    icon: "🌿", title: "Peduli Lingkungan & Komunitas",
    desc: "Kita selalu ajak traveler buat jaga kebersihan tempat wisata. Sebagian pemasukan trip juga disalurkan ke UMKM warga lokal di sana.",
  },
  {
    icon: "🏅", title: "Travel Agent Resmi",
    desc: "Kita punya izin usaha pariwisata yang jelas dan resmi terdaftar. Jadi transaksi lu dijamin aman, bebas cemas, dan bergaransi.",
  },
];

// Hero images per destination
const HERO_IMAGES: Record<DestinationKey, string> = {
  lombok: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2560",
  ciamis: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560",
};

export default function Home() {
  const [activeKey, setActiveKey] = useState<DestinationKey>("lombok");
  const [destinations, setDestinations] = useState<Record<string, any>>(DESTINATIONS_DATA);

  useEffect(() => {
    const fetchDestinations = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      try {
        const res = await fetch(`${apiUrl}/destinations`);
        if (res.ok) {
          const data = await res.json();
          const mapped: Record<string, any> = {};
          data.forEach((item: any) => {
            mapped[item.key] = {
              key: item.key,
              label: item.label,
              region: item.region,
              heroTagline: item.hero_tagline,
              accentColor: item.accent_color,
              accentTextColor: item.accent_text_color,
              waMessage: item.wa_message,
              spots: item.spots || [],
              itinerary: item.itinerary || [],
              packages: item.packages || [],
            };
          });
          setDestinations(mapped);
          localStorage.setItem("admin_destinations", JSON.stringify(mapped));
          return;
        }
      } catch (e) {
        console.warn("Laravel API offline, using local storage fallback for destinations", e);
      }

      // Local storage fallback
      const local = localStorage.getItem("admin_destinations");
      if (local) {
        try {
          setDestinations(JSON.parse(local));
        } catch (e) {
          // noop
        }
      }
    };

    fetchDestinations();
  }, []);

  const dest = destinations[activeKey] || DESTINATIONS_DATA[activeKey];
  const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(dest.waMessage)}`;
  const heroImg = HERO_IMAGES[activeKey];
  const isEmerald = activeKey === "ciamis";

  return (
    <div className="min-h-screen bg-slate-50 scroll-smooth">
      <FloatingWA phone={WA_PHONE} message={dest.waMessage} />
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image — changes per destination */}
        <div className="absolute inset-0 z-0">
          <img
            key={activeKey}
            src={heroImg}
            alt={dest.label}
            className="w-full h-full object-cover scale-105 animate-fade-in"
            style={{ animation: "kenburns 20s ease-in-out infinite alternate" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>

        <style>{`
          @keyframes kenburns {
            from { transform: scale(1.05) translateX(0px); }
            to   { transform: scale(1.12) translateX(-20px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-3xl">
            {/* ── Destination Selector ── */}
            <div className="mb-8">
              <DestinationSelector active={activeKey} onChange={(k) => setActiveKey(k)} />
            </div>

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Open Trip tersedia · Slot terbatas setiap keberangkatan
            </div>

            {/* Hero heading — animates on switch */}
            <h1
              key={activeKey}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-fade-in"
            >
              Yuk, Ikut Open Trip
              <br />
              Seru ke{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isEmerald ? "from-lime-300 to-emerald-400" : "from-amber-300 to-orange-400"
                }`}
              >
                {dest.label}.
              </span>
            </h1>

            <p
              key={`sub-${activeKey}`}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-xl animate-fade-in"
            >
              {dest.heroTagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:bg-[#128C7E] transition shadow-2xl shadow-green-500/30 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Tanya Jadwal {dest.label} via WA
              </a>
              <a
                href="#destinations"
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2"
              >
                Lihat Destinasi →
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white text-center hover:bg-white/15 transition">
                <div className={`text-3xl font-black ${isEmerald ? "text-emerald-300" : "text-teal-300"}`}>
                  {s.value}
                </div>
                <div className="text-sm text-white/70 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ──────────────────────────────────────── */}
      <Destinations data={dest} />

      {/* ─── WHY US ────────────────────────────────────────────── */}
      <section id="why-us" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4 tracking-widest uppercase">
              Kenapa Batur Ngelamang?
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Nggak Cuma Nganterin Jalan.
              <br />
              Kita Temenin Seru-Seruan.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Banyak anak muda dan keluarga yang udah ikutan trip bareng kita. Ini alasan kenapa mereka betah.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-gradient-to-br hover:from-blue-600 hover:to-teal-500 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 cursor-default"
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-3 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 group-hover:text-blue-100 leading-relaxed transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ITINERARY ─────────────────────────────────────────── */}
      <Itinerary data={dest} />

      {/* ─── TRIP PACKAGES ─────────────────────────────────────── */}
      <TripPackages data={dest} />

      {/* ─── SERVICES & EXTRA FACILITIES ────────────────────────── */}
      <ServicesSection />

      {/* ─── GALLERY + TESTIMONIALS ────────────────────────────── */}
      <GalleryTestimonials />

      {/* ─── BLOG PREVIEW ──────────────────────────────────────── */}
      <BlogPreview />

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <FAQ />

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="text-3xl font-black text-white mb-4">Batur Ngelamang.</div>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                Penyedia Open Trip Lombok & Ciamis yang udah jalan sejak 2017. Kita yang siapin transportasi, makan, dan dokumentasi, lu tinggal bawa badan aja.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat Sekarang
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-xs">Destinasi</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => { setActiveKey("lombok"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition flex items-center gap-2"
                  >
                    🏝️ Open Trip Lombok
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveKey("ciamis"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition flex items-center gap-2"
                  >
                    🌿 Open Trip Ciamis
                  </button>
                </li>
                <li><a href="#itinerary" className="hover:text-white transition">Itinerary</a></li>
                <li><a href="#packages" className="hover:text-white transition">Paket Trip</a></li>
                <li><a href="#services" className="hover:text-white transition">Layanan Service</a></li>
                <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
                <li><Link href="/blog" className="hover:text-white transition">Travel Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-xs">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li>📍 Mataram, Lombok, NTB</li>
                <li>📍 Ciamis, Jawa Barat</li>
                <li>📱 +62 822-5058-0331</li>
                <li>📧 hello@baturngelamang.com</li>
                <li className="pt-2">
                  <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 transition text-xs">
                    Admin Login →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
            © 2026 Batur Ngelamang Open Trip. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
