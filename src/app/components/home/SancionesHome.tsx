'use client';

import { AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, User } from 'lucide-react';
import { useState } from 'react';
import { BaseCard, CardHeader } from '../BaseCard';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import Link from 'next/link';

interface ISancion {
  id: number;
  id_jugador: number;
  nombre_jugador: string;
  apellido_jugador: string;
  foto_jugador?: string | null;
  id_equipo: number;
  nombre_equipo: string;
  categoria_edicion: string;
  articulo: string;
  fechas_cumplidas: number;
  fechas_totales: number;
  tipo_falta: 'AMARILLA' | 'ROJA' | 'SUSPENSION';
}

interface SancionesHomeProps {
  sanciones?: ISancion[];
  loading?: boolean;
  linkSancionesCompleta?: string;
}

export const SancionesHome = ({ 
  sanciones, 
  loading = false,
  linkSancionesCompleta = '/sanciones'
}: SancionesHomeProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  const sancionesPorPagina = 5;
  const totalPaginas = Math.ceil((sanciones?.length || 0) / sancionesPorPagina);
  
  // Obtener sanciones de la página actual
  const inicio = currentPage * sancionesPorPagina;
  const fin = inicio + sancionesPorPagina;
  const sancionesLimitadas = sanciones?.slice(inicio, fin) || [];

  // Manejar cambio de página con dirección de animación
  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPaginas || newPage === currentPage) return;
    
    if (newPage > currentPage) {
      setSlideDirection('left');
    } else {
      setSlideDirection('right');
    }
    
    setCurrentPage(newPage);
  };

  // Casos vacíos
  if (!sanciones || sanciones.length === 0) {
    return (
      <BaseCard>
        <CardHeader 
          icon={<AlertTriangle size={18} className="text-yellow-500" />}
          title="Sanciones Activas"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-[#737373]" />
          </div>
          <p className="text-[#737373] text-sm text-center">
            No hay sanciones activas
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
          icon={<AlertTriangle size={18} className="text-yellow-500" />}
          title="Sanciones Activas"
          subtitle="Cargando..."
        />
        <BaseCardTableSkeleton 
          columns={4} 
          rows={5}
          hasAvatar={true}
        />
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader 
          icon={<AlertTriangle size={18} className="text-yellow-500" />}
          title="Sanciones Activas"
          actions={
            totalPaginas > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-1 rounded-full bg-[#262626] hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <span className="text-xs text-[#737373] min-w-[40px] text-center">
                  {currentPage + 1} / {totalPaginas}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPaginas - 1}
                  className="p-1 rounded-full bg-[#262626] hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Página siguiente"
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
          key={currentPage}
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
                  Jugador
                </th>
                <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  FC/FT
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  Artículo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {sancionesLimitadas.map((sancion, index) => {
                const cumplidas = sancion.fechas_cumplidas;
                const totales = sancion.fechas_totales;
                const porcentaje = (cumplidas / totales) * 100;
                
                return (
                  <tr
                    key={sancion.id}
                    className="hover:bg-[#0a0a0a] transition-colors"
                  >
                    <td className="py-3 px-3 text-white text-sm font-bold">
                      {inicio + index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {/* Foto de perfil */}
                        <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {sancion.foto_jugador ? (
                            <img 
                              src={sancion.foto_jugador} 
                              alt={sancion.nombre_jugador}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-[#737373]" size={18} />
                          )}
                        </div>
                        {/* Info del jugador */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-white text-sm font-medium truncate">
                            {sancion.nombre_jugador} {sancion.apellido_jugador}
                          </span>
                          <span className="text-[#737373] text-[10px] truncate">
                            {sancion.nombre_equipo} · {sancion.categoria_edicion}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${
                          cumplidas === totales ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {cumplidas}/{totales}
                        </span>
                        {/* Barra de progreso */}
                        <div className="w-12 h-1.5 bg-[#262626] rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              cumplidas === totales ? 'bg-green-400' : 'bg-yellow-400'
                            }`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-white text-xs">
                        {sancion.articulo}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Link para ver sanciones completas */}
      <div className="border-t border-[#262626] p-4">
        <Link 
          href={linkSancionesCompleta}
          className="flex items-center justify-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
        >
          Ver todas las sanciones
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

export const mockSanciones: ISancion[] = [
  {
    id: 1,
    id_jugador: 1,
    nombre_jugador: 'Juan',
    apellido_jugador: 'Pérez',
    foto_jugador: null,
    id_equipo: 1,
    nombre_equipo: 'Los Tigres FC',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 75 - Conducta violenta',
    fechas_cumplidas: 1,
    fechas_totales: 3,
    tipo_falta: 'ROJA'
  },
  {
    id: 2,
    id_jugador: 2,
    nombre_jugador: 'Miguel',
    apellido_jugador: 'González',
    foto_jugador: null,
    id_equipo: 2,
    nombre_equipo: 'Deportivo Central',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 73 - Doble amonestación',
    fechas_cumplidas: 0,
    fechas_totales: 1,
    tipo_falta: 'AMARILLA'
  },
  {
    id: 3,
    id_jugador: 3,
    nombre_jugador: 'Carlos',
    apellido_jugador: 'Rodríguez',
    foto_jugador: null,
    id_equipo: 3,
    nombre_equipo: 'Deportivo Huracán',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 76 - Agresión al árbitro',
    fechas_cumplidas: 3,
    fechas_totales: 5,
    tipo_falta: 'ROJA'
  },
  {
    id: 4,
    id_jugador: 4,
    nombre_jugador: 'Luis',
    apellido_jugador: 'Martínez',
    foto_jugador: null,
    id_equipo: 4,
    nombre_equipo: 'Atlético Sur',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 74 - Juego brusco grave',
    fechas_cumplidas: 2,
    fechas_totales: 2,
    tipo_falta: 'SUSPENSION'
  },
  {
    id: 5,
    id_jugador: 5,
    nombre_jugador: 'Fernando',
    apellido_jugador: 'López',
    foto_jugador: null,
    id_equipo: 5,
    nombre_equipo: 'Club Estrella',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 73 - Acumulación tarjetas',
    fechas_cumplidas: 0,
    fechas_totales: 1,
    tipo_falta: 'AMARILLA'
  },
  {
    id: 6,
    id_jugador: 6,
    nombre_jugador: 'Diego',
    apellido_jugador: 'Sánchez',
    foto_jugador: null,
    id_equipo: 6,
    nombre_equipo: 'Sporting Villa',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 75 - Conducta antideportiva',
    fechas_cumplidas: 1,
    fechas_totales: 4,
    tipo_falta: 'ROJA'
  },
  {
    id: 7,
    id_jugador: 7,
    nombre_jugador: 'Roberto',
    apellido_jugador: 'Fernández',
    foto_jugador: null,
    id_equipo: 7,
    nombre_equipo: 'Unión Barrio',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 73 - Doble amonestación',
    fechas_cumplidas: 1,
    fechas_totales: 1,
    tipo_falta: 'AMARILLA'
  },
  {
    id: 8,
    id_jugador: 8,
    nombre_jugador: 'Andrés',
    apellido_jugador: 'Castro',
    foto_jugador: null,
    id_equipo: 8,
    nombre_equipo: 'FC Municipal',
    categoria_edicion: 'Primera División 2024',
    articulo: 'Art. 76 - Palabras ofensivas',
    fechas_cumplidas: 0,
    fechas_totales: 2,
    tipo_falta: 'SUSPENSION'
  }
];

