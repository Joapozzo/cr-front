'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TablaPosiciones } from '@/app/components/posiciones/TablaPosiciones';
import {
  usePosicionesPorCategoriaEdicion,
  useZonasPlayoffPorCategoriaEdicion
} from '@/app/hooks/useEstadisticas';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';
import { useAuthStore } from '@/app/stores/authStore';
import { EquipoPosicion } from '@/app/types/posiciones';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';

function PosicionesContentInner() {
  const searchParams = useSearchParams();
  const equipos = useAuthStore((state) => state.equipos || []);
  const userTeamIds = useMemo(() => equipos.map(e => e.id), [equipos]);
  const { categoriaSeleccionada } = useEdicionCategoria();

  // Memoizar el ID de categoría de forma más estable para evitar cambios innecesarios
  const categoriaId = useMemo(() => {
    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam) {
      const parsed = parseInt(categoriaParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    // Solo usar categoriaSeleccionada si tiene un ID válido
    if (categoriaSeleccionada?.id && categoriaSeleccionada.id > 0) {
      return categoriaSeleccionada.id;
    }
    return null;
  }, [searchParams, categoriaSeleccionada?.id]); // Solo dependencia del ID, no del objeto completo

  const { data: posicionesData, isLoading: loadingPosiciones, error: errorPosiciones } = 
    usePosicionesPorCategoriaEdicion(categoriaId, { enabled: !!categoriaId });
  
  const { data: zonasPlayoffData, isLoading: loadingPlayoff, error: errorPlayoff } = 
    useZonasPlayoffPorCategoriaEdicion(categoriaId, { enabled: !!categoriaId });

  const posicionesAplanadas = useMemo(() => {
    if (!posicionesData || posicionesData.length === 0) return [];
    
    if (posicionesData.length === 1) {
      return posicionesData[0].posiciones.map(pos => ({
        ...pos, // Preservar todos los campos originales (incluyendo _live y en_vivo)
        // Mapear campos para compatibilidad con EquipoPosicion
        ganados: pos.partidos_ganados,
        empatados: pos.partidos_empatados,
        perdidos: pos.partidos_perdidos,
        ultima_actualizacion: new Date().toISOString().split('T')[0],
        img_equipo: pos.img_equipo || undefined
      }));
    }
    
    const todasPosiciones: EquipoPosicion[] = [];
    posicionesData.forEach(zona => {
      zona.posiciones.forEach(pos => {
        todasPosiciones.push({
          ...pos, // Preservar todos los campos originales (incluyendo _live y en_vivo)
          // Mapear campos para compatibilidad con EquipoPosicion
          ganados: pos.partidos_ganados,
          empatados: pos.partidos_empatados,
          perdidos: pos.partidos_perdidos,
          ultima_actualizacion: new Date().toISOString().split('T')[0],
          img_equipo: pos.img_equipo || undefined
        });
      });
    });
    
    // Ordenar por puntos finales (usando valores live si están disponibles), diferencia de goles, goles a favor
    return todasPosiciones.sort((a, b) => {
      const equipoA = a as EquipoPosicion & { puntos_finales_live?: number; diferencia_goles_live?: number; goles_favor_live?: number };
      const equipoB = b as EquipoPosicion & { puntos_finales_live?: number; diferencia_goles_live?: number; goles_favor_live?: number };
      
      const puntosA = equipoA.puntos_finales_live ?? equipoA.puntos_finales ?? equipoA.puntos ?? 0;
      const puntosB = equipoB.puntos_finales_live ?? equipoB.puntos_finales ?? equipoB.puntos ?? 0;
      if (puntosB !== puntosA) return puntosB - puntosA;
      
      const difA = equipoA.diferencia_goles_live ?? equipoA.diferencia_goles ?? 0;
      const difB = equipoB.diferencia_goles_live ?? equipoB.diferencia_goles ?? 0;
      if (difB !== difA) return difB - difA;
      
      const gfA = equipoA.goles_favor_live ?? equipoA.goles_favor ?? 0;
      const gfB = equipoB.goles_favor_live ?? equipoB.goles_favor ?? 0;
      return gfB - gfA;
    });
  }, [posicionesData]);

  if (errorPosiciones || errorPlayoff) {
    return (
      <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
        <p className="text-red-400 text-center text-sm">
          {(errorPosiciones || errorPlayoff)?.message || 'Error al cargar las posiciones'}
        </p>
      </div>
    );
  }

  if (loadingPosiciones || loadingPlayoff) {
    return <BaseCardTableSkeleton columns={5} rows={6} hasAvatar={false} />;
  }

  if (posicionesData && posicionesData.length > 1) {
    return (
      <div className="space-y-6">
        {posicionesData.map((zona) => (
          <div key={zona.id_zona} className="space-y-2">
            <h3 className="text-white font-semibold text-sm px-2">
              {zona.nombre_zona}
            </h3>
            <TablaPosiciones
              variant="completa"
              posiciones={zona.posiciones.map(pos => ({
                ...pos, // Preservar todos los campos originales (incluyendo _live y en_vivo)
                // Mapear campos para compatibilidad con EquipoPosicion
                ganados: pos.partidos_ganados,
                empatados: pos.partidos_empatados,
                perdidos: pos.partidos_perdidos,
                ultima_actualizacion: new Date().toISOString().split('T')[0],
                img_equipo: pos.img_equipo || undefined
              }))}
              zonasPlayoff={zonasPlayoffData || []}
              isLoading={false}
              userTeamIds={userTeamIds}
              formatosPosicion={zona.formatosPosicion}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TablaPosiciones
      variant="completa"
      posiciones={posicionesAplanadas}
      zonasPlayoff={zonasPlayoffData || []}
      isLoading={false}
      userTeamIds={userTeamIds}
      formatosPosicion={posicionesData && posicionesData.length === 1 ? posicionesData[0].formatosPosicion : undefined}
    />
  );
}

export default function PosicionesContent() {
  return <PosicionesContentInner />;
}

