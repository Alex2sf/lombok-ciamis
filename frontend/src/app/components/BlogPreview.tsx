"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPosts, BlogPost } from "../data/blogData";

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogPosts().then((data) => setPosts(data));
  }, []);

  // Ambil 3 artikel teratas
  const recentPosts = posts.slice(0, 3);

  return (
    <section id="blog-preview" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full mb-3 tracking-widest uppercase">
              Catatan Perjalanan
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Tips & Panduan Wisata Terbaru
            </h2>
            <p className="text-slate-500 mt-2 text-base">
              Biar liburan lu makin asyik dan terencana, baca dulu tips & rekomendasi dari tim kami di lapangan.
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition text-sm group"
          >
            Lihat Semua Artikel
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
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
      </div>
    </section>
  );
}
