"use client";

import { useState, useEffect } from "react";

interface GalleryItem {
  img: string;
  span: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  stars: number;
  text: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", span: "col-span-2 row-span-2" },
  { img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", span: "" },
  { img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", span: "" },
  { img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80", span: "" },
  { img: "https://images.unsplash.com/photo-1586053226626-d6215f91d9d9?w=800&q=80", span: "" },
  { img: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80", span: "" },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Reyna Pratiwi",
    role: "Solo Traveler, Jakarta",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    stars: 5,
    text: "LUAR BIASA! Ini open trip pertama gue dan jujur gue kaget bisa seindah dan semulus ini. Guide-nya super informatif, hotelnya bersih, dan gue dapet ratusan foto bagus! Udah pasti balik lagi tahun depan.",
  },
  {
    name: "Budi Santoso",
    role: "Peserta Trip Rinjani, Bandung",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    stars: 5,
    text: "Summit Rinjani adalah bucket list gue selama bertahun-tahun. Tim Batur Ngelamang beneran membantu setiap langkah pendakian. Equipment lengkap, porter profesional, dan pemandangan puncaknya... gak ada kata selain epic.",
  },
  {
    name: "Sari & Dini",
    role: "Best Friend Trip, Surabaya",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    stars: 5,
    text: "Kami berdua perempuan dan sempat khawatir soal keamanan. Tapi tim di sini bener-bener bikin nyaman dan aman. Island Hopping-nya surga banget! Pantai Pinknya real dan sebagus di foto. Recommended banget!",
  },
];

const WA_URL = `https://wa.me/6282250580331?text=${encodeURIComponent("Halo! Saya ingin tanya jadwal Open Trip Lombok tersedia.")}`;

export default function GalleryAndTestimonials() {
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const localGallery = localStorage.getItem("admin_gallery");
    if (localGallery) {
      try {
        setGallery(JSON.parse(localGallery));
      } catch (e) {
        // noop
      }
    }

    const localTesti = localStorage.getItem("admin_testimonials");
    if (localTesti) {
      try {
        setTestimonials(JSON.parse(localTesti));
      } catch (e) {
        // noop
      }
    }
  }, []);

  return (
    <>
      {/* Gallery */}
      <section id="gallery" className="py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-500/20 text-teal-300 text-sm font-bold rounded-full mb-4 tracking-widest uppercase border border-teal-400/30">Galeri Perjalanan</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Setiap Frame adalah<br/>Kenangan Berharga</h2>
            <p className="text-slate-400 text-lg">Foto-foto nyata dari peserta trip kami. Tanpa filter berlebihan — Lombok memang seindah ini.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {gallery.map((g, i) => (
              <div key={i} className={`${g.span || ""} overflow-hidden rounded-2xl group`}>
                <img src={g.img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 hover:brightness-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full mb-4 tracking-widest uppercase">Testimoni</span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Cerita dari Mereka<br/>yang Sudah Merasakan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#f8f5f0] rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition flex flex-col">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(t.stars)].map((_, s) => <span key={s}>★</span>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 flex-1 italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto border-t border-slate-200 pt-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl shadow-blue-500/30">
            <div>
              <h3 className="text-3xl md:text-4xl font-black mb-3">Giliran kamu nulis cerita<br/>indah bareng kami! ✨</h3>
              <p className="text-blue-100 text-lg">Ribuan peserta sudah membuktikan. Yuk, jadilah bagian dari keluarga besar Batur Ngelamang.</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noreferrer"
              className="flex-shrink-0 px-8 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 transition shadow-xl flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Daftar via WhatsApp Sekarang!
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
