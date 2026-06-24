// ─────────────────────────────────────────────────────────────
//  destinationsData.ts
//  Sumber data terpusat untuk semua destinasi Open Trip.
//  Tambah destinasi baru cukup di array `DESTINATIONS_DATA`.
// ─────────────────────────────────────────────────────────────

export type DestinationKey = "lombok" | "ciamis";

export interface SpotItem {
  name: string;
  desc: string;
  img: string;
  tag: string;
  color: string; // Tailwind gradient class for hover overlay
}

export interface ItineraryDay {
  day: string;
  title: string;
  desc: string;
  icon: string;
}

export interface DestinationData {
  key: DestinationKey;
  label: string;          // nama tampil di tab
  region: string;         // sub-label (provinsi / pulau)
  heroTagline: string;    // sub-judul di section header
  accentColor: string;    // warna aksen Tailwind (bg-*)
  accentTextColor: string;
  spots: SpotItem[];
  itinerary: ItineraryDay[];
  waMessage: string;      // pesan default WhatsApp
}

// ─── LOMBOK ─────────────────────────────────────────────────
const lombokData: DestinationData = {
  key: "lombok",
  label: "Lombok",
  region: "Nusa Tenggara Barat",
  heroTagline:
    "Mulai dari nyantai di pantai pasir pink, trekking santai, sampai keliling pulau kecil pakai kapal. Kita sudah atur semua rutenya biar kamu tinggal menikmati perjalanan aja.",
  accentColor: "bg-blue-600",
  accentTextColor: "text-blue-600",
  waMessage:
    "Halo! Mau nanya dong buat jadwal Open Trip ke Lombok yang paling deket kapan ya?",
  spots: [
    {
      name: "Pantai Pink & Gili Hopping",
      desc: "Pantai unik dengan pasir warna pink alami. Kita bakal sewa kapal buat mampir ke pulau-pulau kecil di sekitarnya dan berenang sepuasnya.",
      img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85",
      tag: "Paling Ramai",
      color: "from-pink-500/80 to-rose-700/80",
    },
    {
      name: "Trekking Rinjani",
      desc: "Naik ke gunung ikonik Lombok. Tenang aja, porter kita yang bakal bawain tenda dan alat masak. Kamu tinggal jalan santai sambil nikmati pemandangan danau.",
      img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=85",
      tag: "Rekomendasi Petualang",
      color: "from-slate-700/80 to-slate-900/80",
    },
    {
      name: "Senggigi & Kapal Sunset",
      desc: "Sore-sore kita naik perahu keliling area pantai Senggigi buat nungguin sunset pas matahari tenggelam di balik Gunung Agung Bali.",
      img: "https://images.unsplash.com/photo-1586053226626-d6215f91d9d9?w=900&q=85",
      tag: "Nyantai Sore",
      color: "from-orange-500/80 to-amber-700/80",
    },
    {
      name: "Snorkeling Gili Trawangan",
      desc: "Berenang bareng penyu liar di laut lepas Gili Trawangan. Spot terumbu karangnya bagus dan airnya jernih banget.",
      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85",
      tag: "Wajib Coba",
      color: "from-cyan-500/80 to-blue-700/80",
    },
  ],
  itinerary: [
    {
      day: "Hari 1",
      title: "Dijemput & Keliling Gili Trawangan",
      desc: "Tim kita jemput kamu langsung di bandara. Langsung check-in hotel, ganti baju, terus nyebrang naik kapal buat keliling 3 pulau Gili sekalian snorkeling bareng guide lokal.",
      icon: "🚤",
    },
    {
      day: "Hari 2",
      title: "Sunrise Bukit Merese & Pantai Pink",
      desc: "Bangun subuh dikit buat berburu foto sunrise di atas Bukit Merese. Siangnya kita meluncur ke Pantai Pink buat santai-santai dan makan siang ikan bakar.",
      icon: "🏖️",
    },
    {
      day: "Hari 3",
      title: "Jalan-Jalan Senggigi & Sunset Cruise",
      desc: "Nyari oleh-oleh lokal di pasar seni, lanjut makan kuliner khas ayam taliwang, terus sorenya sewa boat santai menikmati pemandangan sunset.",
      icon: "🌅",
    },
    {
      day: "Hari 4",
      title: "Desa Adat Sasak & Pulang",
      desc: "Sebelum balik ke bandara, kita mampir dulu ke Desa Adat Sasak buat ngelihat rumah tradisional dan cara bikin kain tenun lokal. Habis itu langsung diantar ke bandara.",
      icon: "🏡",
    },
  ],
};

// ─── CIAMIS ─────────────────────────────────────────────────
const ciamisData: DestinationData = {
  key: "ciamis",
  label: "Ciamis",
  region: "Jawa Barat",
  heroTagline:
    "Dari serunya susur sungai arus Green Canyon sampai nyantai menikmati angin sore di Pantai Pangandaran. Trip pas buat kamu yang mau liburan singkat akhir pekan.",
  accentColor: "bg-emerald-600",
  accentTextColor: "text-emerald-600",
  waMessage:
    "Halo! Boleh minta info detail dan harga paket Open Trip ke Ciamis-Pangandaran?",
  spots: [
    {
      name: "Pantai Pangandaran",
      desc: "Nggak usah bingung mau lihat sunrise atau sunset, di pantai barat dan timur Pangandaran kamu bisa nikmati keduanya sekaligus. Kuliner seafood-nya juga murah meriah.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
      tag: "Destinasi Utama",
      color: "from-cyan-500/80 to-teal-700/80",
    },
    {
      name: "Hutan Cagar Alam Pananjung",
      desc: "Jalan santai di bawah rindangnya pepohonan sambil lihat kawanan rusa dan monyet ekor panjang yang ramah berkeliaran bebas.",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85",
      tag: "Nuansa Alam",
      color: "from-green-600/80 to-emerald-900/80",
    },
    {
      name: "Body Rafting Green Canyon",
      desc: "Berenang hanyut menyusuri aliran sungai berair hijau toska diapit tebing batu tinggi. Kegiatan paling seru dan menantang di trip ini.",
      img: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=900&q=85",
      tag: "Paling Seru",
      color: "from-emerald-500/80 to-green-800/80",
    },
    {
      name: "Situ Lengkong Panjalu",
      desc: "Danau tenang bernuansa sejuk dengan pulau kecil di tengahnya. Kita bakal naik perahu keliling danau sekalian mampir ziarah budaya sejarah lokal.",
      img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85",
      tag: "Wisata Santai",
      color: "from-indigo-500/80 to-purple-800/80",
    },
  ],
  itinerary: [
    {
      day: "Hari 1",
      title: "Jalan ke Pangandaran & Sunset Pantai",
      desc: "Kumpul pagi di meeting point, lalu berangkat bareng pakai Elf/Hiace ber-AC. Siang sampai Pangandaran langsung check-in homestay, makan siang, terus sorenya nyantai nonton sunset.",
      icon: "🌊",
    },
    {
      day: "Hari 2",
      title: "Body Rafting di Green Canyon",
      desc: "Habis sarapan, kita langsung meluncur ke lokasi rafting. Pasang pelampung, terus rasakan serunya hanyut menyusuri sungai Green Canyon yang sejuk bareng instruktur berpengalaman.",
      icon: "🏞️",
    },
    {
      day: "Hari 3",
      title: "Explore Cagar Alam & Situ Lengkong",
      desc: "Pagi-pagi jalan santai di hutan cagar alam ketemu rusa jinak. Siangnya kita geser ke Situ Lengkong buat naik perahu santai sebelum perjalanan pulang ke kota asal.",
      icon: "🌿",
    },
    {
      day: "Hari 4",
      title: "Beli Oleh-Oleh & Antar Pulang",
      desc: "Belanja camilan khas Galendo dan kerajinan lokal buat dibawa pulang. Kita makan siang bareng menu nasi liwet khas Sunda sebelum diantar balik ke meeting point awal.",
      icon: "🛖",
    },
  ],
};

// ─── EXPORTED COLLECTION ────────────────────────────────────
export const DESTINATIONS_DATA: Record<DestinationKey, DestinationData> = {
  lombok: lombokData,
  ciamis: ciamisData,
};

export const DESTINATION_KEYS: DestinationKey[] = ["lombok", "ciamis"];
