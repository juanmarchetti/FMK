import { createClient } from "@/lib/supabase/server"
import { SectionTitle } from "@/components/ui/SectionTitle"

export default async function AuditoriaPage() {
  const supabase = await createClient()
  const { data: logs, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 border-b border-[#54585B]/20 pb-6">
        <SectionTitle title="Auditoría del Sistema" eyebrow="Registro de Operaciones" />
        <p className="mt-2 text-sm text-[#54585B]">Historial de las últimas operaciones críticas realizadas por los administradores.</p>
      </div>

      <div className="rounded-lg border border-[#54585B]/20 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F4F5] text-xs font-bold uppercase text-[#54585B]">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#54585B]/10">
              {logs?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#54585B]">
                    No hay registros de auditoría.
                  </td>
                </tr>
              ) : (
                logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F3F4F5]/50">
                    <td className="px-4 py-3 whitespace-nowrap text-[#54585B]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{log.user_email || log.user_id}</td>
                    <td className="px-4 py-3 font-semibold text-[#191C1D]">{log.action}</td>
                    <td className="px-4 py-3">{log.entity_type} {log.entity_id && `(${log.entity_id.substring(0,8)})`}</td>
                    <td className="px-4 py-3 text-xs text-[#54585B]">
                      <pre className="max-w-xs truncate">{JSON.stringify(log.details)}</pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
