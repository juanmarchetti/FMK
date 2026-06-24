import {
  Grado,
  Rol,
  EstadoSolicitud,
  EstadoDocumento,
  ViaBloque,
  Practicante,
  Licencia,
  Convocatoria,
  Solicitud,
  Documento,
  ReglaNormativa,
} from "../../types";

export const REGLAS_NORMATIVAS: ReglaNormativa[] = [
  { grado: Grado.CinturonNegro, edadMinima: 12, permanenciaMinimaMeses: 12, licenciasConsecutivasMin: 4, licenciasAlternasMin: 5 },
  { grado: Grado.Dan1, edadMinima: 16, permanenciaMinimaMeses: 12, licenciasConsecutivasMin: 3, licenciasAlternasMin: 4 },
  { grado: Grado.Dan2, edadMinima: 18, permanenciaMinimaMeses: 24, licenciasConsecutivasMin: 2, licenciasAlternasMin: 3 },
  { grado: Grado.Dan3, edadMinima: 21, permanenciaMinimaMeses: 36, licenciasConsecutivasMin: 3, licenciasAlternasMin: 4 },
  { grado: Grado.Dan4, edadMinima: 25, permanenciaMinimaMeses: 48, licenciasConsecutivasMin: 4, licenciasAlternasMin: 5 },
  { grado: Grado.Dan5, edadMinima: 30, permanenciaMinimaMeses: 60, licenciasConsecutivasMin: 5, licenciasAlternasMin: 6 },
  { grado: Grado.Dan6, edadMinima: 36, permanenciaMinimaMeses: 72, licenciasConsecutivasMin: 6, licenciasAlternasMin: 7 },
  { grado: Grado.Dan7, edadMinima: 43, permanenciaMinimaMeses: 84, licenciasConsecutivasMin: 7, licenciasAlternasMin: 8 },
  { grado: Grado.Dan8, edadMinima: 51, permanenciaMinimaMeses: 96, licenciasConsecutivasMin: 8, licenciasAlternasMin: 9 },
  { grado: Grado.Dan9, edadMinima: 60, permanenciaMinimaMeses: 108, licenciasConsecutivasMin: 9, licenciasAlternasMin: 10 },
  { grado: Grado.Dan10, edadMinima: 70, permanenciaMinimaMeses: 120, licenciasConsecutivasMin: 10, licenciasAlternasMin: 11 },
];

export const PRACTICANTES: Practicante[] = [
  {
    id: "p1",
    nombre: "Antonio",
    apellidos: "García Martínez",
    dni: "12345678A",
    fechaNacimiento: new Date("1994-03-15"),
    clubNombre: "Karate Madrid-Sur",
    estiloNombre: "Shotokan",
    gradoActual: Grado.Dan1,
    fechaGradoActual: new Date("2024-06-20"),
    rol: Rol.Aspirante,
    estado: "aspirante",
  },
  {
    id: "p2",
    nombre: "Elena",
    apellidos: "Martínez Gómez",
    dni: "87654321B",
    fechaNacimiento: new Date("2000-11-05"),
    clubNombre: "Shotokan Alcalá",
    estiloNombre: "Shotokan",
    gradoActual: Grado.CinturonMarron,
    fechaGradoActual: new Date("2023-01-10"),
    rol: Rol.Aspirante,
    estado: "aspirante",
  },
  {
    id: "p3",
    nombre: "Carlos",
    apellidos: "Ruiz Fernández",
    dni: "11223344C",
    fechaNacimiento: new Date("1998-05-20"),
    clubNombre: "Goju Ryu Vallecas",
    estiloNombre: "Goju Ryu",
    gradoActual: Grado.Dan1,
    fechaGradoActual: new Date("2024-03-15"),
    rol: Rol.Aspirante,
    estado: "estudiante",
  },
];

export const LICENCIAS: Licencia[] = [
  { id: "l1", practicanteId: "p3", anio: 2024, tipo: "consecutiva", estado: "activa" },
  { id: "l2", practicanteId: "p3", anio: 2025, tipo: "consecutiva", estado: "activa" },
  { id: "l3", practicanteId: "p3", anio: 2026, tipo: "consecutiva", estado: "activa" },
];

export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: "c1",
    grados: [Grado.Dan1, Grado.Dan2, Grado.Dan3, Grado.Dan4],
    fechaExamen: new Date("2026-10-15"),
    sede: "Polideportivo Magariños",
    fechaLimiteInscripcion: new Date("2026-09-10"),
    cuota: 85,
    viasHabilitadas: [ViaBloque.Kumite, ViaBloque.Campeonatos, ViaBloque.Tecnica],
    estado: "abierta",
  },
  {
    id: "c2",
    grados: [Grado.Dan5, Grado.Dan6, Grado.Dan7],
    fechaExamen: new Date("2026-11-05"),
    sede: "Sede Federación",
    fechaLimiteInscripcion: new Date("2026-10-01"),
    cuota: 120,
    viasHabilitadas: [ViaBloque.Kumite, ViaBloque.Campeonatos, ViaBloque.Tecnica],
    estado: "abierta",
  },
];

export const SOLICITUDES: Solicitud[] = [
  {
    id: "s1",
    aspirante: PRACTICANTES[0],
    convocatoria: CONVOCATORIAS[0],
    viaElegida: ViaBloque.Kumite,
    estadoPago: "pagado",
    estado: EstadoSolicitud.EnRevision,
    documentos: [
      { id: "d1", tipo: "DNI", url: "#", estadoValidacion: EstadoDocumento.Validado },
    ],
    fechaCreacion: new Date("2026-09-01"),
  },
];

export const KATAS_POR_ESTILO: Record<string, { basicos: string[]; superiores: string[] }> = {
  Shotokan: {
    basicos: ["Taikyoku Shodan", "Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"],
    superiores: ["Tekki Shodan", "Bassai Dai", "Kanku Dai", "Jion", "Empi", "Hangetsu", "Tekki Nidan", "Bassai Sho", "Kanku Sho", "Sochin", "Nijushiho", "Gojushiho Dai", "Gojushiho Sho", "Unsu", "Meikyo"],
  },
  "Goju Ryu": {
    basicos: ["Gekisai Dai Ichi", "Gekisai Dai Ni", "Saifa"],
    superiores: ["Seiyunchin", "Shisochin", "Sanseiru", "Seipai", "Kururunfa", "Seisan", "Suparinpei", "Tensho", "Sanchin"],
  },
};

export const TEMARIO = [
  { grado: "1º Dan", pregunta: "¿Cuáles son los principios del Dojo Kun?", respuesta: "Hitotsu, Jinkaku kansei ni tsutomuru koto (Buscar la perfección del carácter). Hitotsu, Makoto no michi o mamoru koto (Ser fiel). Hitotsu, Doryoku no seishin o yashinau koto (Esforzarse). Hitotsu, Reigi o omonzuru koto (Respetar a los demás). Hitotsu, Kekki no yuu o imashimuru koto (Reprimir la violencia)." },
  { grado: "1º Dan", pregunta: "¿Qué significa Karate-Do?", respuesta: "El camino de la mano vacía (kara = vacío, te = mano, do = camino)." },
  { grado: "1º Dan", pregunta: "¿Cuáles son las posiciones (dachi) fundamentales?", respuesta: "Zenkutsu dachi, Kokutsu dachi, Kiba dachi, Neko ashi dachi, Sanchin dachi, Fudo dachi, Shiko dachi." },
  { grado: "2º Dan", pregunta: "¿Qué diferencias existen entre Kumite, Bunkai y Oyo Waza?", respuesta: "Kumite es combate libre o reglado. Bunkai es la aplicación práctica de las técnicas de un kata. Oyo Waza son aplicaciones técnicas más libres derivadas de las situaciones de un kata." },
  { grado: "2º Dan", pregunta: "¿Cuántos katas básicos y superiores se exigen para 2º Dan?", respuesta: "5 katas básicos y 5 superiores, siendo uno de los superiores presentado como kata voluntario." },
];

export const ESTILOS = [
  "Shotokan", "Goju Ryu", "Shito Ryu", "Wado Ryu", "Kyokushin Kai", "Shoto Kai", "Gensei Ryu", "Renbu Kai", "Uechi Ryu"
];
