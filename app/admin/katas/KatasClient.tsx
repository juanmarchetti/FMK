"use client";

import { useState } from "react";
import { createKata, updateKata, deleteKata } from "./actions";

export function KatasClient({ initialKatas, estilos }: { initialKatas: any[]; estilos: any[] }) {
  const [katas, setKatas] = useState(initialKatas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [estiloId, setEstiloId] = useState("");
  const [nivel, setNivel] = useState<"básico" | "superior">("básico");
  const [descripcion, setDescripcion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filtros
  const [filtroEstilo, setFiltroEstilo] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await createKata(nombre, estiloId, nivel, descripcion, videoUrl);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setNombre("");
      setEstiloId("");
      setNivel("básico");
      setDescripcion("");
      setVideoUrl("");
      setShowAddForm(false);
      window.location.reload();
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    const res = await updateKata(editingId, nombre, estiloId, nivel, descripcion, videoUrl);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setEditingId(null);
      setNombre("");
      setEstiloId("");
      setNivel("básico");
      setDescripcion("");
      setVideoUrl("");
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este kata?")) return;
    setLoading(true);
    const res = await deleteKata(id);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      window.location.reload();
    }
  }

  function startEdit(kata: any) {
    setEditingId(kata.id);
    setNombre(kata.nombre);
    setEstiloId(kata.estilo_id);
    setNivel(kata.nivel);
    setDescripcion(kata.descripcion || "");
    setVideoUrl(kata.video_url || "");
    setShowAddForm(false);
  }

  // Filtrado de katas
  const filteredKatas = katas.filter((k) => {
    const matchEstilo = filtroEstilo ? k.estilo_id === filtroEstilo : true;
    const matchNivel = filtroNivel ? k.nivel === filtroNivel : true;
    return matchEstilo && matchNivel;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 border border-[#54585B]/20 bg-white rounded-lg">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-xs font-bold text-[#54585B] mb-1">Filtrar por Estilo</label>
            <select
              value={filtroEstilo}
              onChange={(e) => setFiltroEstilo(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
            >
              <option value="">Todos los estilos</option>
              {estilos.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#54585B] mb-1">Filtrar por Nivel</label>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
            >
              <option value="">Todos los niveles</option>
              <option value="básico">Básico</option>
              <option value="superior">Superior</option>
            </select>
          </div>
        </div>

        {!editingId && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="h-10 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white hover:bg-[#5B0616] flex items-center gap-1 self-end"
          >
            Nueva Kata
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-5 border border-[#54585B]/20 bg-white rounded-lg space-y-4">
          <h3 className="font-bold text-[#191C1D]">Agregar Nueva Kata (ADM-16)</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nombre de la Kata *</label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
                placeholder="Ej. Taikyoku Shodan, Bassai Dai"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Estilo *</label>
              <select
                required
                value={estiloId}
                onChange={(e) => setEstiloId(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
              >
                <option value="">Selecciona estilo</option>
                {estilos.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nivel *</label>
              <select
                required
                value={nivel}
                onChange={(e) => setNivel(e.target.value as any)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
              >
                <option value="básico">Básico (Kyu / CN)</option>
                <option value="superior">Superior (Dan)</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Descripción</label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">URL del Video Demostrativo</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
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
              Guardar Kata
            </button>
          </div>
        </form>
      )}

      {editingId && (
        <form onSubmit={handleEdit} className="p-5 border border-[#54585B]/20 bg-[#F3F4F5] rounded-lg space-y-4">
          <h3 className="font-bold text-[#191C1D]">Editar Kata (ADM-18)</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nombre de la Kata *</label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Estilo *</label>
              <select
                required
                value={estiloId}
                onChange={(e) => setEstiloId(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              >
                <option value="">Selecciona estilo</option>
                {estilos.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Nivel *</label>
              <select
                required
                value={nivel}
                onChange={(e) => setNivel(e.target.value as any)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              >
                <option value="básico">Básico (Kyu / CN)</option>
                <option value="superior">Superior (Dan)</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">Descripción</label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191C1D] mb-1">URL del Video Demostrativo</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
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
              Actualizar Kata
            </button>
          </div>
        </form>
      )}

      {/* Listado de Katas (ADM-17) */}
      <div className="overflow-x-auto rounded-lg border border-[#54585B]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Estilo</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#54585B]/10">
            {filteredKatas.map((kata) => (
              <tr key={kata.id} className="hover:bg-[#F8F9FA]">
                <td className="px-4 py-3 font-bold text-[#191C1D]">{kata.nombre}</td>
                <td className="px-4 py-3 text-[#54585B]">{kata.estilos?.nombre}</td>
                <td className="px-4 py-3 text-[#54585B] capitalize">{kata.nivel}</td>
                <td className="px-4 py-3 text-[#54585B] truncate max-w-[200px]" title={kata.descripcion}>
                  {kata.descripcion || "Sin descripción"}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => startEdit(kata)}
                    className="text-[#7A1F2A] hover:text-[#5B0616] font-semibold text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(kata.id)}
                    className="text-[#54585B] hover:text-[#BA1A1A] font-semibold text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredKatas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#54585B]">
                  No se encontraron katas con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
