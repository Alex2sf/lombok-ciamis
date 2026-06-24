"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect jika sudah login
    const token = localStorage.getItem("admin_token");
    if (token) router.replace("/admin/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ── Integrasi Laravel Sanctum ────────────────────────────
      // const res = await fetch("http://localhost:8000/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Accept: "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) {
      //   const data = await res.json();
      //   throw new Error(data.message || "Kredensial tidak valid.");
      // }
      // const data = await res.json();
      // localStorage.setItem("admin_token", data.token);
      // localStorage.setItem("admin_user", JSON.stringify(data.user));
      // router.push("/admin/dashboard");
      // ────────────────────────────────────────────────────────

      // MOCK – hapus blok ini saat backend sudah siap
      await new Promise((r) => setTimeout(r, 1500));
      if (email === "admin@lombokwander.id" && password === "admin123") {
        localStorage.setItem("admin_token", "mock_token_12345");
        localStorage.setItem(
          "admin_user",
          JSON.stringify({ name: "Admin LombokWander", email })
        );
        router.push("/admin/dashboard");
      } else {
        throw new Error("Email atau password salah.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">
      {/* ── Kiri: Panel Branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-start justify-between p-16">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1920"
            alt="Lombok"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/70 to-teal-900/60" />
        </div>

        <div className="relative z-10 text-white">
          <div className="text-2xl font-black bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent tracking-tighter">
            LombokWander.
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-400/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-bold mb-6 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            Panel Admin
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Kelola kontenmu<br />dengan mudah &amp; cepat.
          </h2>
          <p className="text-slate-400 max-w-xs leading-relaxed">
            Tambah artikel blog, update destinasi, dan pantau performa website Open Trip Lombok dari satu dasbor.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "3", label: "Artikel Blog" },
              { value: "12", label: "Destinasi" },
              { value: "5K+", label: "Peserta" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-teal-300">{s.value}</div>
                <div className="text-xs text-white/50 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-sm">
          © 2026 LombokWander Open Trip
        </div>
      </div>

      {/* ── Kanan: Form Login ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative">
        {/* Blobs */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="text-2xl font-black bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent tracking-tighter">
              LombokWander.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-1">Selamat datang kembali</h1>
              <p className="text-slate-400 text-sm">Masukkan kredensial untuk mengakses dashboard.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                    placeholder="admin@lombokwander.id"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none text-sm"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400 text-center">
              Demo: <code className="font-mono">admin@lombokwander.id</code> / <code className="font-mono">admin123</code>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-slate-500 hover:text-slate-300 transition text-sm">
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
