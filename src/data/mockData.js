export const INITIAL_TORNEOS = [
  {
    id: "torneo-1",
    nombre: "Copa de Verano LoL 5v5",
    juego: "League of Legends",
    estado: "ABIERTO", // ABIERTO, EN_CURSO, FINALIZADO
    cuposMaximos: 8,
    inscritos: 6,
    integrantesMinimos: 5,
    cierreInscripcion: "2026-11-01"
  },
  {
    id: "torneo-2",
    nombre: "Valorant Master Arena",
    juego: "Valorant",
    estado: "ABIERTO",
    cuposMaximos: 16,
    inscritos: 16, // Completo
    integrantesMinimos: 5,
    cierreInscripcion: "2026-10-20"
  }
];

export const JUGADORES_SANCIONADOS = ["ToxicRage", "BanHammer99"];