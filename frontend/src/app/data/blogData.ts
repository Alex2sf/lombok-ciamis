export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Tips" | "Kuliner" | "Panduan" | "Rekomendasi";
  date: string;
  readTime: string;
  author: string;
  image: string;
  views: number;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const res = await fetch(`${apiUrl}/posts`, {
      next: { revalidate: 60 }, // Cache refresh every 60s
    });
    if (!res.ok) throw new Error("Gagal mengambil data dari API");
    const data = await res.json();
    
    // Normalisasi struktur jika response database laravel sedikit berbeda
    return data.map((item: any) => ({
      id: String(item.id),
      slug: item.slug || `post-${item.id}`,
      title: item.judul || item.title,
      excerpt: item.excerpt || item.ringkasan || (item.konten || item.content || "").substring(0, 150) + "...",
      content: item.konten || item.content,
      category: item.kategori || item.category || "Tips",
      date: item.tanggal || item.created_at || "Baru",
      readTime: item.read_time || "3 min read",
      author: item.penulis || item.author || "Admin",
      image: item.gambar || item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
      views: Number(item.views || 0),
    }));
  } catch (error) {
    // Fallback menggunakan data local storage (dari CRUD admin) jika Laravel API belum terhubung/offline
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("admin_posts");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          return parsed.map((item: any) => ({
            id: String(item.id),
            slug: item.slug || `post-${item.id}`,
            title: item.judul || item.title,
            excerpt: item.ringkasan || item.excerpt || (item.konten || "").substring(0, 150) + "...",
            content: item.konten || item.content,
            category: item.kategori || item.category || "Tips",
            date: item.tanggal || "Baru",
            readTime: item.readTime || "3 min read",
            author: item.author || "Admin",
            image: item.gambar || item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
            views: Number(item.views || 0),
          }));
        } catch (e) {
          // ignore parsing error
        }
      }
    }
    return BLOG_POSTS;
  }
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "tips-hemat-open-trip-lombok",
    title: "Tips Hemat Ikut Open Trip ke Lombok Biar Nggak Boncos",
    excerpt: "Mau ke Lombok tapi budget pas-pasan? Ini rahasianya biar liburan tetap seru tanpa bikin dompet lu nangis.",
    content: `
Liburan ke Lombok sering dibilang mahal karena tiket pesawat atau biaya penyeberangan gili. Padahal, kalau lu tahu celahnya, lu bisa dapet liburan super seru dengan budget yang masuk akal banget.

Berikut beberapa tips dari tim LombokWander biar trip lu hemat tapi tetep kerasa eksklusif:

### 1. Pilih Open Trip, Hindari Private Trip Sendirian
Kalau lu pergi cuma berdua atau bertiga, sewa kapal hopping gili atau mobil keliling Lombok bakal kerasa mahal banget. Dengan ikut Open Trip, biaya sewa kapal, mobil, dan guide dibagi rata bareng peserta lain. Lebih murah dan bonusnya dapet temen baru!

### 2. Hindari Musim Liburan Panjang (High Season)
Bulan Juni-Agustus dan Desember biasanya harga hotel di Lombok naik drastis. Kalau lu punya jatah cuti, cobalah ambil di bulan Februari, Maret, atau September. Selain harga homestay/hotel lebih murah, spot foto favorit lu juga nggak bakal terlalu rame antreannya.

### 3. Jajan Kuliner Lokal, Kurangi Resto Mewah
Nggak perlu tiap hari makan di restoran bule pinggir pantai Senggigi. Lombok punya kuliner lokal yang juara banget, kayak Nasi Balap Puyung atau Ayam Taliwang di warung sederhana pinggir jalan. Harganya ramah kantong dan rasanya jauh lebih otentik!

### 4. Tinggal Bawa Baju, Biar Travel Agent yang Urus Sisanya
Banyak orang coba urus semuanya sendiri tapi malah boncos di biaya tak terduga (seperti biaya retribusi spot wisata, tips lokal guide, dll). Di LombokWander, paket open trip kita udah include semuanya. Lu tinggal bawa baju dan kamera, sisanya kita yang urus tanpa biaya siluman.

Yuk, langsung cek jadwal open trip kita bulan ini!
    `,
    category: "Tips",
    date: "20 Juni 2026",
    readTime: "3 min read",
    author: "Rian LombokWander",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85",
    views: 1240,
  },
  {
    id: "2",
    slug: "body-rafting-green-canyon-ciamis",
    title: "Pertama Kali ke Green Canyon Ciamis? Ini yang Wajib Lu Siapin",
    excerpt: "Jangan langsung nyebur dulu! Baca panduan body rafting ini biar pengalaman susur sungai lu aman dan menyenangkan.",
    content: `
Green Canyon Ciamis (atau warga lokal biasa sebut Cukang Taneuh) emang surganya pecinta air. Susur sungai diapit tebing batu tinggi berlumut hijau toska itu seru banget, tapi ada beberapa hal penting yang harus lu perhatikan biar aman.

Sebagai guide yang udah bolak-balik nemenin trip ke sana, ini checklist wajib dari gue:

### 1. Pakaian yang Tepat (Jangan Pake Jeans!)
Pakailah baju renang, jersey olahraga dry-fit, atau kaos santai yang enteng saat basah. Hindari celana jeans atau bahan tebal yang berat kalau kena air karena bakal nyusahin lu saat berenang hanyut.

### 2. Sandal Gunung atau Sepatu Air (Water Shoes)
Batuan di aliran sungai Green Canyon itu sebagian licin dan tajam. Sangat disarankan pakai sandal gunung yang mengikat kuat atau sepatu air khusus. Jangan pakai sandal jepit biasa karena rawan hanyut kebawa arus sungai.

### 3. Bawa Waterproof Pouch untuk HP
Meskipun tim LombokWander menyediakan dokumentasi gratis dengan kamera tahan air, kalau lu tetep mau bawa HP sendiri buat update status, wajib pakai pouch kedap air yang dikalungkan ke leher. Pastikan pouch-nya dites dulu di homestay ya!

### 4. Patuhi Instruksi Guide Lokal
Di setiap titik arus deras, guide lokal kita bakal kasih tahu kapan harus tengkurap, kapan harus telentang, atau di mana spot yang aman buat lompat dari tebing. Jangan coba-coba lompat di luar spot yang direkomendasikan ya, demi keselamatan lu juga.

Siap seru-seruan basah-basahan akhir pekan ini? Yuk gabung Open Trip Ciamis kita!
    `,
    category: "Panduan",
    date: "18 Juni 2026",
    readTime: "4 min read",
    author: "Agus Ciamis Expert",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=900&q=85",
    views: 3891,
  },
  {
    id: "3",
    slug: "5-kuliner-wajib-pangandaran-ciamis",
    title: "5 Kuliner Seafood & Makanan Khas di Pangandaran yang Bikin Nagih",
    excerpt: "Gak cuma pantai, Ciamis dan Pangandaran punya kuliner seafood segar murah yang wajib dicoba pas trip nanti.",
    content: `
Kalau main ke Pangandaran tapi cuma main air tanpa wisata kulineran, trip lu belom lengkap namanya. Di area pantai barat dan timur Pangandaran, ada banyak banget kuliner laut segar yang diolah langsung pakai bumbu khas Sunda.

Berikut 5 rekomendasi kuliner wajib coba versi LombokWander:

### 1. Kepiting Saus Padang Pantai Timur
Pangandaran terkenal dengan kepiting bakau segarnya. Di area pasar ikan pantai timur, lu bisa pilih langsung kepiting hidup lalu minta dimasakin saus padang atau asam manis. Dagingnya tebal dan manis alami!

### 2. Pindang Gunung Khas Ciamis
Ini dia sop ikan legendaris khas Ciamis. Kuahnya kuning segar karena memakai bumbu kunyit, jahe, asam jawa, dan daun ruku-ruku. Rasanya gurih pedas asam, pas banget dimakan pas kuah masih panas sehabis lelah main air pantai.

### 3. Sate Galendo Ciamis
Pernah dengar Galendo? Ampas kelapa yang diolah manis gurih khas Ciamis. Nah, sate daging sapi khas Ciamis disajikan dengan taburan bumbu galendo kelapa ini. Rasanya manis-manis gurih unik yang nggak bakal lu temuin di tempat lain!

### 4. Ikan Bakar Kakap Merah Khas Nelayan
Beli langsung dari nelayan lokal di pantai barat, lalu bakar di warung pinggir pantai. Cukup pakai bumbu kecap pedas dan jeruk limau, rasa kesegaran ikannya bener-bener kerasa beda dibanding seafood kota besar.

### 5. Jus Honje Merah
Minuman khas Pangandaran yang terbuat dari bunga kecombrang merah (honje). Rasanya asam manis segar unik banget di lidah, sekaligus berkhasiat menghilangkan pegal-pegal setelah seharian jalan.

Mau cobain semua kuliner ini langsung di tempatnya? Ikutan open trip bareng kita akhir pekan ini!
    `,
    category: "Kuliner",
    date: "15 Juni 2026",
    readTime: "3 min read",
    author: "Novi Foodie",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    views: 2104,
  },
];
