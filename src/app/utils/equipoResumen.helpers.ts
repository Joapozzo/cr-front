// Helpers para el resumen del equipo

import { PartidoEquipo } from '@/app/types/partido';
import { PartidoResumido } from '@/app/types/equipoResumen';

/**
 * Convierte un PartidoEquipo a PartidoResumido
 * Determina el resultado basado en los goles y si el equipo es local o visita
 */
export const convertirPartidoAResumido = (
  partido: PartidoEquipo,
  idEquipoActual: number
): PartidoResumido | null => {
  // Verificar que el partido esté finalizado
  if (partido.estado !== 'F' || partido.goles_local === null || partido.goles_visita === null) {
    return null;
  }

  const esLocal = partido.id_equipolocal === idEquipoActual;
  const equipoRival = esLocal ? partido.equipoVisita : partido.equipoLocal;
  const golesEquipo = esLocal ? partido.goles_local : partido.goles_visita;
  const golesRival = esLocal ? partido.goles_visita : partido.goles_local;

  // Determinar resultado
  let resultado: 'victoria' | 'derrota' | 'empate';
  if (golesEquipo > golesRival) {
    resultado = 'victoria';
  } else if (golesEquipo < golesRival) {
    resultado = 'derrota';
  } else {
    resultado = 'empate';
  }

  return {
    id_partido: partido.id_partido,
    id_equipo_rival: equipoRival.id_equipo || 0,
    nombre_equipo_rival: equipoRival.nombre || 'Equipo Rival',
    img_equipo_rival: equipoRival.img || null,
    goles_equipo: golesEquipo,
    goles_rival: golesRival,
    es_local: esLocal,
    resultado
  };
};

/**
 * Ordena los partidos resumidos por fecha (más reciente primero)
 */
export const ordenarPartidosResumidos = (
  partidos: PartidoResumido[]
): PartidoResumido[] => {
  return [...partidos].sort((a, b) => b.id_partido - a.id_partido);
};

