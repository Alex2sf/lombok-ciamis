"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, MapPin, Image as ImageIcon, Settings, LogOut, Menu, X, Save, Plus, Trash2, Star, Edit2, Eye, Upload, Briefcase } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/destinasi", label: "Destinasi", icon: MapPin },
  { href: "/admin/services", label: "Layanan Service", icon: Briefcase },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
];

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

export default function AdminGaleri() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: "Admin", email: "admin@baturngelamang.com" });

  // Gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  // Testimonials state
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Gallery Form modal state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgLayout, setImgLayout] = useState(""); // "" or "col-span-2 row-span-2"

  // Testimonial Form modal state
  const [testiModalOpen, setTestiModalOpen] = useState(false);
  const [editingTestiIndex, setEditingTestiIndex] = useState<number | null>(null);
  const [testiName, setTestiName] = useState("");
  const [testiRole, setTestiRole] = useState("");
  const [testiAvatar, setTestiAvatar] = useState("");
  const [testiStars, setTestiStars] = useState(5);
  const [testiText, setTestiText] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setImageState: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setImageState(data.url);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Gagal mengupload gambar.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Terjadi kesalahan saat mengupload.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Auth Check
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { /* noop */ }
    }

    // Load from LocalStorage
    const storedGallery = localStorage.getItem("admin_gallery");
    if (storedGallery) {
      try { setGallery(JSON.parse(storedGallery)); } catch { setGallery(DEFAULT_GALLERY); }
    } else {
      setGallery(DEFAULT_GALLERY);
      localStorage.setItem("admin_gallery", JSON.stringify(DEFAULT_GALLERY));
    }

    const storedTestimonials = localStorage.getItem("admin_testimonials");
    if (storedTestimonials) {
      try { setTestimonials(JSON.parse(storedTestimonials)); } catch { setTestimonials(DEFAULT_TESTIMONIALS); }
    } else {
      setTestimonials(DEFAULT_TESTIMONIALS);
      localStorage.setItem("admin_testimonials", JSON.stringify(DEFAULT_TESTIMONIALS));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  // Gallery CRUD logic
  const openAddGallery = () => {
    setEditingGalleryIndex(null);
    setImgUrl("");
    setImgLayout("");
    setGalleryModalOpen(true);
  };

  const openEditGallery = (index: number) => {
    setEditingGalleryIndex(index);
    const item = gallery[index];
    setImgUrl(item.img);
    setImgLayout(item.span);
    setGalleryModalOpen(true);
  };

  const handleSaveGallery = () => {
    if (!imgUrl.trim()) return;
    const newItem: GalleryItem = { img: imgUrl, span: imgLayout };
    let nextGallery = [...gallery];
    if (editingGalleryIndex !== null) {
      nextGallery[editingGalleryIndex] = newItem;
    } else {
      nextGallery.push(newItem);
    }
    setGallery(nextGallery);
    localStorage.setItem("admin_gallery", JSON.stringify(nextGallery));
    setGalleryModalOpen(false);
  };

  const handleDeleteGallery = (index: number) => {
    if (confirm("Hapus foto dari galeri?")) {
      const nextGallery = gallery.filter((_, idx) => idx !== index);
      setGallery(nextGallery);
      localStorage.setItem("admin_gallery", JSON.stringify(nextGallery));
    }
  };

  // Testimonials CRUD logic
  const openAddTesti = () => {
    setEditingTestiIndex(null);
    setTestiName("");
    setTestiRole("");
    setTestiAvatar("");
    setTestiStars(5);
    setTestiText("");
    setTestiModalOpen(true);
  };

  const openEditTesti = (index: number) => {
    setEditingTestiIndex(index);
    const item = testimonials[index];
    setTestiName(item.name);
    setTestiRole(item.role);
    setTestiAvatar(item.avatar);
    setTestiStars(item.stars);
    setTestiText(item.text);
    setTestiModalOpen(true);
  };

  const handleSaveTesti = () => {
    if (!testiName.trim() || !testiText.trim()) return;
    const newItem: TestimonialItem = {
      name: testiName,
      role: testiRole || "Kawan Jalan",
      avatar: testiAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      stars: testiStars,
      text: testiText,
    };
    let nextTestimonials = [...testimonials];
    if (editingTestiIndex !== null) {
      nextTestimonials[editingTestiIndex] = newItem;
    } else {
      nextTestimonials.push(newItem);
    }
    setTestimonials(nextTestimonials);
    localStorage.setItem("admin_testimonials", JSON.stringify(nextTestimonials));
    setTestiModalOpen(false);
  };

  const handleDeleteTesti = (index: number) => {
    if (confirm("Hapus ulasan testimoni ini?")) {
      const nextTestimonials = testimonials.filter((_, idx) => idx !== index);
      setTestimonials(nextTestimonials);
      localStorage.setItem("admin_testimonials", JSON.stringify(nextTestimonials));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex font-sans">
      {/* ── Sidebar Desktop ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-white/5 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white">Batur Ngelamang</h1>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin/galeri";
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/10 to-teal-500/10 border border-teal-500/20 text-teal-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-200">
              {user.name[0]}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Sidebar Mobile Drawer ────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 bg-slate-950 p-6 flex flex-col h-full border-r border-white/5 animate-slide-in">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-white">Batur Ngelamang</h1>
                <span className="text-[10px] font-bold text-teal-400 tracking-wider">Admin</span>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                const isActive = item.href === "/admin/galeri";
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/10 to-teal-500/10 border border-teal-500/20 text-teal-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── Main Area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-black text-white">Galeri & Testimoni</h2>
              <p className="text-xs text-slate-500">Kelola album perjalanan dan review peserta trip</p>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/5"
          >
            <Eye className="w-3.5 h-3.5" />
            Lihat Web
          </a>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
          {/* Section 1: Galeri Foto */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Galeri Foto Perjalanan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Dirender dengan susunan Grid Masonry di Halaman Utama</p>
              </div>
              <button
                type="button"
                onClick={openAddGallery}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Tambah Foto
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gallery.map((item, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <img src={item.img} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                  {item.span && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-wider">
                      Layout Lebar
                    </span>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditGallery(idx)}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                      title="Edit Layout"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGallery(idx)}
                      className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Testimoni Kawan Jalan */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Ulasan Testimoni</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ulasan kepuasan dari peserta yang pernah ikut trip</p>
              </div>
              <button
                type="button"
                onClick={openAddTesti}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Tambah Ulasan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testi, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative group">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mb-3">
                      {[...Array(testi.stars)].map((_, s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <p className="text-slate-300 text-xs italic leading-relaxed mb-6">"{testi.text}"</p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <img src={testi.avatar} alt={testi.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{testi.name}</h4>
                      <p className="text-[10px] text-slate-500">{testi.role}</p>
                    </div>
                  </div>

                  {/* Actions hover */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditTesti(idx)}
                      className="p-1.5 bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-lg transition"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTesti(idx)}
                      className="p-1.5 bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── Modal Edit/Tambah Galeri Foto ────────────────────── */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-white mb-6">
              {editingGalleryIndex !== null ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Foto Galeri</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    required
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Pake URL atau upload file..."
                  />
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold gap-1.5 h-[42px] shrink-0">
                    {uploading ? (
                      <span className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setImgUrl)}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {imgUrl && (
                  <div className="aspect-square w-24 rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative mt-2">
                    <img
                      src={imgUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Ukuran/Layout Grid</label>
                <select
                  value={imgLayout}
                  onChange={(e) => setImgLayout(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                >
                  <option value="">Standar (Normal)</option>
                  <option value="col-span-2 row-span-2">Lebar (Col 2, Row 2)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  Gunakan pilihan "Lebar" untuk foto andalan (resolusi tinggi) agar susunan galeri grid terlihat estetik dan bervariasi.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveGallery}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition"
                >
                  Simpan Foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Edit/Tambah Testimoni ──────────────────────── */}
      {testiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setTestiModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-white mb-6">
              {editingTestiIndex !== null ? "Edit Ulasan Testimoni" : "Tambah Ulasan Testimoni"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Nama Peserta</label>
                <input
                  type="text"
                  required
                  value={testiName}
                  onChange={(e) => setTestiName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Reyna Pratiwi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Asal / Keterangan</label>
                  <input
                    type="text"
                    required
                    value={testiRole}
                    onChange={(e) => setTestiRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: Solo Traveler, Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Rating Bintang</label>
                  <select
                    value={testiStars}
                    onChange={(e) => setTestiStars(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  >
                    <option value={5}>5 Bintang (Sempurna)</option>
                    <option value={4}>4 Bintang (Sangat Baik)</option>
                    <option value={3}>3 Bintang (Cukup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Foto Profil Avatar</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={testiAvatar}
                    onChange={(e) => setTestiAvatar(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Pake URL atau upload file..."
                  />
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold gap-1.5 h-[42px] shrink-0">
                    {uploading ? (
                      <span className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setTestiAvatar)}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {testiAvatar && (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-950 border border-white/10 relative mt-2">
                    <img
                      src={testiAvatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Isi Testimoni</label>
                <textarea
                  required
                  rows={4}
                  value={testiText}
                  onChange={(e) => setTestiText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Tulis ulasan jujur peserta di sini..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setTestiModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveTesti}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition"
                >
                  Simpan Ulasan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
