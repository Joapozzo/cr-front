'use client';

import React from 'react';
import { ParticipacionEquipo } from '@/app/types/participacionEquipo';
import { StatsParticipacionSlider } from './StatsParticipacionSlider';
import { BaseCard } from '@/app/components/BaseCard';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';
import { Trophy, Target, Award } from 'lucide-react';
import { StatsResumen } from '@/app/types/equipoResumen';

interface ParticipacionCardProps {
  participacion: ParticipacionEquipo;
  idEquipo: number;
}

const getInstanciaTexto = (instancia?: string) => {
  switch (instancia) {
    case 'campeon':
      return 'Campeón';
    case 'final':
      return 'Final';
    case 'semifinal':
      return 'Semifinal';
    case 'cuartos':
      return 'Cuartos de Final';
    default:
      return null;
  }
};

export const ParticipacionCard: React.FC<ParticipacionCardProps> = ({
  participacion,
  idEquipo
}) => {
  // Ordenar y filtrar tabla de posiciones para mostrar solo top 3 + nuestro equipo
  const posicionesFiltradas = React.useMemo(() => {
    // Ordenar por puntos (descendente), luego por diferencia de goles (descendente)
    const posicionesOrdenadas = [...participacion.posiciones].sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return b.diferencia_goles - a.diferencia_goles;
    });
    
    const top3 = posicionesOrdenadas.slice(0, 3);
    const nuestroEquipo = posicionesOrdenadas.find(p => p.id_equipo === idEquipo);
    
    if (!nuestroEquipo) return top3;
    
    // Si nuestro equipo ya está en el top 3, solo devolver top 3
    if (top3.some(p => p.id_equipo === idEquipo)) {
      return top3;
    }
    
    // Si no está en el top 3, agregar nuestro equipo
    return [...top3, nuestroEquipo];
  }, [participacion.posiciones, idEquipo]);

  // Obtener posiciones ordenadas para calcular la posición real
  const posicionesOrdenadas = React.useMemo(() => {
    return [...participacion.posiciones].sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return b.diferencia_goles - a.diferencia_goles;
    });
  }, [participacion.posiciones]);

  // Preparar stats para el slider
  const statsParaSlider = React.useMemo(() => {
    const stats: StatsResumen[] = [];

    // Goleadores
    const goleadoresFiltrados = (() => {
      const top3 = participacion.goleadores.slice(0, 3);
      const nuestrosJugadores = participacion.goleadores.filter(g => g.equipo.id_equipo === idEquipo);
      const todos = [...top3, ...nuestrosJugadores];
      const unicos = todos.filter((g, index, self) => 
        index === self.findIndex(j => j.id_jugador === g.id_jugador)
      );
      return unicos.slice(0, 4); // Máximo 4 para el card
    })();

    if (goleadoresFiltrados.length > 0) {
      stats.push({
        tipo: 'goleadores',
        titulo: 'Goleadores',
        jugadores: goleadoresFiltrados.map(g => ({
          id_jugador: g.id_jugador,
          nombre: g.nombre,
          apellido: g.apellido,
          img: g.img,
          equipo: g.equipo,
          categoria_edicion: g.categoria_edicion,
          valor: g.valor
        }))
      });
    }

    // Mejores Jugadores (MVPs)
    const mejoresJugadoresFiltrados = (() => {
      const top3 = participacion.mejores_jugadores.slice(0, 3);
      const nuestrosJugadores = participacion.mejores_jugadores.filter(m => m.equipo.id_equipo === idEquipo);
      const todos = [...top3, ...nuestrosJugadores];
      const unicos = todos.filter((m, index, self) => 
        index === self.findIndex(j => j.id_jugador === m.id_jugador)
      );
      return unicos.slice(0, 4);
    })();

    if (mejoresJugadoresFiltrados.length > 0) {
      stats.push({
        tipo: 'mvps',
        titulo: 'Mejores Jugadores',
        jugadores: mejoresJugadoresFiltrados.map(m => ({
          id_jugador: m.id_jugador,
          nombre: m.nombre,
          apellido: m.apellido,
          img: m.img,
          equipo: m.equipo,
          categoria_edicion: m.categoria_edicion,
          valor: m.valor
        }))
      });
    }

    // Máximos Asistentes
    const asistentesFiltrados = (() => {
      const top3 = participacion.maximos_asistentes.slice(0, 3);
      const nuestrosJugadores = participacion.maximos_asistentes.filter(a => a.equipo.id_equipo === idEquipo);
      const todos = [...top3, ...nuestrosJugadores];
      const unicos = todos.filter((a, index, self) => 
        index === self.findIndex(j => j.id_jugador === a.id_jugador)
      );
      return unicos.slice(0, 4);
    })();

    if (asistentesFiltrados.length > 0) {
      stats.push({
        tipo: 'asistencias',
        titulo: 'Máximos Asistentes',
        jugadores: asistentesFiltrados.map(a => ({
          id_jugador: a.id_jugador,
          nombre: a.nombre,
          apellido: a.apellido,
          img: a.img,
          equipo: a.equipo,
          categoria_edicion: a.categoria_edicion,
          valor: a.valor
        }))
      });
    }

    return stats;
  }, [participacion, idEquipo]);

  const instanciaTexto = getInstanciaTexto(participacion.instancia_eliminacion);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header de la participación */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-1 truncate">
              {participacion.nombre_categoria}
            </h3>
            <p className="text-[#737373] text-xs sm:text-sm">
              {participacion.nombre_edicion} • {participacion.temporada}
            </p>
          </div>
          
          {/* Posición final o instancia */}
          <div className="flex-shrink-0 text-right">
            {participacion.posicion_final && (
              <div className="flex items-center gap-2 justify-end mb-1">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-white font-bold text-base sm:text-lg">
                  {participacion.posicion_final}°
                </span>
              </div>
            )}
            {instanciaTexto && (
              <p className="text-[var(--green)] text-xs sm:text-sm font-medium">
                {instanciaTexto}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats generales del equipo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <BaseCard className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--green)]" />
            <h4 className="text-white font-semibold text-xs sm:text-sm">Goles anotados</h4>
          </div>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {participacion.goles_anotados}
          </p>
        </BaseCard>

        <BaseCard className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <h4 className="text-white font-semibold text-xs sm:text-sm">Goles recibidos</h4>
          </div>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {participacion.goles_recibidos}
          </p>
        </BaseCard>

        <BaseCard className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <h4 className="text-white font-semibold text-xs sm:text-sm">Vallas invictas</h4>
          </div>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {participacion.vallas_invictas}
          </p>
        </BaseCard>
      </div>

      {/* Tabla de posiciones (compacta, solo top 3 + nuestro equipo) */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-sm px-1">Tabla de posiciones</h4>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--black-800)] border-b border-[#262626]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    PJ
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    G
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    E
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    P
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    GF
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    GC
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    DIF
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                    PTS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {posicionesFiltradas.map((equipo) => {
                  // Calcular la posición real en la tabla completa ordenada
                  const posicionReal = posicionesOrdenadas.findIndex(p => p.id_equipo === equipo.id_equipo) + 1;
                  const isUserTeam = equipo.id_equipo === idEquipo;
                  
                  return (
                    <tr
                      key={equipo.id_equipo}
                      className={`hover:bg-[var(--black-800)] transition-colors ${
                        isUserTeam ? 'bg-[var(--green)]/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          isUserTeam ? 'text-[var(--green)]' : 'text-white'
                        }`}>
                          {posicionReal}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <EscudoEquipo
                            src={equipo.img_equipo}
                            alt={equipo.nombre_equipo}
                            size={32}
                            className="flex-shrink-0"
                          />
                          <span className={`text-sm font-medium ${
                            isUserTeam ? 'text-[var(--green)]' : 'text-white'
                          }`}>
                            {equipo.nombre_equipo}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.partidos_jugados}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.ganados}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.empatados}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.perdidos}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.goles_favor}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-[#737373]">{equipo.goles_contra}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-medium ${
                          equipo.diferencia_goles > 0 
                            ? 'text-[var(--green)]' 
                            : equipo.diferencia_goles < 0 
                              ? 'text-red-400' 
                              : 'text-[#737373]'
                        }`}>
                          {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-white">{equipo.puntos}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats de jugadores (Goleadores, Mejores Jugadores, Máximos Asistentes) - Slider horizontal */}
      {statsParaSlider.length > 0 && (
        <StatsParticipacionSlider stats={statsParaSlider} />
      )}
    </div>
  );
};

