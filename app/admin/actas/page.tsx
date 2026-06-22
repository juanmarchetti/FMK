import { getConvocatoriasFinalizadas } from "./actions";
import { ActasClient } from "./ActasClient";

export const dynamic = 'force-dynamic';

export default async function ActasPage() {
  const convocatorias = await getConvocatoriasFinalizadas();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Administración</p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Anulación de Actas Oficiales
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#54585B]">
            Módulo crítico que permite a los Administradores anular actas de examen ya finalizadas y revertir los expedientes asociados por incidencias documentadas.
          </p>
        </div>
      </div>

      <ActasClient initialConvocatorias={convocatorias} />
    </div>
  );
}
