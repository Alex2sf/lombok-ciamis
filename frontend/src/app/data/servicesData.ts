// ─────────────────────────────────────────────────────────────
//  servicesData.ts
//  Data default untuk section Layanan & Service Batur Ngelamang
// ─────────────────────────────────────────────────────────────

export interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  description: string;
  price: number | string; // e.g. 500000 atau "Mulai Rp 350.000 / hari"
  priceUnit?: string;     // e.g. "/ hari", "/ orang", "/ trip"
  image: string;
  features?: string[];
  waCustomMessage?: string;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Sewa Mobil & Driver Lokal",
    category: "Transportasi",
    description: "Rental unit Avanza, Innova Reborn, atau Hiace lengkap dengan driver berpengalaman yang paham seluruh rute wisata.",
    price: 650000,
    priceUnit: "/ hari",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    features: [
      "Mobil Bersih + Full AC Dingin",
      "Driver ramah & paham spot tersembunyi",
      "Termasuk BBM (Area Kota & Wisata)",
      "Kapasitas 6 - 14 Penumpang"
    ]
  },
  {
    id: "srv-2",
    name: "Dokumentasi Mirrorless & Drone Udara",
    category: "Dokumentasi",
    description: "Jasa fotografer & videografer profesional untuk mengabadikan momen liburan estetik kamu beserta video cinematic reels.",
    price: 850000,
    priceUnit: "/ hari",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
    features: [
      "Kamera Sony A7 series + Lensa Pro",
      "Pilot Drone DJI (Aerial Shot 4K)",
      "All soft-copy file tanpa batas",
      "Free 3-5 Video Reels / TikTok Editing"
    ]
  },
  {
    id: "srv-3",
    name: "Sewa Alat Snorkeling & Underwater Cam",
    category: "Watersport",
    description: "Perlengkapan snorkeling standar internasional, fins fleksibel, life jacket empuk, plus kamera waterproof GoPro Hero.",
    price: 150000,
    priceUnit: "/ set / hari",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    features: [
      "Masker Snorkel Anti-fog & Fog-free",
      "Fins Renang Berbagai Ukuran",
      "Pelampung Life Jacket SNI",
      "Opsional Sewa GoPro Hero 11 Black"
    ]
  },
  {
    id: "srv-4",
    name: "Porter & Guide Khusus Pendakian / Trekking",
    category: "Petualangan",
    description: "Guide lokal dan porter tangguh siap membawakan logistik, mendirikan tenda dome, dan memasak santapan lezat di alam terbuka.",
    price: 350000,
    priceUnit: "/ porter / hari",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    features: [
      "Porter berpengalaman rute Rinjani / Gunung",
      "Bawa beban logistik & tenda s/d 20kg",
      "Bisa bantu masak makanan hangat",
      "Ramah & bersertifikasi Pemandu Wisata"
    ]
  }
];
