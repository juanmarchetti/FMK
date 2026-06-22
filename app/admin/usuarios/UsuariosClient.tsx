"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { suspenderUsuario, confirmarSuspension, eliminarUsuario, reactivarUsuario } from "./actions";

export function UsuariosClient({ initialUsers }: { initialUsers: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSuspend(id: string) {
    setLoadingId(id);
    const res = await suspenderUsuario(id);
    setLoadingId(null);
    if (res?.warning) {
      if (confirm(res.warning)) {
        setLoadingId(id);
        await confirmarSuspension(id);
        setLoadingId(null);
      }
    } else if (res?.error) {
      alert(res.error);
    }
  }

  async function handleReactivate(id: string) {
    setLoadingId(id);
    const res = await reactivarUsuario(id);
    setLoadingId(null);
    if (res?.error) alert(res.error);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de eliminar este usuario permanentemente?")) {
      setLoadingId(id);
      const res = await eliminarUsuario(id);
      setLoadingId(null);
      if (res?.error) alert(res.error);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Correo Electrónico</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#54585B]/10">
          {initialUsers.map((u) => (
            <tr key={u.id} className="hover:bg-[#F8F9FA]">
              <td className="px-4 py-3 font-bold text-[#191C1D]">{u.name}</td>
              <td className="px-4 py-3 text-[#54585B]">{u.email}</td>
              <td className="px-4 py-3 font-semibold">{u.role}</td>
              <td className="px-4 py-3">
                <StatusPill status={u.status} className={u.statusClass} />
              </td>
              <td className="px-4 py-3 text-right flex justify-end gap-2 items-center h-full pt-4">
                <Link 
                  href={`/admin/usuarios/editar/${u.id}`}
                  className="text-[#54585B] hover:text-[#7A1F2A] font-semibold text-sm mr-2"
                >
                  Editar
                </Link>
                {u.status === 'Activo' ? (
                  <button 
                    onClick={() => handleSuspend(u.id)}
                    disabled={loadingId === u.id}
                    className="text-[#7A1F2A] hover:text-[#5B0616] font-semibold text-sm"
                  >
                    Suspender
                  </button>
                ) : (
                  <button 
                    onClick={() => handleReactivate(u.id)}
                    disabled={loadingId === u.id}
                    className="text-[#2D6A4F] hover:text-[#1B4332] font-semibold text-sm"
                  >
                    Reactivar
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(u.id)}
                  disabled={loadingId === u.id}
                  className="text-[#54585B] hover:text-[#BA1A1A] font-semibold text-sm ml-2"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-[18px] align-middle">delete</span>
                </button>
              </td>
            </tr>
          ))}
          {initialUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-[#54585B]">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
