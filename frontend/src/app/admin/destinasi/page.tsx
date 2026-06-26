"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, MapPin, Image as ImageIcon, Settings, LogOut, Menu, X, Save, Edit2, Plus, Trash2, Eye } from "lucide-react";
import { DestinationData, SpotItem, ItineraryDay, TripPackage } from "../../data/destinationsData";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/destinasi", label: "Destinasi", icon: MapPin },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
];

export default function AdminDestinasi() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: "Admin", email: "admin@baturngelamang.com" });

  // Destinations data state
  const [activeTab, setActiveTab] = useState<"lombok" | "ciamis">("lombok");
  const [destinations, setDestinations] = useState<Record<string, DestinationData>>({});

  // Input states for active destination
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [waMessage, setWaMessage] = useState("");

  // Spots and Itinerary lists for editing
  const [spots, setSpots] = useState<SpotItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [packages, setPackages] = useState<TripPackage[]>([]);

  // Edit Spot Modal States
  const [spotModalOpen, setSpotModalOpen] = useState(false);
  const [editingSpotIndex, setEditingSpotIndex] = useState<number | null>(null);
  const [spotName, setSpotName] = useState("");
  const [spotDesc, setSpotDesc] = useState("");
  const [spotImg, setSpotImg] = useState("");
  const [spotTag, setSpotTag] = useState("");

  // Edit Package Modal States
  const [packagesModalOpen, setPackagesModalOpen] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null);
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState<string>("");
  const [packageDesc, setPackageDesc] = useState("");
  const [packageFeatures, setPackageFeatures] = useState<string>("");
  const [packageImg, setPackageImg] = useState("");

  // Edit Itinerary Modal States
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [editingItineraryIndex, setEditingItineraryIndex] = useState<number | null>(null);
  const [itineraryDay, setItineraryDay] = useState("");
  const [itineraryTitle, setItineraryTitle] = useState("");
  const [itineraryDesc, setItineraryDesc] = useState("");
  const [itineraryIcon, setItineraryIcon] = useState("");

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

    // Load destinations from localStorage
    loadDestinations();
  }, [router]);

  const loadDestinations = async () => {
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
        populateFields(mapped[activeTab] || mapped["lombok"]);
        return;
      }
    } catch (e) {
      console.warn("Laravel API offline, using local storage fallback for destinations", e);
    }

    const local = localStorage.getItem("admin_destinations");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setDestinations(parsed);
        populateFields(parsed[activeTab] || parsed["lombok"]);
      } catch (e) {
        initDefaultDestinations();
      }
    } else {
      initDefaultDestinations();
    }
  };

  const initDefaultDestinations = async () => {
    // Import static data as fallback
    const { DESTINATIONS_DATA } = await import("../../data/destinationsData");
    setDestinations(DESTINATIONS_DATA);
    localStorage.setItem("admin_destinations", JSON.stringify(DESTINATIONS_DATA));
    populateFields(DESTINATIONS_DATA[activeTab]);
  };

  const populateFields = (data: DestinationData) => {
    if (!data) return;
    setLabel(data.label);
    setRegion(data.region);
    setHeroTagline(data.heroTagline);
    setWaMessage(data.waMessage);
    setSpots(data.spots || []);
    setItinerary(data.itinerary || []);
    setPackages(data.packages || []);
  };

  // Sync state when switching active destination tab
  const handleTabChange = (tab: "lombok" | "ciamis") => {
    setActiveTab(tab);
    if (destinations[tab]) {
      populateFields(destinations[tab]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedDest: DestinationData = {
      ...destinations[activeTab],
      label,
      region,
      heroTagline,
      waMessage,
      spots,
      itinerary,
      packages,
    };

    const nextDestinations = {
      ...destinations,
      [activeTab]: updatedDest,
    };

    setDestinations(nextDestinations);
    localStorage.setItem("admin_destinations", JSON.stringify(nextDestinations));

    // Save to Database
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const dbPayload = {
      label,
      region,
      hero_tagline: heroTagline,
      wa_message: waMessage,
      spots,
      itinerary,
      packages,
    };

    if (token) {
      try {
        const res = await fetch(`${apiUrl}/destinations/${activeTab}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          body: JSON.stringify(dbPayload)
        });

        if (res.ok) {
          alert(`Sukses memperbarui info destinasi ${label} di database!`);
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Gagal menyimpan ke database Laravel:", errData);
          alert("Gagal menyimpan ke database Laravel. Tersimpan lokal di browser.");
        }
      } catch (err) {
        console.error("Error saving to database:", err);
        alert("Server Laravel offline. Info destinasi tersimpan lokal di browser Anda.");
      }
    } else {
      alert(`Sukses memperbarui info destinasi ${label} secara lokal! (Belum Login/Token tidak ada)`);
    }
  };

  // Spot CRUD Helpers
  const openEditSpot = (index: number) => {
    setEditingSpotIndex(index);
    const spot = spots[index];
    setSpotName(spot.name);
    setSpotDesc(spot.desc);
    setSpotImg(spot.img);
    setSpotTag(spot.tag);
    setSpotModalOpen(true);
  };

  const openAddSpot = () => {
    setEditingSpotIndex(null);
    setSpotName("");
    setSpotDesc("");
    setSpotImg("");
    setSpotTag("Promo");
    setSpotModalOpen(true);
  };

  const handleSaveSpot = () => {
    const newSpot: SpotItem = {
      name: spotName,
      desc: spotDesc,
      img: spotImg || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
      tag: spotTag,
      color: editingSpotIndex !== null ? spots[editingSpotIndex].color : "from-teal-500/80 to-blue-700/80",
    };

    let nextSpots = [...spots];
    if (editingSpotIndex !== null) {
      nextSpots[editingSpotIndex] = newSpot;
    } else {
      nextSpots.push(newSpot);
    }
    setSpots(nextSpots);
    setSpotModalOpen(false);
  };

  const handleDeleteSpot = (index: number) => {
    if (confirm("Hapus spot wisata ini?")) {
      const nextSpots = spots.filter((_, idx) => idx !== index);
      setSpots(nextSpots);
    }
  };

  // Itinerary CRUD Helpers
  const openEditItinerary = (index: number) => {
    setEditingItineraryIndex(index);
    const item = itinerary[index];
    setItineraryDay(item.day);
    setItineraryTitle(item.title);
    setItineraryDesc(item.desc);
    setItineraryIcon(item.icon);
    setItineraryModalOpen(true);
  };

  const openAddItinerary = () => {
    setEditingItineraryIndex(null);
    setItineraryDay(`Hari ${itinerary.length + 1}`);
    setItineraryTitle("");
    setItineraryDesc("");
    setItineraryIcon("📍");
    setItineraryModalOpen(true);
  };

  const handleSaveItinerary = () => {
    const newItem: ItineraryDay = {
      day: itineraryDay,
      title: itineraryTitle,
      desc: itineraryDesc,
      icon: itineraryIcon,
    };

    let nextItinerary = [...itinerary];
    if (editingItineraryIndex !== null) {
      nextItinerary[editingItineraryIndex] = newItem;
    } else {
      nextItinerary.push(newItem);
    }
    setItinerary(nextItinerary);
    setItineraryModalOpen(false);
  };

  const handleDeleteItinerary = (index: number) => {
    if (confirm("Hapus rencana hari ini?")) {
      const nextItinerary = itinerary.filter((_, idx) => idx !== index);
      setItinerary(nextItinerary);
    }
  };

  // Package CRUD Helpers
  const openEditPackage = (index: number) => {
    setEditingPackageIndex(index);
    const pkg = packages[index];
    setPackageName(pkg.name);
    setPackagePrice(pkg.price !== undefined ? String(pkg.price) : "");
    setPackageDesc(pkg.description || "");
    setPackageFeatures((pkg.features || []).join("\n"));
    setPackageImg(pkg.image || "");
    setPackagesModalOpen(true);
  };

  const openAddPackage = () => {
    setEditingPackageIndex(null);
    setPackageName("");
    setPackagePrice("");
    setPackageDesc("");
    setPackageFeatures("");
    setPackageImg("");
    setPackagesModalOpen(true);
  };

  const handleSavePackage = () => {
    const numericPrice = packagePrice.trim() !== "" ? parseFloat(packagePrice.replace(/[^0-9.-]+/g, "")) : undefined;
    const newPkg: TripPackage = {
      name: packageName,
      price: isNaN(numericPrice as any) || numericPrice === undefined ? undefined : numericPrice,
      description: packageDesc.trim() || undefined,
      features: packageFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      image: packageImg.trim() || undefined,
    };

    let nextPackages = [...packages];
    if (editingPackageIndex !== null) {
      nextPackages[editingPackageIndex] = newPkg;
    } else {
      nextPackages.push(newPkg);
    }
    setPackages(nextPackages);
    setPackagesModalOpen(false);
  };

  const handleDeletePackage = (index: number) => {
    if (confirm("Hapus paket trip ini?")) {
      const nextPackages = packages.filter((_, idx) => idx !== index);
      setPackages(nextPackages);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex font-sans">
      {/* ── Sidebar Desktop ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-white/5 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white">Batur Ngelamang</h1>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin/destinasi";
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
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-white">Batur Ngelamang</h1>
                <span className="text-[10px] font-bold text-teal-400 tracking-wider">Admin</span>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                const isActive = item.href === "/admin/destinasi";
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
              <h2 className="text-lg font-black text-white">Kelola Destinasi</h2>
              <p className="text-xs text-slate-500">Sesuaikan paket open trip & itinerary wisata</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab selector destinasi */}
            <div className="flex bg-slate-950 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => handleTabChange("lombok")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === "lombok" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Lombok
              </button>
              <button
                onClick={() => handleTabChange("ciamis")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === "ciamis" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Ciamis
              </button>
            </div>
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/5"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat Web
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
          <form onSubmit={handleSaveDestination} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Utama (Kiri) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Box 1: Informasi Umum */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-5">
                <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                  Informasi Umum Destinasi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Nama Tampilan Tab
                    </label>
                    <input
                      type="text"
                      required
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Region / Wilayah Provinsi
                    </label>
                    <input
                      type="text"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tagline Hero Banner
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Template Pesan WhatsApp Booking
                  </label>
                  <input
                    type="text"
                    required
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  />
                </div>
              </div>

              {/* Box 2: Spot Wisata Unggulan */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Spot Wisata Unggulan
                  </h3>
                  <button
                    type="button"
                    onClick={openAddSpot}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Spot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spots.map((spot, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex gap-4 items-start relative group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                        <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                          {spot.tag}
                        </span>
                        <h4 className="font-extrabold text-white text-sm truncate mt-1">{spot.name}</h4>
                        <p className="text-slate-400 text-xs line-clamp-2 mt-0.5 leading-relaxed">{spot.desc}</p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditSpot(idx)}
                          className="p-1 text-slate-400 hover:text-blue-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSpot(idx)}
                          className="p-1 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2b: Pilihan Paket Trip */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Pilihan Paket Trip
                  </h3>
                  <button
                    type="button"
                    onClick={openAddPackage}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Paket
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 flex gap-4 items-start justify-between relative group">
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                          {pkg.price ? `Rp ${pkg.price.toLocaleString("id-ID")}` : "Harga Opsional / Hubungi Admin"}
                        </span>
                        <h4 className="font-extrabold text-white text-sm truncate mt-1.5">{pkg.name}</h4>
                        {pkg.description && (
                          <p className="text-slate-400 text-xs line-clamp-2 mt-0.5 leading-relaxed">{pkg.description}</p>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-2 font-semibold">
                          {pkg.features?.length || 0} Fasilitas
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditPackage(idx)}
                          className="p-1 text-slate-400 hover:text-blue-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(idx)}
                          className="p-1 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {packages.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-slate-500 text-sm">
                      Belum ada paket trip untuk destinasi ini. Klik "Tambah Paket" untuk membuat.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kolom Samping (Kanan) */}
            <div className="space-y-8">
              {/* Box 3: Rencana Perjalanan (Itinerary Rundown) */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Rencana Perjalanan (Rundown)
                  </h3>
                  <button
                    type="button"
                    onClick={openAddItinerary}
                    className="p-1 hover:bg-white/5 text-teal-400 rounded-lg transition"
                    title="Tambah Rundown"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {itinerary.map((day, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-white/10 rounded-xl p-4 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{day.icon}</span>
                          <span className="text-xs font-bold text-teal-400">{day.day}</span>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => openEditItinerary(idx)}
                            className="p-1 text-slate-400 hover:text-blue-400 transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItinerary(idx)}
                            className="p-1 text-slate-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-white text-xs leading-snug">{day.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">{day.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: Action button */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-2xl transition shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan Info Destinasi
                </button>
                <Link
                  href="/admin/dashboard"
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-2xl transition block text-center text-sm border border-white/5"
                >
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* ── Modal Edit/Tambah Spot Wisata ────────────────────── */}
      {spotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSpotModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-white mb-6">
              {editingSpotIndex !== null ? "Edit Spot Wisata" : "Tambah Spot Wisata"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Nama Spot</label>
                <input
                  type="text"
                  required
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Pantai Pink & Gili Hopping"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Deskripsi Singkat</label>
                <textarea
                  required
                  rows={3}
                  value={spotDesc}
                  onChange={(e) => setSpotDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Tulis deskripsi spot disini..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">URL Gambar Spot</label>
                <input
                  type="url"
                  value={spotImg}
                  onChange={(e) => setSpotImg(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Tag Promo (Badge)</label>
                <input
                  type="text"
                  value={spotTag}
                  onChange={(e) => setSpotTag(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Terlaris, Rekomendasi"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSpotModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveSpot}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition"
                >
                  Simpan Spot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Edit/Tambah Itinerary ──────────────────────── */}
      {itineraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setItineraryModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-white mb-6">
              {editingItineraryIndex !== null ? "Edit Rencana Harian" : "Tambah Rencana Harian"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Hari</label>
                  <input
                    type="text"
                    required
                    value={itineraryDay}
                    onChange={(e) => setItineraryDay(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: Hari 1"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Emoji Icon</label>
                  <input
                    type="text"
                    required
                    value={itineraryIcon}
                    onChange={(e) => setItineraryIcon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-center focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="⛵"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Judul Aktivitas</label>
                <input
                  type="text"
                  required
                  value={itineraryTitle}
                  onChange={(e) => setItineraryTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                  placeholder="Contoh: Sunrise Bukit Merese"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Deskripsi Rincian</label>
                <textarea
                  required
                  rows={4}
                  value={itineraryDesc}
                  onChange={(e) => setItineraryDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Detail rencana harian..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setItineraryModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveItinerary}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition"
                >
                  Simpan Hari
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── Modal Edit/Tambah Paket Trip ──────────────────────── */}
        {packagesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setPackagesModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-black text-white mb-6">
                {editingPackageIndex !== null ? "Edit Paket Trip" : "Tambah Paket Trip"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: Paket Backpacker (3D2N)"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Harga (Rupiah - Opsional)</label>
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm"
                    placeholder="Contoh: 1500000 (Kosongkan jika opsional/Hubungi Admin)"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">URL Gambar Banner Paket (Opsional)</label>
                  <input
                    type="url"
                    value={packageImg}
                    onChange={(e) => setPackageImg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm mb-2"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {packageImg && (
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                      <img
                        src={packageImg}
                        alt="Preview Banner Paket"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                        Preview Foto Paket
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={packageDesc}
                    onChange={(e) => setPackageDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                    placeholder="Contoh: Cocok untuk liburan hemat bareng kawan-kawan."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Fasilitas & Layanan (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={packageFeatures}
                    onChange={(e) => setPackageFeatures(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 transition outline-none text-sm resize-none"
                    placeholder="Hotel AC 2 Malam&#10;Makan 6x&#10;Dokumentasi Foto & Gopro"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setPackagesModalOpen(false)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePackage}
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition"
                  >
                    Simpan Paket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
