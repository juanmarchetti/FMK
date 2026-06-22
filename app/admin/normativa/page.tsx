import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNormativa } from "./actions";
import { NormativaClient } from "./NormativaClient";
import { getParametros } from "./actions_parametros";
import { ParametrosClient } from "./ParametrosClient";

export const dynamic = 'force-dynamic';

export default async function NormativaPage() {
  const normativas = await getNormativa();
  const parametros = await getParametros();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Administración</p>
        <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>Normativa y Requisitos</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#54585B]">Gestión de reglas de tiempo, edad y licencias para grados y danes.</p>
      </div>

      <section className="rounded-lg border border-[#54585B]/20 bg-white">
        <div className="flex flex-col gap-4 border-b border-[#54585B]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle eyebrow="Datos Maestros" title="Reglas por Grado" />
        </div>

        <NormativaClient initialData={normativas} />
      </section>

      <section className="rounded-lg border border-[#54585B]/20 bg-white">
        <div className="flex flex-col gap-4 border-b border-[#54585B]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle eyebrow="Configuración General" title="Parámetros del Sistema (ADM-24)" />
        </div>

        <ParametrosClient initialParametros={parametros} />
      </section>
    </div>
  );
}
