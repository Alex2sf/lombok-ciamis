"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { getBlogPosts, BlogPost } from "../data/blogData";

const CATEGORIES = ["Semua", "Tips", "Panduan", "Kuliner", "Rekomendasi"] as const;

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("Semua");

  useEffect(() => {
    getBlogPosts().then((data) => setPosts(data));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "Semua" || post.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      {/* Hero header */}
      <header className="relative bg-slate-900 pt-36 pb-20 text-white overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560"
            alt="Blog Header"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full mb-3 uppercase tracking-widest">
            Kabar Traveler
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Travel Blog & Catatan Perjalanan
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
            Temukan tips packing, kuliner wajib coba, sampai panduan keselamatan open trip dari tim kami di lapangan.
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${
                    selectedCat === cat
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
            />
            <svg
              className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Blog Post List */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-3">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition flex items-center gap-1.5"
                  >
                    Baca Selengkapnya
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <span className="text-4xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Artikel Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm">
              Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        )}
      </main>

      {/* Mini Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs">
          © 2026 Batur Ngelamang Open Trip. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>
    </div>
  );
}
