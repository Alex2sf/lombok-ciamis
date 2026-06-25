"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const WA_PHONE = "6282250580331";
const WA_MSG = "Halo! Saya tertarik dengan paket Open Trip Lombok. Bisa info lebih lanjut?";
const WA_URL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MSG)}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300">
      <div
        className={`mx-4 mt-4 transition-all duration-300 border rounded-2xl ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-lg"
            : "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">Batur</span>
            <span className={scrolled ? "text-slate-900" : "text-white"}>Ngelamang</span>
          </Link>
          <div
            className={`hidden md:flex items-center space-x-8 text-sm font-semibold transition-colors duration-300 ${
              scrolled ? "text-slate-700" : "text-white/90"
            }`}
          >
            <a href="#destinations" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Destinasi</a>
            <a href="#why-us" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Kenapa Kami</a>
            <a href="#itinerary" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Itinerary</a>
            <a href="#gallery" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Gallery</a>
            <a href="#testimonials" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Testimoni</a>
            <a href="#faq" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>FAQ</a>
            <Link href="/blog" className={`transition ${scrolled ? "hover:text-blue-600" : "hover:text-teal-300"}`}>Blog</Link>
          </div>
          <a href={WA_URL} target="_blank" rel="noreferrer"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-sm font-bold hover:bg-[#128C7E] transition shadow-lg shadow-green-500/30">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi Kami
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {open && (
          <div
            className={`md:hidden border-t px-6 py-4 flex flex-col gap-4 font-semibold text-sm transition-colors duration-300 ${
              scrolled
                ? "border-slate-200 text-slate-800 bg-white/95 rounded-b-2xl"
                : "border-white/10 text-white bg-slate-900/90 rounded-b-2xl"
            }`}
          >
            <a href="#destinations" onClick={() => setOpen(false)}>Destinasi</a>
            <a href="#why-us" onClick={() => setOpen(false)}>Kenapa Kami</a>
            <a href="#itinerary" onClick={() => setOpen(false)}>Itinerary</a>
            <a href="#gallery" onClick={() => setOpen(false)}>Gallery</a>
            <a href="#testimonials" onClick={() => setOpen(false)}>Testimoni</a>
            <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
            <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
            <a href={WA_URL} target="_blank" className="bg-[#25D366] text-white text-center py-2 rounded-full font-bold">Tanya Harga via WA</a>
          </div>
        )}
      </div>
    </nav>
  );
}
