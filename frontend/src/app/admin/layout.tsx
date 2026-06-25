import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel – Batur Ngelamang",
  description: "Dashboard admin untuk mengelola konten Batur Ngelamang Open Trip",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin routes get their own blank layout — no global Navbar/Footer
  return <>{children}</>;
}
