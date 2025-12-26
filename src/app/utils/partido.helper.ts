import { EstadoPartido, Partido, PartidoCompleto } from "../types/partido";

export const getEstadoInfo = (estado: EstadoPartido) => {
    switch (estado) {
        case 'P':
            return { text: 'PROGRAMADO', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        case 'C1':
        case 'E':
        case 'C2':
            return { text: 'EN VIVO', color: 'text-green-400', bg: 'bg-green-400/10 animate-pulse' };
        case 'T':
        case 'F':
            return { text: 'FINALIZADO', color: 'text-white', bg: 'bg-[var(--green)]/10' };
        case 'S':
            return { text: 'SUSPENDIDO', color: 'text-red-400', bg: 'bg-red-400/10' };
        case 'A':
            return { text: 'APLAZADO', color: 'text-orange-400', bg: 'bg-orange-400/10' };
        default:
            return { text: 'PROGRAMADO', color: 'text-[#525252]', bg: 'bg-[#262626]/50' };
    }
};

export const formatearFecha = (dia: string) => {
    const fecha = new Date(dia);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
};

export const formatearHora = (hora: string) => {
    return hora.substring(0, 5);
};

export const mostrarResultado = (estado: EstadoPartido): boolean => {
    // Estados que NO deben mostrar resultado
    const estadosSinResultado: EstadoPartido[] = ['P', 'A'];
    
    return !estadosSinResultado.includes(estado);
};

export const deberMostrarResultado = (estado: EstadoPartido): boolean => {
    // Estados que SÍ deben mostrar resultado
    const estadosConResultado: EstadoPartido[] = ['C1', 'E', 'C2', 'T', 'F', 'S'];
    
    return estadosConResultado.includes(estado);
};

export const getEstadoConfig = (estado: EstadoPartido) => {
    switch (estado) {
      case 'P': // Programado
        return { showCancha: true, showScore: false, showLive: false };
      case 'C1': // Primer tiempo
      case 'E': // Entretiempo
      case 'C2': // Segundo tiempo
        return { showCancha: false, showScore: true, showLive: true };
      case 'T': // Terminado
      case 'F': // Finalizado
        return { showCancha: false, showScore: true, showLive: false };
      case 'S': // Suspendido
      case 'A': // Anulado
        return { showCancha: false, showScore: false, showLive: false };
      default:
        return { showCancha: true, showScore: false, showLive: false };
    }
  };
  
  // Helper function to convert PartidoCompleto to Partido
export function convertPartidoCompletoToPartido(partidoCompleto: PartidoCompleto): Partido {
    return {
        id_partido: partidoCompleto.id_partido,
        id_equipolocal: partidoCompleto.equipoLocal?.id_equipo || 0,
        id_equipovisita: partidoCompleto.equipoVisita?.id_equipo || 0,
        jornada: partidoCompleto.jornada,
        dia: partidoCompleto.dia || '',
        hora: partidoCompleto.hora || '',
        goles_local: partidoCompleto.goles_local,
        goles_visita: partidoCompleto.goles_visita,
        pen_local: partidoCompleto.pen_local,
        pen_visita: partidoCompleto.pen_visita,
        cancha: partidoCompleto.cancha || 0,
        arbitro: partidoCompleto.arbitro,
        estado: partidoCompleto.estado as Partido['estado'],
        id_categoria_edicion: partidoCompleto.id_categoria_edicion,
        equipoLocal: {
            id_equipo: partidoCompleto.equipoLocal?.id_equipo,
            nombre: partidoCompleto.equipoLocal?.nombre || '',
            img: partidoCompleto.equipoLocal?.img || null,
        },
        equipoVisita: {
            id_equipo: partidoCompleto.equipoVisita?.id_equipo,
            nombre: partidoCompleto.equipoVisita?.nombre || '',
            img: partidoCompleto.equipoVisita?.img || null,
        },
        nombre_categoria_completo: partidoCompleto.categoriaEdicion?.categoria?.nombreCategoria?.nombre_categoria || null,
    };
}