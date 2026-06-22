"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If no error, login() will redirect server-side
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex">
      {/* Left panel — brand */}
      <aside className="hidden lg:flex lg:w-[420px] bg-[#5B0616] flex-col justify-between p-10 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFB3B5] mb-2">
            Federación Madrileña de Karate
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FMK Grados
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Sistema de Gestión de Exámenes de Grado — Normativa 2017
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: "assignment", text: "Gestión completa de solicitudes y expedientes" },
            { icon: "verified", text: "Validación automática de requisitos normativos" },
            { icon: "fact_check", text: "Registro y publicación de resultados" },
            { icon: "trending_up", text: "Seguimiento de progresión por practicante" },
          ].map((f) => (
            <div key={f.icon} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#FFB3B5] text-xl shrink-0 mt-0.5">
                {f.icon}
              </span>
              <p className="text-sm text-white/80">{f.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40">
          Normativa de Grados FMK · Versión 1.1 · 2026
        </p>
      </aside>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A1F2A] mb-1">
              Federación Madrileña de Karate
            </p>
            <h1
              className="text-2xl font-bold text-[#191C1D]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              FMK Grados
            </h1>
          </div>

          <div className="bg-white border border-[#54585B]/20 rounded-lg p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">
                Acceso al sistema
              </p>
              <h2
                className="mt-1 text-xl font-bold text-[#191C1D]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Iniciar sesión
              </h2>
              <p className="mt-1 text-sm text-[#54585B]">
                Introduce tus credenciales federativas
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wide text-[#54585B] mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="usuario@fmk.es"
                  className="w-full h-11 rounded border border-[#54585B]/30 bg-white px-3 text-sm text-[#191C1D] placeholder:text-[#54585B]/50 focus:border-[#7A1F2A] focus:outline-none transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wide text-[#54585B] mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full h-11 rounded border border-[#54585B]/30 bg-white px-3 text-sm text-[#191C1D] placeholder:text-[#54585B]/50 focus:border-[#7A1F2A] focus:outline-none transition"
                />
              </div>

              {error && (
                <div className="rounded border border-[#BA1A1A]/30 bg-[#FFF1F2] px-3 py-2">
                  <p className="text-xs text-[#BA1A1A]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded bg-[#7A1F2A] text-white text-sm font-bold transition hover:bg-[#5B0616] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  "Entrar al sistema"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-[#54585B]">
            ¿Problemas de acceso?{" "}
            <a href="mailto:grados@fmk.es" className="text-[#7A1F2A] font-semibold hover:underline">
              Contacta con la Federación
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
