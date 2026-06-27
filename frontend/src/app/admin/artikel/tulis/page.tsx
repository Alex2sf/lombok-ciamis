"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Bold, Italic, Heading, List, Link as LinkIcon, Quote, Upload } from "lucide-react";

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

function TulisArtikelForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [judul, setJudul] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState("Tips");
  const [gambar, setGambar] = useState("");
  const [status, setStatus] = useState<"Publish" | "Draft">("Publish");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const insertFormat = (formatType: "bold" | "italic" | "heading" | "list" | "link" | "quote") => {
    const textarea = document.getElementById("editor-konten") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    switch (formatType) {
      case "bold":
        replacement = `**${selected || "teks tebal"}**`;
        break;
      case "italic":
        replacement = `*${selected || "teks miring"}*`;
        break;
      case "heading":
        replacement = `\n### ${selected || "Sub-judul"}\n`;
        break;
      case "list":
        replacement = `\n- ${selected || "Item list"}`;
        break;
      case "link":
        replacement = `[${selected || "Teks Link"}](https://example.com)`;
        break;
      case "quote":
        replacement = `\n> ${selected || "Kutipan"}\n`;
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setKonten(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const loadData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      let allPosts: Post[] = [];

      try {
        const res = await fetch(`${apiUrl}/posts`);
        if (res.ok) {
          const data = await res.json();
          allPosts = data.map((item: any) => ({
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
          setPosts(allPosts);
          localStorage.setItem("admin_posts", JSON.stringify(allPosts));
        }
      } catch (e) {
        console.warn("Laravel offline, loading from localStorage fallback", e);
        const local = localStorage.getItem("admin_posts");
        if (local) {
          try {
            allPosts = JSON.parse(local);
            setPosts(allPosts);
          } catch (err) {}
        }
      }

      if (editId && allPosts.length > 0) {
        const found = allPosts.find((p) => String(p.id) === editId);
        if (found) {
          setJudul(found.judul);
          setRingkasan(found.ringkasan || "");
          setKonten(found.konten || "");
          setKategori(found.kategori);
          setGambar(found.gambar || "");
          setStatus(found.status);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [editId, router]);

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
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setGambar(data.url);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;

    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const newSlug = judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const postPayload = {
      judul,
      slug: newSlug,
      konten,
      status,
      thumbnail: gambar || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    };

    let savedPost: Post | null = null;

    if (token) {
      try {
        const url = editId ? `${apiUrl}/posts/${editId}` : `${apiUrl}/posts`;
        const method = editId ? "PUT" : "POST";
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          body: JSON.stringify(postPayload)
        });

        if (res.ok) {
          const item = await res.json();
          savedPost = {
            id: item.id,
            slug: item.slug,
            judul: item.judul,
            ringkasan: item.ringkasan || konten.substring(0, 150) + "...",
            konten: item.konten,
            kategori: kategori,
            gambar: item.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
            tanggal: item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru",
            status: item.status === "Draft" ? "Draft" : "Publish",
            views: item.views || 0
          };
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Gagal menyimpan ke database Laravel:", errData);
          alert("Gagal menyimpan ke database Laravel. Menyimpan secara lokal...");
        }
      } catch (err) {
        console.error("Error saving to database, falling back to local:", err);
        alert("Server Laravel offline. Artikel disimpan secara lokal di browser Anda.");
      }
    }

    // Fallback sync to localStorage
    let updatedPosts: Post[] = [];
    if (editId) {
      updatedPosts = posts.map((p) => {
        if (String(p.id) === editId) {
          return savedPost || {
            ...p,
            judul,
            ringkasan,
            konten,
            kategori,
            gambar: gambar || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
            status,
            slug: newSlug,
          };
        }
        return p;
      });
    } else {
      const fallbackPost: Post = savedPost || {
        id: Date.now(),
        slug: newSlug,
        judul,
        ringkasan,
        konten,
        kategori,
        gambar: gambar || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status,
        views: 0,
      };
      updatedPosts = [fallbackPost, ...posts];
    }

    localStorage.setItem("admin_posts", JSON.stringify(updatedPosts));
    router.push("/admin/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header navigasi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                Menu Kelola Blog
              </span>
              <h1 className="text-2xl font-black text-white">
                {editId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h1>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition"
            >
              Batal
            </Link>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Artikel
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri: Kolom Input Konten (Lebar) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
              {/* Judul */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                  placeholder="Masukkan judul artikel..."
                />
              </div>

              {/* Ringkasan */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  required
                  rows={3}
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm resize-none"
                  placeholder="Ringkasan singkat ini akan muncul di daftar kartu blog..."
                />
              </div>

              {/* Konten Utama */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Konten Lengkap
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => insertFormat("bold")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Tebal (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat("italic")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Miring (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat("heading")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Sub-judul (H3)"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat("list")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Daftar List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat("link")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Tambah Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat("quote")}
                      className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                      title="Kutipan (Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="editor-konten"
                  required
                  rows={12}
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm font-sans"
                  placeholder="Tulis artikelmu di sini... Gunakan tombol toolbar di atas untuk memformat teks."
                />
              </div>
            </div>
          </div>

          {/* Kanan: Sidebar Pengaturan & Gambar (Sempit) */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                Metadata & Status
              </h3>

              {/* Kategori */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                >
                  <option value="Tips">Tips</option>
                  <option value="Panduan">Panduan</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Rekomendasi">Rekomendasi</option>
                </select>
              </div>

              {/* Status Publikasi */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Publish" | "Draft")}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                >
                  <option value="Publish">Publish (Tampil Publik)</option>
                  <option value="Draft">Draft (Simpan Internal)</option>
                </select>
              </div>

              {/* URL Gambar */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Gambar Banner
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                    placeholder="Pake URL atau upload file..."
                  />
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold gap-1.5 h-[46px] shrink-0">
                    {uploading ? (
                      <span className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
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

                {/* Real-time Preview Gambar */}
                {gambar && (
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                    <img
                      src={gambar}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                      Preview Banner
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TulisArtikelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TulisArtikelForm />
    </Suspense>
  );
}
