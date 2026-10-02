"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MapPin,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Upload,
  Briefcase,
  DollarSign,
  Tag,
  Save
} from "lucide-react";
import { ServiceItem, DEFAULT_SERVICES } from "../../data/servicesData";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/destinasi", label: "Destinasi", icon: MapPin },
  { href: "/admin/services", label: "Layanan Service", icon: Briefcase },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: "Admin", email: "admin@baturngelamang.com" });

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState("");
  const [waCustomMessage, setWaCustomMessage] = useState("");

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
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        /* noop */
      }
    }

    loadServices();
  }, [router]);

  const loadServices = async () => {
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
      // Backend offline
    }

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

    setServices(DEFAULT_SERVICES);
    localStorage.setItem("admin_services", JSON.stringify(DEFAULT_SERVICES));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Gagal mengupload gambar.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Terjadi kesalahan koneksi upload. Anda bisa menggunakan link URL foto.");
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setName("");
    setCategory("Transportasi");
    setDescription("");
    setPrice("");
    setPriceUnit("/ hari");
    setImage("");
    setFeatures("");
    setWaCustomMessage("");
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    const srv = services[index];
    setName(srv.name || "");
    setCategory(srv.category || "");
    setDescription(srv.description || "");
    setPrice(srv.price !== undefined ? String(srv.price) : "");
    setPriceUnit(srv.priceUnit || "");
    setImage(srv.image || "");
    setFeatures((srv.features || []).join("\n"));
    setWaCustomMessage(srv.waCustomMessage || "");
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama layanan service wajib diisi!");
      return;
    }

    const numericPrice = price.trim() !== "" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : "";
    const finalPrice = isNaN(numericPrice as any) || numericPrice === "" ? price.trim() : numericPrice;

    const newService: ServiceItem = {
      id: editingIndex !== null ? services[editingIndex].id : `srv-${Date.now()}`,
      name: name.trim(),
      category: category.trim() || undefined,
      description: description.trim(),
      price: finalPrice || 0,
      priceUnit: priceUnit.trim() || undefined,
      image: image.trim() || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
      features: features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      waCustomMessage: waCustomMessage.trim() || undefined,
    };

    let updatedList = [...services];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newService;
    } else {
      updatedList.push(newService);
    }

    setServices(updatedList);
    localStorage.setItem("admin_services", JSON.stringify(updatedList));
    setModalOpen(false);

    // Save to Laravel Backend jika endpoint tersedia
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    if (token) {
      try {
        await fetch(`${apiUrl}/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ services: updatedList }),
        });
      } catch (err) {
        // noop fallback saved in localStorage
      }
    }
  };

  const handleDeleteService = async (index: number) => {
    if (confirm("Apakah kamu yakin ingin menghapus layanan ini?")) {
      const updatedList = services.filter((_, idx) => idx !== index);
      setServices(updatedList);
      localStorage.setItem("admin_services", JSON.stringify(updatedList));

      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      if (token) {
        try {
          await fetch(`${apiUrl}/services`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ services: updatedList }),
          });
        } catch (err) {
          // noop
        }
      }
    }
  };

  const formatPricePreview = (p: number | string) => {
    if (!p && p !== 0) return "Hubungi Admin";
    if (typeof p === "string") {
      const num = parseFloat(p.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num) && num > 0) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(num);
      }
      return p;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex font-sans">
      {/* ── Sidebar Desktop ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-white/5 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white">Batur Ngelamang</h1>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin/services";
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-white">Batur Ngelamang</h1>
                <span className="text-[10px] font-bold text-teal-400 tracking-wider">Admin</span>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                const isActive = item.href === "/admin/services";
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
              <h2 className="text-lg font-black text-white">Kelola Layanan Service</h2>
              <p className="text-xs text-slate-500">Tambah gambar, nama service, deskripsi, dan harga layanan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/#services"
              target="_blank"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/5"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat Section Web
            </a>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
            >
              <Plus className="w-4 h-4" />
              Tambah Layanan
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-teal-500/10 via-blue-500/5 to-transparent border border-teal-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">Section Layanan Service Aktif</h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Section ini akan muncul di halaman beranda dengan info gambar produk/layanan, nama service, deskripsi lengkap, harga, serta tombol pemesanan langsung terhubung ke WhatsApp admin.
              </p>
            </div>
            <div className="px-4 py-2 bg-teal-500/20 rounded-2xl border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {services.length} Layanan Ditampilkan
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image cover with tag */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={srv.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {srv.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-extrabold text-teal-300">
                        {srv.category}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(idx)}
                        className="p-2 bg-slate-900/80 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl backdrop-blur-md transition border border-white/10"
                        title="Edit Layanan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(idx)}
                        className="p-2 bg-slate-900/80 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl backdrop-blur-md transition border border-white/10"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-white text-lg group-hover:text-teal-300 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    {srv.features && srv.features.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                          Fitur / Benefit:
                        </span>
                        <ul className="space-y-1">
                          {srv.features.slice(0, 3).map((f, fi) => (
                            <li key={fi} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="text-teal-400 font-bold">✓</span>
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                          {srv.features.length > 3 && (
                            <li className="text-[10px] text-slate-500 italic pl-3">
                              +{srv.features.length - 3} fasilitas lainnya
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing footer */}
                <div className="p-6 pt-0">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Biaya</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-white">
                          {formatPricePreview(srv.price)}
                        </span>
                        {srv.priceUnit && (
                          <span className="text-[10px] text-slate-400">{srv.priceUnit}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditModal(idx)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-teal-300 rounded-lg text-xs font-bold transition border border-white/5"
                    >
                      Ubah Data
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white/5 rounded-3xl border border-white/5 p-8">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-base mb-1">Belum Ada Layanan Service</h4>
                <p className="text-slate-500 text-xs mb-6">Tambahkan opsi layanan rental, dokumentasi, atau fasilitas trip lainnya.</p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Layanan Sekarang
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modal Tambah/Edit Service ──────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-white mb-6">
              {editingIndex !== null ? "Edit Layanan Service" : "Tambah Layanan Service Baru"}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Nama Service / Layanan *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Sewa Mobil & Driver Lokal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Kategori / Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: Transportasi, Kamera"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Satuan Harga
                  </label>
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: / hari, / set, / orang"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Harga Layanan (Angka Rupiah / Hubungi Admin)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: 650000 (Kosongkan jika Hubungi Admin)"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Foto / Gambar Service
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Pake URL atau Upload foto..."
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
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {image && (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                    <img
                      src={image}
                      alt="Preview Layanan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                      Preview Foto
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Deskripsi Lengkap Service *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Jelaskan detail fasilitas apa yang didapatkan..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Fasilitas Termasuk (Satu poin per baris)
                </label>
                <textarea
                  rows={3}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Unit Bersih & Terawat&#10;Driver Berpengalaman&#10;Sudah Termasuk BBM"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Template Pesan WhatsApp Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={waCustomMessage}
                  onChange={(e) => setWaCustomMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Halo admin, mau tanya ketersediaan sewa mobil untuk tanggal..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
