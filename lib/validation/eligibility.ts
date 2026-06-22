import {
  Grado,
  Practicante,
  Licencia,
  ReglaNormativa,
  ResultadoElegibilidad,
} from "../../types";

/**
 * Calcula la edad en años basándose en una fecha de nacimiento y una fecha objetivo (por defecto hoy).
 */
export function calculateAge(birthDate: Date, targetDate: Date = new Date()): number {
  let age = targetDate.getFullYear() - birthDate.getFullYear();
  const m = targetDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && targetDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calcula la diferencia en meses entre dos fechas.
 */
export function calculateMonthsBetween(startDate: Date, endDate: Date = new Date()): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  );
}

/**
 * Verifica si un practicante es elegible para presentarse a un grado específico.
 */
export function checkEligibility(
  practicante: Practicante,
  targetGrade: Grado,
  licencias: Licencia[],
  reglas: ReglaNormativa[]
): ResultadoElegibilidad {
  const regla = reglas.find((r) => r.grado === targetGrade);
  
  if (!regla) {
    throw new Error(`No se encontraron reglas para el grado ${targetGrade}`);
  }

  const edadActual = calculateAge(practicante.fechaNacimiento);
  const mesesTranscurridos = calculateMonthsBetween(practicante.fechaGradoActual);
  
  // Count licenses after the last grade date
  const anioGradoActual = practicante.fechaGradoActual.getFullYear();
  const validLicencias = licencias.filter(l => l.anio >= anioGradoActual && l.estado === 'activa');
  
  // Simplified logic for consecutive/alternate for this implementation
  // A real implementation would check the sequence of years
  const licenciasAcumuladas = validLicencias.length;

  const cumpleEdad = edadActual >= regla.edadMinima;
  const cumplePermanencia = mesesTranscurridos >= regla.permanenciaMinimaMeses;
  const cumpleLicencias = licenciasAcumuladas >= regla.licenciasConsecutivasMin || licenciasAcumuladas >= regla.licenciasAlternasMin;

  let porcentajeProgreso = 0;
  if (mesesTranscurridos >= regla.permanenciaMinimaMeses) {
    porcentajeProgreso = 100;
  } else {
    porcentajeProgreso = (mesesTranscurridos / regla.permanenciaMinimaMeses) * 100;
  }

  let fechaEstimadaElegibilidad: Date | undefined;
  if (!cumplePermanencia) {
    fechaEstimadaElegibilidad = new Date(practicante.fechaGradoActual);
    fechaEstimadaElegibilidad.setMonth(fechaEstimadaElegibilidad.getMonth() + regla.permanenciaMinimaMeses);
  }

  return {
    esElegible: cumpleEdad && cumplePermanencia && cumpleLicencias,
    cumpleEdad,
    cumplePermanencia,
    cumpleLicencias,
    edadActual,
    edadMinima: regla.edadMinima,
    mesesTranscurridos,
    mesesMinimos: regla.permanenciaMinimaMeses,
    licenciasAcumuladas,
    licenciasMinimas: Math.min(regla.licenciasConsecutivasMin, regla.licenciasAlternasMin), // Show easiest requirement
    porcentajeProgreso,
    fechaEstimadaElegibilidad,
  };
}
