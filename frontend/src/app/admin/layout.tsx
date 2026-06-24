import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel – LombokWander",
  description: "Dashboard admin untuk mengelola konten LombokWander Open Trip",
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
