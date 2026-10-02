"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Image,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  TrendingUp,
  Users,
  Eye,
  Star,
  ChevronRight,
  Menu,
  X,
  Bell,
  Briefcase,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────
interface Post {
  id: number;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  gambar: string;
  tanggal: string;
  status: "Publish" | "Draft";
  views: number;
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ReactNode;
  color: string;
}

// ── Nav items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/destinasi", label: "Destinasi", icon: MapPin },
  { href: "/admin/services", label: "Layanan Service", icon: Briefcase },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
];

// ── Dummy data ─────────────────────────────────────────────
const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    slug: "tips-hemat-open-trip-lombok",
    judul: "Tips Hemat Ikut Open Trip ke Lombok Biar Nggak Boncos",
    ringkasan: "Mau ke Lombok tapi budget pas-pasan? Ini rahasianya biar liburan tetap seru tanpa bikin dompet lu nangis.",
    konten: "Liburan ke Lombok sering dibilang mahal karena tiket pesawat atau biaya penyeberangan gili. Padahal, kalau lu tahu celahnya, lu bisa dapet liburan super seru dengan budget yang masuk akal banget.",
    kategori: "Tips",
    gambar: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85",
    tanggal: "20 Jun 2026",
    status: "Publish",
    views: 1240
  },
  {
    id: 2,
    slug: "body-rafting-green-canyon-ciamis",
    judul: "Pertama Kali ke Green Canyon Ciamis? Ini yang Wajib Lu Siapin",
    ringkasan: "Jangan langsung nyebur dulu! Baca panduan body rafting ini biar pengalaman susur sungai lu aman dan menyenangkan.",
    konten: "Green Canyon Ciamis (atau warga lokal biasa sebut Cukang Taneuh) emang surganya pecinta air. Susur sungai diapit tebing batu tinggi berlumut hijau toska itu seru banget, tapi ada beberapa hal penting yang harus lu perhatikan biar aman.",
    kategori: "Panduan",
    gambar: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=900&q=85",
    tanggal: "18 Jun 2026",
    status: "Publish",
    views: 3891
  },
  {
    id: 3,
    slug: "5-kuliner-wajib-pangandaran-ciamis",
    judul: "5 Kuliner Seafood & Makanan Khas di Pangandaran yang Bikin Nagih",
    ringkasan: "Gak cuma pantai, Ciamis dan Pangandaran punya kuliner seafood segar murah yang wajib dicoba pas trip nanti.",
    konten: "Kalau main ke Pangandaran tapi cuma main air tanpa wisata kulineran, trip lu belom lengkap namanya. Di area pantai barat dan timur Pangandaran, ada banyak banget kuliner laut segar yang diolah langsung pakai bumbu khas Sunda.",
    kategori: "Kuliner",
    gambar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    tanggal: "15 Jun 2026",
    status: "Draft",
    views: 0
  }
];

// ── Sidebar ────────────────────────────────────────────────
function Sidebar({
  open,
  onClose,
  onLogout,
  user,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-950 border-r border-white/5 z-40 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0">
          <div className="text-xl font-black bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent tracking-tighter">
            Batur Ngelamang.
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = label === "Dashboard" 
              ? pathname === "/admin/dashboard"
              : pathname === href && href !== "/admin/dashboard";
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${active
                    ? "bg-gradient-to-r from-blue-600/20 to-teal-500/10 text-teal-300 border border-teal-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-teal-400" : "text-slate-500"}`} />
                {label}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-teal-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5 space-y-2 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold rounded-xl transition text-sm"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({ name: "Admin", email: "admin@baturngelamang.com" });
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Auth guard
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* noop */ }
    }

    // Load posts from Laravel API first, fallback to localStorage
    const fetchPosts = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      try {
        const res = await fetch(`${apiUrl}/posts`);
        if (res.ok) {
          const data = await res.json();
          const mapped: Post[] = data.map((item: any) => ({
            id: item.id,
            slug: item.slug || "",
            judul: item.judul || "",
            ringkasan: item.ringkasan || (item.konten || "").substring(0, 150) + "...",
            konten: item.konten || "",
            kategori: item.kategori || "Tips",
            gambar: item.thumbnail || item.gambar || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
            tanggal: item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru",
            status: item.status === "Draft" ? "Draft" : "Publish",
            views: item.views || 0
          }));
          setPosts(mapped);
          localStorage.setItem("admin_posts", JSON.stringify(mapped));
          return;
        }
      } catch (e) {
        console.warn("Laravel API offline, using local storage fallback", e);
      }

      // Local storage fallback
      const localPosts = localStorage.getItem("admin_posts");
      if (localPosts) {
        try {
          setPosts(JSON.parse(localPosts));
        } catch (e) {
          setPosts(DUMMY_POSTS);
        }
      } else {
        setPosts(DUMMY_POSTS);
        localStorage.setItem("admin_posts", JSON.stringify(DUMMY_POSTS));
      }
    };

    fetchPosts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const savePostsToStorage = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("admin_posts", JSON.stringify(updatedPosts));
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    
    // Optimistic UI update
    const updated = posts.filter((p) => p.id !== id);
    savePostsToStorage(updated);
    setDeleteId(null);

    // Call Laravel API
    if (token) {
      try {
        const res = await fetch(`${apiUrl}/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        if (!res.ok) {
          console.error("Gagal menghapus postingan dari database Laravel");
        }
      } catch (e) {
        console.error("Error deleting from database, offline fallback active:", e);
      }
    }
  };

  const handleOpenWrite = () => {
    router.push("/admin/artikel/tulis");
  };

  const handleOpenEdit = (post: Post) => {
    router.push(`/admin/artikel/tulis?id=${post.id}`);
  };

  const filtered = posts.filter((p) =>
    p.judul.toLowerCase().includes(search.toLowerCase())
  );

  const stats: StatCard[] = [
    {
      label: "Total Artikel",
      value: String(posts.length),
      change: "+2 bulan ini",
      up: true,
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-600 to-blue-400",
    },
    {
      label: "Total Views",
      value: "7.2K",
      change: "+18% minggu ini",
      up: true,
      icon: <Eye className="w-6 h-6" />,
      color: "from-teal-600 to-teal-400",
    },
    {
      label: "Peserta Trip",
      value: "5,000+",
      change: "+120 bulan ini",
      up: true,
      icon: <Users className="w-6 h-6" />,
      color: "from-violet-600 to-violet-400",
    },
    {
      label: "Rating",
      value: "4.9★",
      change: "Stabil",
      up: true,
      icon: <Star className="w-6 h-6" />,
      color: "from-amber-500 to-orange-400",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex text-white">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Topbar */}
        <header className="h-[72px] bg-slate-950/80 backdrop-blur-sm border-b border-white/5 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
              id="open-sidebar-btn"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Kelola Artikel Blog</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-black shadow-md">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* ── Stat Cards ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition group">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                    <TrendingUp className="w-3 h-3" />
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Quick Menu / Shortcut Cards ────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/destinasi"
                className="p-5 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-2xl flex items-center justify-between group transition hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">Kelola Destinasi</h3>
                    <p className="text-[11px] text-slate-400">Atur spot wisata, rundown & paket</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/services"
                className="p-5 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 hover:border-teal-500/50 rounded-2xl flex items-center justify-between group transition hover:bg-teal-500/[0.15]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors">Layanan Service</h3>
                      <span className="text-[9px] bg-teal-500/30 text-teal-300 font-extrabold px-1.5 py-0.2 rounded">Baru</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Atur sewa mobil, kamera, porter dll</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/galeri"
                className="p-5 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-2xl flex items-center justify-between group transition hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Image className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">Galeri & Testimoni</h3>
                    <p className="text-[11px] text-slate-400">Koleksi foto kegiatan & ulasan peserta</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* ── Artikel Table ────────────────────────────────── */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5">
                <h2 className="text-base font-bold text-white">Daftar Artikel</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      id="search-artikel"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                      placeholder="Cari judul artikel..."
                    />
                  </div>
                  <button
                    id="btn-tulis-artikel"
                    onClick={handleOpenWrite}
                    className="flex-shrink-0 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tulis Artikel</span>
                    <span className="sm:hidden">Baru</span>
                  </button>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Judul Artikel</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                          Tidak ada artikel yang ditemukan.
                        </td>
                      </tr>
                    ) : filtered.map((post) => (
                      <tr key={post.id} className="hover:bg-white/[0.03] transition group">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white text-sm leading-snug">{post.judul}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-lg">
                            {post.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{post.tanggal}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {post.views > 0 ? post.views.toLocaleString("id-ID") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                             post.status === "Publish"
                               ? "bg-emerald-500/10 text-emerald-400"
                               : "bg-amber-500/10 text-amber-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${post.status === "Publish" ? "bg-emerald-400" : "bg-amber-400"}`} />
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(post.id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-white/5">
                {filtered.map((post) => (
                  <div key={post.id} className="p-5 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm mb-1 leading-snug">{post.judul}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-md">
                          {post.kategori}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                          post.status === "Publish" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-slate-500 text-xs">{post.tanggal}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>Menampilkan {filtered.length} dari {posts.length} artikel</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition">← Prev</button>
                  <span className="px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-lg font-bold">1</span>
                  <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition">Next →</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Hapus Artikel?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Artikel ini akan dihapus secara permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
