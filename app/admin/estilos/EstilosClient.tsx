"use client";

import { useState } from "react";
import { createEstilo, updateEstilo, deleteEstilo } from "./actions";

export function EstilosClient({ initialEstilos }: { initialEstilos: any[] }) {
  const [estilos, setEstilos] = useState(initialEstilos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await createEstilo(nombre, descripcion);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setNombre("");
      setDescripcion("");
      setShowAddForm(false);
      window.location.reload();
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    const res = await updateEstilo(editingId, nombre, descripcion);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setEditingId(null);
      setNombre("");
      setDescripcion("");
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este estilo? Todos los katas asociados también se eliminarán.")) return;
    setLoading(true);
    const res = await deleteEstilo(id);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      window.location.reload();
    }
  }

  function startEdit(estilo: any) {
    setEditingId(estilo.id);
    setNombre(estilo.nombre);
    setDescripcion(estilo.descripcion || "");
    setShowAddForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#191C1D]">Estilos de Karate Registrados</h2>
        {!editingId && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="h-10 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white transition hover:bg-[#5B0616] flex items-center gap-1"
          >
            Nuevo Estilo
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-5 border border-[#54585B]/20 bg-white rounded-lg space-y-4">
          <h3 className="font-bold text-[#191C1D]">Agregar Nuevo Estilo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nombre del Estilo *</label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
                placeholder="Ej. Shotokan, Goju Ryu"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Descripción</label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
                placeholder="Opcional"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="h-9 rounded border border-[#54585B]/35 px-4 text-xs font-bold text-[#54585B]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 rounded bg-[#7A1F2A] px-4 text-xs font-bold text-white"
            >
              Guardar Estilo
            </button>
          </div>
        </form>
      )}

      {editingId && (
        <form onSubmit={handleEdit} className="p-5 border border-[#54585B]/20 bg-[#F3F4F5] rounded-lg space-y-4">
          <h3 className="font-bold text-[#191C1D]">Editar Estilo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nombre del Estilo *</label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Descripción</label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="h-9 rounded border border-[#54585B]/35 px-4 text-xs font-bold text-[#54585B]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 rounded bg-[#7A1F2A] px-4 text-xs font-bold text-white"
            >
              Actualizar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#54585B]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#54585B]/10">
            {estilos.map((estilo) => (
              <tr key={estilo.id} className="hover:bg-[#F8F9FA]">
                <td className="px-4 py-3 font-bold text-[#191C1D]">{estilo.nombre}</td>
                <td className="px-4 py-3 text-[#54585B]">{estilo.descripcion || "Sin descripción"}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => startEdit(estilo)}
                    className="text-[#7A1F2A] hover:text-[#5B0616] font-semibold text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(estilo.id)}
                    className="text-[#54585B] hover:text-[#BA1A1A] font-semibold text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {estilos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[#54585B]">
                  No hay estilos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
