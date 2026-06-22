"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";

const navItems = [
  { href: "/aspirante", label: "Panel Principal", icon: "dashboard" },
  { href: "/aspirante/solicitud", label: "Mi Solicitud", icon: "edit_note" },
  { href: "/aspirante/resultado", label: "Mis Resultados", icon: "emoji_events" },
  { href: "/aspirante/catalogo", label: "Catálogo", icon: "menu_book" },
];

export default function AspiranteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/aspirante" ? pathname === "/aspirante" : pathname.startsWith(href);
  const currentNav = navItems.find((n) => isActive(n.href));

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-[272px] min-h-screen border-r border-[#54585B]/20 bg-[#F3F4F5] p-5 shrink-0">
        <div className="mb-8 pb-5 border-b border-[#54585B]/15">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7A1F2A]">Federación Madrileña</p>
          <h1 className="mt-1 text-2xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            FMK Grados
          </h1>
          <p className="mt-1.5 text-xs text-[#54585B]">Panel de Aspirante</p>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 items-center gap-3 rounded px-3 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-[#7A1F2A] text-white"
                  : "text-[#54585B] hover:bg-white hover:text-[#191C1D]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* User card */}
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-white border border-[#54585B]/20 p-3">
          <div className="h-8 w-8 rounded-full bg-[#54585B] flex items-center justify-center text-white text-xs font-bold shrink-0">EM</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#191C1D] truncate">Elena Martínez</p>
            <p className="text-xs text-[#54585B] truncate">aspirante@fmk.es</p>
          </div>
          <form action={logout} className="ml-auto">
            <button type="submit" aria-label="Cerrar sesión" className="flex items-center">
              <span className="material-symbols-outlined text-[18px] text-[#54585B] hover:text-[#7A1F2A]">logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 flex flex-col w-72 bg-[#F3F4F5] h-full p-5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>FMK Grados</p>
              <button onClick={() => setMobileOpen(false)} className="text-[#54585B]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-11 items-center gap-3 rounded px-3 text-sm font-semibold transition ${
                    isActive(item.href) ? "bg-[#7A1F2A] text-white" : "text-[#54585B] hover:bg-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[#54585B]/20 bg-white/95 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">FMK Grados</p>
            <p className="text-base font-bold text-[#191C1D]">{currentNav?.label ?? "Panel Principal"}</p>
          </div>
          <button onClick={() => setMobileOpen(true)} className="h-10 w-10 flex items-center justify-center rounded border border-[#54585B]/30 text-[#54585B]" aria-label="Menú">
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
