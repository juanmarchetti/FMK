import { CuotaResult } from "../../types";

export interface SituacionAspirante {
  esRepetidorBloqueEspecificoNegro?: boolean;
  esRepetidorOtraFase?: boolean;
  esCampeonEspanaMadrid?: boolean;
  esCampeonMundoEuropa?: boolean;
  fechaUltimoNoApto?: Date;
  fechaTitulo?: Date;
}

/**
 * Calcula exenciones y reducciones de cuota según la normativa.
 */
export function calculateQuota(cuotaBase: number, situacion: SituacionAspirante): CuotaResult {
  const hoy = new Date();
  
  // 1. Exención total: Repetidor Bloque Específico (Cinturón Negro)
  if (situacion.esRepetidorBloqueEspecificoNegro) {
    return {
      cuotaBase,
      reduccion: cuotaBase,
      porcentajeReduccion: 100,
      exenta: true,
      importeFinal: 0,
      motivo: "Exención total: Repetidor de Bloque Específico (Cinturón Negro).",
    };
  }

  // 2. Exención total: Campeón del Mundo o Europa
  if (situacion.esCampeonMundoEuropa) {
    return {
      cuotaBase,
      reduccion: cuotaBase,
      porcentajeReduccion: 100,
      exenta: true,
      importeFinal: 0,
      motivo: "Exención total: Medallista Mundial/Europeo.",
    };
  }

  // 3. Reducción 50%: Repetidor (dentro del año)
  if (situacion.esRepetidorOtraFase && situacion.fechaUltimoNoApto) {
    const unAnioDespues = new Date(situacion.fechaUltimoNoApto);
    unAnioDespues.setFullYear(unAnioDespues.getFullYear() + 1);
    
    if (hoy <= unAnioDespues) {
      return {
        cuotaBase,
        reduccion: cuotaBase * 0.5,
        porcentajeReduccion: 50,
        exenta: false,
        importeFinal: cuotaBase * 0.5,
        motivo: "Reducción 50%: Repetidor dentro de 1 año desde el último examen No Apto.",
      };
    }
  }

  // 4. Reducción 50%: Campeón España/Madrid (dentro del año)
  if (situacion.esCampeonEspanaMadrid && situacion.fechaTitulo) {
    const unAnioDespues = new Date(situacion.fechaTitulo);
    unAnioDespues.setFullYear(unAnioDespues.getFullYear() + 1);
    
    if (hoy <= unAnioDespues) {
      return {
        cuotaBase,
        reduccion: cuotaBase * 0.5,
        porcentajeReduccion: 50,
        exenta: false,
        importeFinal: cuotaBase * 0.5,
        motivo: "Reducción 50%: Campeón de España/Madrid en el último año.",
      };
    }
  }

  // Sin reducciones
  return {
    cuotaBase,
    reduccion: 0,
    porcentajeReduccion: 0,
    exenta: false,
    importeFinal: cuotaBase,
    motivo: "Cuota estándar.",
  };
}
