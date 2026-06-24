"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getBlogPosts, BlogPost } from "../../data/blogData";

const WA_PHONE = "6281234567890";
const WA_MSG = "Halo! Saya habis baca artikel di blog travel agent Anda dan tertarik mau tanya jadwal open trip terdekat.";
const WA_URL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MSG)}`;

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((data) => {
      const found = data.find((p) => p.slug === resolvedParams.slug);
      setPost(found || null);
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-28">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </main>
        <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 flex-shrink-0 text-center text-xs">
          © 2026 LombokWander Open Trip.
        </footer>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  // Helper to parse bold, italic, links, and quotes inside markdown
  const parseInlineMarkdown = (text: string) => {
    // Escape HTML to prevent basic XSS
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-extrabold text-slate-900'>$1</strong>");

    // Italic (*text*)
    html = html.replace(/\*(.*?)\*/g, "<em class='italic text-slate-800'>$1</em>");

    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline font-semibold'>$1</a>");

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Parse markdown-like heading and list items inside post content
  const renderParagraphs = (text: string) => {
    return text.split("\n\n").map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Render headings
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={i} className="text-xl sm:text-2xl font-black text-slate-950 mt-8 mb-4 tracking-tight leading-snug">
            {parseInlineMarkdown(trimmed.replace("###", "").trim())}
          </h3>
        );
      }

      // Render blockquotes
      if (trimmed.startsWith(">")) {
        return (
          <blockquote key={i} className="border-l-4 border-teal-500 bg-teal-50/40 px-5 py-4 my-6 rounded-r-xl text-slate-800 italic leading-relaxed text-base">
            {parseInlineMarkdown(trimmed.replace(/^>\s*/, "").trim())}
          </blockquote>
        );
      }

      // Render bullet list
      if (trimmed.startsWith("-")) {
        return (
          <ul key={i} className="list-disc pl-6 mb-6 text-slate-700 space-y-2.5 text-base sm:text-lg">
            {trimmed.split("\n").map((line, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(line.replace(/^-\s*/, "").trim())}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={i} className="text-slate-700 leading-relaxed mb-6 text-base sm:text-lg">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition mb-8"
          >
            ← Kembali ke Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <span className="inline-block px-3.5 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full mb-4 uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 border-y border-slate-200/80 py-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author}</p>
                <p className="text-xs text-slate-400 font-medium">
                  Dipublikasikan pada {post.date} · {post.readTime}
                </p>
              </div>
            </div>
          </header>

          {/* Banner Image */}
          <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-200 shadow-sm mb-10">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <article className="prose prose-slate max-w-none text-base sm:text-lg">
            {renderParagraphs(post.content)}
          </article>

          {/* Call to Action WhatsApp Widget */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-xl shadow-blue-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">Tertarik Liburan Bareng Kita?</h3>
              <p className="text-blue-100 text-sm max-w-md">
                Tanya jadwal deket, konsultasi rute, atau booking slot trip lu langsung via WhatsApp sekarang.
              </p>
            </div>
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-white text-slate-900 font-extrabold rounded-2xl text-base shadow-md hover:bg-slate-50 transition-colors flex items-center gap-2.5 flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat Tanya Jadwal
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs">
          © 2026 LombokWander Open Trip. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>
    </div>
  );
}
