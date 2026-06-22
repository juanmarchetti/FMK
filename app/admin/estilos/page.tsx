import { getEstilos } from "./actions";
import { EstilosClient } from "./EstilosClient";

export const dynamic = 'force-dynamic';

export default async function EstilosPage() {
  const estilos = await getEstilos();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Administración</p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Gestión de Estilos
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#54585B]">
            Administra el catálogo oficial de estilos de karate para la Federación Madrileña de Karate.
          </p>
        </div>
      </div>

      <EstilosClient initialEstilos={estilos} />
    </div>
  );
}
