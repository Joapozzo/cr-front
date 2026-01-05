'use client';

import { useMemo, Suspense } from 'react';
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
        id_equipo: pos.id_equipo,
        nombre_equipo: pos.nombre_equipo,
        partidos_jugados: pos.partidos_jugados,
        ganados: pos.partidos_ganados,
        empatados: pos.partidos_empatados,
        perdidos: pos.partidos_perdidos,
        goles_favor: pos.goles_favor,
        goles_contra: pos.goles_contra,
        diferencia_goles: pos.diferencia_goles,
        puntos: pos.puntos,
        puntos_descontados: pos.puntos_descontados,
        puntos_finales: pos.puntos_finales,
        apercibimientos: pos.apercibimientos,
        ultima_actualizacion: new Date().toISOString().split('T')[0],
        img_equipo: pos.img_equipo || undefined
      }));
    }
    
    const todasPosiciones: EquipoPosicion[] = [];
    posicionesData.forEach(zona => {
      zona.posiciones.forEach(pos => {
        todasPosiciones.push({
          id_equipo: pos.id_equipo,
          nombre_equipo: pos.nombre_equipo,
          partidos_jugados: pos.partidos_jugados,
          ganados: pos.partidos_ganados,
          empatados: pos.partidos_empatados,
          perdidos: pos.partidos_perdidos,
          goles_favor: pos.goles_favor,
          goles_contra: pos.goles_contra,
          diferencia_goles: pos.diferencia_goles,
          puntos: pos.puntos,
          puntos_descontados: pos.puntos_descontados,
          puntos_finales: pos.puntos_finales,
          apercibimientos: pos.apercibimientos,
          ultima_actualizacion: new Date().toISOString().split('T')[0],
          img_equipo: pos.img_equipo || undefined
        });
      });
    });
    
    return todasPosiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
      return b.goles_favor - a.goles_favor;
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
                id_equipo: pos.id_equipo,
                nombre_equipo: pos.nombre_equipo,
                partidos_jugados: pos.partidos_jugados,
                ganados: pos.partidos_ganados,
                empatados: pos.partidos_empatados,
                perdidos: pos.partidos_perdidos,
                goles_favor: pos.goles_favor,
                goles_contra: pos.goles_contra,
                diferencia_goles: pos.diferencia_goles,
                puntos: pos.puntos,
                puntos_descontados: pos.puntos_descontados,
                puntos_finales: pos.puntos_finales,
                apercibimientos: pos.apercibimientos,
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
  return (
    <Suspense fallback={<BaseCardTableSkeleton columns={5} rows={6} hasAvatar={false} />}>
      <PosicionesContentInner />
    </Suspense>
  );
}

