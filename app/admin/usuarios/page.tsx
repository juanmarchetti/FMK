import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getUsuarios, suspenderUsuario, confirmarSuspension, eliminarUsuario, reactivarUsuario } from "./actions";
import { UsuariosClient } from "./UsuariosClient";

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const users = await getUsuarios();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 xl:flex-row xl:items-end xl:justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Administración</p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>Gestión de Usuarios</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#54585B]">Listado de cuentas de Director FMK y Aspirantes en el sistema.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/usuarios/nuevo"
            className="h-11 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white transition hover:bg-[#5B0616] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Crear cuenta de usuario
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-[#54585B]/20 bg-white">
        <div className="flex flex-col gap-4 border-b border-[#54585B]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle eyebrow="Directorio" title="Usuarios registrados" />
        </div>

        <UsuariosClient initialUsers={users} />
      </section>
    </div>
  );
}
