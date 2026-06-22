import {
  Grado,
  Solicitud,
  Documento,
  EstadoDocumento,
  ResultadoValidacionDocumental,
} from "../../types";

const BASIC_DOCS = [
  "DNI o Pasaporte",
  "Carnet de Grados (firmado)",
  "Licencias Federativas",
  "Licencia del año en curso",
  "Fotografías (3)",
  "Solicitud oficial con aval",
  "Justificante de pago"
];

const ADVANCED_DOCS = [
  ...BASIC_DOCS,
  "Trabajo escrito (Memoria)"
];

/**
 * Verifica si los documentos adjuntos a una solicitud cumplen los requisitos para el grado.
 */
export function checkDocumentCompleteness(
  solicitud: Solicitud,
  documentos: Documento[]
): ResultadoValidacionDocumental {
  const gradoIndex = Object.values(Grado).indexOf(solicitud.aspirante.gradoActual);
  const grado5Index = Object.values(Grado).indexOf(Grado.Dan4); // If current is 4th Dan, applying for 5th Dan
  
  const isAdvanced = gradoIndex >= grado5Index;
  const requiredDocs = isAdvanced ? ADVANCED_DOCS : BASIC_DOCS;
  
  const faltantes: string[] = [];
  const advertencias: string[] = [];

  // Consider a document "complete" if it exists and is not rejected
  const validDocs = documentos.filter(
    (d) => d.estadoValidacion !== EstadoDocumento.Rechazado && d.estadoValidacion !== EstadoDocumento.Pendiente
  );

  // Map the uploaded doc types (which would match the required strings in a real system)
  const uploadedDocTypes = validDocs.map((d) => d.tipo);

  for (const req of requiredDocs) {
    if (!uploadedDocTypes.includes(req)) {
      faltantes.push(req);
    }
  }

  // Check specific logic like repeating an exam (requires only 2 photos instead of 3, etc.)
  // In a full implementation, we would query the history of the practicante here.

  return {
    completo: faltantes.length === 0,
    faltantes,
    advertencias,
  };
}
