import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 xl:flex-row xl:items-end xl:justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">
            Federación Madrileña de Karate
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Panel de Administración (Gestión Técnica)
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#54585B]">
            Control de cuentas de acceso y configuración de las normativas del sistema.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/usuarios/nuevo"
            className="h-11 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white transition hover:bg-[#5B0616] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Nuevo Usuario
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-[#54585B]/20 bg-white p-6">
          <SectionTitle title="Gestión de Cuentas" eyebrow="Módulo de Seguridad" />
          <p className="mt-3 text-sm text-[#54585B]">
            Crea, edita o suspende cuentas de Directores FMK y Aspirantes. Únicamente el Administrador tiene autorización para crear perfiles en el sistema.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/usuarios"
              className="inline-flex h-10 items-center justify-center rounded border border-[#54585B]/30 px-4 text-sm font-bold text-[#54585B] hover:bg-[#F3F4F5] transition"
            >
              Ver directorio de usuarios
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-[#54585B]/20 bg-white p-6">
          <SectionTitle title="Configuración Normativa" eyebrow="Catálogos y Reglas" />
          <p className="mt-3 text-sm text-[#54585B]">
            Ajusta las edades mínimas, tiempos de permanencia, catálogo de grados y preguntas del temario específico según la Normativa de Grados vigente.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/normativa"
              className="inline-flex h-10 items-center justify-center rounded border border-[#54585B]/30 px-4 text-sm font-bold text-[#54585B] hover:bg-[#F3F4F5] transition"
            >
              Gestionar normativa
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
