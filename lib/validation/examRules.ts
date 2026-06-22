import { Grado, ViaBloque } from "../../types";

export interface EstructuraExamen {
  bloqueComun: string[];
  bloqueEspecifico?: string[];
  katasMinimos: {
    basicos: number;
    superiores: number;
  };
  notasPorGrado: string[];
}

/**
 * Devuelve la estructura del examen según el grado y la vía.
 */
export function getExamStructure(grado: Grado, via?: ViaBloque): EstructuraExamen {
  const isCinturonNegro = grado === Grado.CinturonNegro;
  
  // Base rules that apply to most exams up to 3rd Dan
  const estructura: EstructuraExamen = {
    bloqueComun: ["Kihon", "Kata (Ejecución y Bunkai)"],
    katasMinimos: { basicos: 5, superiores: 0 },
    notasPorGrado: ["Se requiere calificación de APTO en ambos bloques para obtener el grado."],
  };

  // Adjust for higher grades
  if (grado === Grado.Dan2) {
    estructura.katasMinimos.superiores = 5; // 1 de libre elección + 4 que puede pedir el tribunal
  } else if (grado === Grado.Dan3) {
    estructura.katasMinimos.superiores = 8;
  } else if (grado === Grado.Dan4) {
    estructura.bloqueComun.push("Coloquio");
  } else if (grado === Grado.Dan5 || grado === Grado.Dan6) {
    estructura.bloqueComun = ["Trabajo escrito (Memoria)", "Defensa del trabajo", "Ejecución técnica libre (Kata/Oyo Waza)"];
    estructura.notasPorGrado.push("Se requiere 80% de votos favorables del Tribunal.");
  }

  // Adjust for Specific Block via
  if (via) {
    switch (via) {
      case ViaBloque.Kumite:
        estructura.bloqueEspecifico = isCinturonNegro 
          ? ["Kihon Ippon Kumite", "Jyu Ippon Kumite"] 
          : ["Jyu Kumite (Combate Libre)"];
        break;
      case ViaBloque.Campeonatos:
        estructura.bloqueEspecifico = ["Exención por puntuación competitiva (>10 pts)"];
        estructura.notasPorGrado.push("Debe haber realizado al menos un encuentro de competición en la temporada.");
        break;
      case ViaBloque.Tecnica:
        estructura.bloqueEspecifico = ["Bunkai Kumite", "Oyo Waza", "Jyu Embu"];
        break;
    }
  }

  return estructura;
}

/**
 * Verifica si un aspirante puede repetir examen basándose en la fecha de su último No Apto.
 */
export function checkPlazoRepeticion(fechaUltimoNoApto: Date): { puedeRepetir: boolean, fechaDisponible: Date, diasRestantes: number } {
  const hoy = new Date();
  
  const fechaDisponible = new Date(fechaUltimoNoApto);
  fechaDisponible.setMonth(fechaDisponible.getMonth() + 3); // 3 meses de plazo mínimo
  
  const diffTime = fechaDisponible.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    puedeRepetir: hoy >= fechaDisponible,
    fechaDisponible,
    diasRestantes: diasRestantes > 0 ? diasRestantes : 0,
  };
}

/**
 * La vía técnica NO está disponible para examen de Cinturón Negro.
 */
export function isTecnicaDisponible(grado: Grado): boolean {
  return grado !== Grado.CinturonNegro;
}

/**
 * Trabajos escritos son obligatorios a partir de 5º Dan.
 */
export function requiresTrabajoEscrito(grado: Grado): boolean {
  const gradoIndex = Object.values(Grado).indexOf(grado);
  const grado5Index = Object.values(Grado).indexOf(Grado.Dan5);
  return gradoIndex >= grado5Index;
}

/**
 * Obtiene los días límite de cierre de inscripción desde la base de datos (ADM-24).
 * Si no está disponible en base de datos o falla, usa el valor por defecto de 35 días.
 */
export async function getDiasCierreInscripcion(): Promise<number> {
  try {
    const { createAdminClient } = require("../supabase/server");
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("parametros_sistema")
      .select("valor")
      .eq("clave", "dias_cierre_inscripcion")
      .single();
    
    if (error || !data) return 35;
    return parseInt(data.valor);
  } catch (e) {
    return 35; // Fallback
  }
}

