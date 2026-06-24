"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Berapa harga paket Open Trip Lombok?",
    a: "Harga bervariasi tergantung paket, durasi, dan tanggal keberangkatan. Kami sengaja tidak mencantumkan harga di website karena ada promo dan penawaran spesial yang berubah setiap bulannya. Langsung tanya ke WhatsApp kami untuk penawaran terbaik!",
  },
  {
    q: "Minimal berapa orang untuk ikut Open Trip?",
    a: "Open Trip bisa diikuti mulai dari 1 orang! Kamu bisa bergabung dengan peserta lain yang memiliki jadwal yang sama. Untuk Private Trip, kamu bisa booking untuk grup sendiri dengan itinerary yang lebih fleksibel.",
  },
  {
    q: "Apa saja yang sudah termasuk dalam paket?",
    a: "Setiap paket berbeda-beda, namun umumnya sudah include transportasi lokal, guide berpengalaman, akomodasi, dan beberapa aktivitas utama. Detail lengkapnya bisa ditanyakan ke tim kami via WhatsApp.",
  },
  {
    q: "Bagaimana cara booking dan pembayaran?",
    a: "Cukup chat kami di WhatsApp, pilih paket dan tanggal yang kamu inginkan, lalu kami akan kirimkan detail pembayaran DP untuk mengamankan kursimu. Mudah dan aman!",
  },
  {
    q: "Apakah ada garansi jika trip dibatalkan?",
    a: "Tentu! Jika pembatalan dari pihak kami karena force majeure atau alasan internal, DP akan dikembalikan penuh atau bisa direscheduled ke tanggal lain tanpa biaya tambahan.",
  },
  {
    q: "Apakah cocok untuk solo traveler wanita?",
    a: "Absolutely! Banyak peserta kami adalah solo traveler wanita. Kami memastikan lingkungan trip yang aman, ramah, dan suportif. Guide kami sudah terlatih untuk memastikan kenyamanan semua peserta.",
  },
];

const WA_PHONE = "6281234567890";
const WA_URL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo! Saya punya pertanyaan tentang Open Trip Lombok.")}`;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 tracking-widest uppercase">FAQ</span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Pertanyaan yang<br/>Sering Ditanya</h2>
          <p className="text-slate-500 text-lg">Masih ada yang ingin kamu tanyakan? Langsung chat kami!</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                className="w-full text-left px-8 py-6 flex justify-between items-center gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-slate-900 text-lg">{faq.q}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full ${openIndex === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-black text-lg transition-colors`}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-6 text-slate-600 leading-relaxed text-base border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4">Pertanyaanmu belum terjawab?</p>
          <a href={WA_URL} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition shadow-xl shadow-green-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Tanya Langsung ke Admin
          </a>
        </div>
      </div>
    </section>
  );
}
