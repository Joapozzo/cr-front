'use client';

import { Shield, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { BaseCard, CardHeader } from '../BaseCard';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import Link from 'next/link';

export interface IEquipoPosicion {
  posicion: number;
  id_equipo: number;
  nombre_equipo: string;
  img_equipo?: string | null;
  puntos: number;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
  goles_favor: number;
  goles_contra: number;
  diferencia_goles: number;
}

export interface ITablaPosicion {
  id_equipo: number; // ID del equipo del usuario al que pertenece esta tabla
  nombre_equipo: string; // Nombre del equipo del usuario
  categoria_edicion: string; // Ej: "Primera - Apertura 2024"
  posiciones: IEquipoPosicion[]; // 6 equipos (contexto alrededor del equipo del usuario)
}

interface TablaPosicionesHomeProps {
  tablas?: ITablaPosicion[]; // Array de tablas (una por cada equipo del usuario)
  loading?: boolean;
  linkTablaCompleta?: string; // Link para ver tabla completa
}

/**
 * Componente de tabla de posiciones para el home
 * Muestra 6 posiciones de cada equipo del usuario
 * Si tiene múltiples equipos, puede deslizar entre sus tablas
 */
export const TablaPosicionesHome = ({ 
  tablas, 
  loading = false,
  linkTablaCompleta = '/posiciones'
}: TablaPosicionesHomeProps) => {
  const [currentTablaIndex, setCurrentTablaIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  const totalTablas = tablas?.length || 0;
  const tablaActual = tablas?.[currentTablaIndex];

  // Manejar cambio de tabla con dirección de animación
  const handleTablaChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalTablas || newIndex === currentTablaIndex) return;
    
    // Determinar dirección del slide
    if (newIndex > currentTablaIndex) {
      setSlideDirection('left'); // Tabla siguiente: slide desde derecha
    } else {
      setSlideDirection('right'); // Tabla anterior: slide desde izquierda
    }
    
    setCurrentTablaIndex(newIndex);
  };

  // Casos vacíos
  if (!tablas || tablas.length === 0) {
    return (
      <BaseCard>
        <CardHeader 
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de Posiciones"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-[#737373]" />
          </div>
          <p className="text-[#737373] text-sm text-center">
            No hay posiciones disponibles
          </p>
        </div>
      </BaseCard>
    );
  }

  // Loading state
  if (loading) {
    return (
      <BaseCard>
        <CardHeader 
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de Posiciones"
          subtitle="Cargando..."
        />
        <BaseCardTableSkeleton 
          columns={5} 
          rows={6}
          hasAvatar={false}
        />
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader 
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de Posiciones"
          subtitle={tablaActual?.categoria_edicion}
          actions={
            totalTablas > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTablaChange(currentTablaIndex - 1)}
                  disabled={currentTablaIndex === 0}
                  className="p-1 rounded-full bg-[#262626] hover:bg-[var(--green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Tabla anterior"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <span className="text-xs text-[#737373] min-w-[40px] text-center">
                  {currentTablaIndex + 1} / {totalTablas}
                </span>
                <button
                  onClick={() => handleTablaChange(currentTablaIndex + 1)}
                  disabled={currentTablaIndex === totalTablas - 1}
                  className="p-1 rounded-full bg-[#262626] hover:bg-[var(--green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Tabla siguiente"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            )
          }
        />
      </div>

      {/* Tabla con animación */}
      <div className="w-full overflow-hidden">
        <div 
          key={currentTablaIndex}
          className={`w-full overflow-x-auto ${
            slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
          }`}
        >
          <table className="w-full">
          <thead className="border-b border-[#262626]">
            <tr>
              <th className="text-left py-2.5 px-3 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                #
              </th>
              <th className="text-left py-2.5 px-3 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                Equipo
              </th>
              <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                Pts
              </th>
              <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                PJ
              </th>
              <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                DG
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {tablaActual?.posiciones.map((equipo) => {
              const esMiEquipo = equipo.id_equipo === tablaActual.id_equipo;
              
              return (
                <tr
                  key={equipo.id_equipo}
                  className={`transition-colors ${
                    esMiEquipo ? 'bg-[var(--green)]/5' : 'hover:bg-[#0a0a0a]'
                  }`}
                >
                  <td className={`py-3 px-3 text-sm font-bold ${
                    esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                  }`}>
                    {equipo.posicion}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="text-[#737373]" size={14} />
                      </div>
                      <span className={`text-sm font-medium truncate ${
                        esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                      }`}>
                        {equipo.nombre_equipo}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`text-sm font-bold ${
                      esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                    }`}>
                      {equipo.puntos}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 text-sm ${
                    esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                  }`}>
                    {equipo.partidos_jugados}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`text-sm font-medium ${
                      equipo.diferencia_goles > 0
                        ? esMiEquipo ? 'text-[var(--green)]' : 'text-green-400'
                        : equipo.diferencia_goles < 0
                        ? 'text-red-400'
                        : esMiEquipo ? 'text-[var(--green)]' : 'text-gray-400'
                    }`}>
                      {equipo.diferencia_goles > 0 ? '+' : ''}
                      {equipo.diferencia_goles}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Link para ver tabla completa */}
      <div className="border-t border-[#262626] p-4">
        <Link 
          href={linkTablaCompleta}
          className="flex items-center justify-center gap-2 text-sm text-[var(--green)] hover:text-[var(--green)]/80 transition-colors font-medium"
        >
          Ver tabla completa
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* CSS para la animación slide */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </BaseCard>
  );
};

// ============================================
// 🎨 MOCK DATA PARA TESTING
// ============================================

// Tabla para "Los Tigres FC" (id_equipo: 1) - Primera posición
const tablaTigres: ITablaPosicion = {
  id_equipo: 1,
  nombre_equipo: 'Los Tigres FC',
  categoria_edicion: 'Primera - Apertura 2024',
  posiciones: [
    {
      posicion: 1,
      id_equipo: 1,
      nombre_equipo: 'Los Tigres FC',
      img_equipo: null,
      puntos: 38,
      partidos_jugados: 14,
      partidos_ganados: 12,
      partidos_empatados: 2,
      partidos_perdidos: 0,
      goles_favor: 45,
      goles_contra: 12,
      diferencia_goles: 33
    },
    {
      posicion: 2,
      id_equipo: 2,
      nombre_equipo: 'Deportivo Central',
      img_equipo: null,
      puntos: 32,
      partidos_jugados: 14,
      partidos_ganados: 10,
      partidos_empatados: 2,
      partidos_perdidos: 2,
      goles_favor: 38,
      goles_contra: 18,
      diferencia_goles: 20
    },
    {
      posicion: 3,
      id_equipo: 4,
      nombre_equipo: 'Atlético Sur',
      img_equipo: null,
      puntos: 25,
      partidos_jugados: 14,
      partidos_ganados: 8,
      partidos_empatados: 1,
      partidos_perdidos: 5,
      goles_favor: 28,
      goles_contra: 25,
      diferencia_goles: 3
    },
    {
      posicion: 4,
      id_equipo: 5,
      nombre_equipo: 'Club Estrella',
      img_equipo: null,
      puntos: 22,
      partidos_jugados: 14,
      partidos_ganados: 7,
      partidos_empatados: 1,
      partidos_perdidos: 6,
      goles_favor: 25,
      goles_contra: 26,
      diferencia_goles: -1
    },
    {
      posicion: 5,
      id_equipo: 6,
      nombre_equipo: 'Sporting Villa',
      img_equipo: null,
      puntos: 18,
      partidos_jugados: 14,
      partidos_ganados: 5,
      partidos_empatados: 3,
      partidos_perdidos: 6,
      goles_favor: 22,
      goles_contra: 28,
      diferencia_goles: -6
    },
    {
      posicion: 6,
      id_equipo: 7,
      nombre_equipo: 'Unión Barrio',
      img_equipo: null,
      puntos: 15,
      partidos_jugados: 14,
      partidos_ganados: 4,
      partidos_empatados: 3,
      partidos_perdidos: 7,
      goles_favor: 18,
      goles_contra: 30,
      diferencia_goles: -12
    }
  ]
};

// Tabla para "Deportivo Huracán" (id_equipo: 3) - Tercera posición
const tablaHuracan: ITablaPosicion = {
  id_equipo: 3,
  nombre_equipo: 'Deportivo Huracán',
  categoria_edicion: 'Segunda - Clausura 2024',
  posiciones: [
    {
      posicion: 1,
      id_equipo: 10,
      nombre_equipo: 'Real Barrio',
      img_equipo: null,
      puntos: 35,
      partidos_jugados: 14,
      partidos_ganados: 11,
      partidos_empatados: 2,
      partidos_perdidos: 1,
      goles_favor: 42,
      goles_contra: 15,
      diferencia_goles: 27
    },
    {
      posicion: 2,
      id_equipo: 11,
      nombre_equipo: 'Juventud FC',
      img_equipo: null,
      puntos: 30,
      partidos_jugados: 14,
      partidos_ganados: 10,
      partidos_empatados: 0,
      partidos_perdidos: 4,
      goles_favor: 35,
      goles_contra: 20,
      diferencia_goles: 15
    },
    {
      posicion: 3,
      id_equipo: 3,
      nombre_equipo: 'Deportivo Huracán',
      img_equipo: null,
      puntos: 28,
      partidos_jugados: 14,
      partidos_ganados: 9,
      partidos_empatados: 1,
      partidos_perdidos: 4,
      goles_favor: 32,
      goles_contra: 22,
      diferencia_goles: 10
    },
    {
      posicion: 4,
      id_equipo: 12,
      nombre_equipo: 'Argentino FC',
      img_equipo: null,
      puntos: 24,
      partidos_jugados: 14,
      partidos_ganados: 8,
      partidos_empatados: 0,
      partidos_perdidos: 6,
      goles_favor: 28,
      goles_contra: 25,
      diferencia_goles: 3
    },
    {
      posicion: 5,
      id_equipo: 13,
      nombre_equipo: 'FC Norte',
      img_equipo: null,
      puntos: 20,
      partidos_jugados: 14,
      partidos_ganados: 6,
      partidos_empatados: 2,
      partidos_perdidos: 6,
      goles_favor: 24,
      goles_contra: 28,
      diferencia_goles: -4
    },
    {
      posicion: 6,
      id_equipo: 14,
      nombre_equipo: 'Deportivo Este',
      img_equipo: null,
      puntos: 16,
      partidos_jugados: 14,
      partidos_ganados: 5,
      partidos_empatados: 1,
      partidos_perdidos: 8,
      goles_favor: 20,
      goles_contra: 32,
      diferencia_goles: -12
    }
  ]
};

export const mockTablasPosiciones: ITablaPosicion[] = [tablaTigres, tablaHuracan];

