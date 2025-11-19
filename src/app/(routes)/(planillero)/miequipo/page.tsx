'use client';

import { useState, useEffect, useMemo } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EquipoLayout } from '@/app/components/equipo/EquipoLayout';
import { EquipoTabs, TabEquipo } from '@/app/components/equipo/EquipoTabs';
import { ResumenTab } from '@/app/components/equipo/resumen/ResumenTab';
import { PlantelTab } from '@/app/components/equipo/plantel/PlantelTab';
import { StatsTab } from '@/app/components/equipo/stats/StatsTab';
import { PartidosTab } from '@/app/components/equipo/partidos/PartidosTab';
import { ParticipacionesTab } from '@/app/components/equipo/participaciones/ParticipacionesTab';
import { useEquipoResumen } from '@/app/hooks/useEquipoResumen';
import { useEquiposUsuario } from '@/app/hooks/useEquiposUsuario';
import { useEquipoPlantel } from '@/app/hooks/useEquipoPlantel';
import { useEquipoParticipaciones } from '@/app/hooks/useEquipoParticipaciones';
import {
  usePosicionesPorCategoriaEdicion,
  useGoleadoresPorCategoriaEdicion,
  useAsistenciasPorCategoriaEdicion,
  useAmarillasPorCategoriaEdicion,
  useRojasPorCategoriaEdicion,
  useMVPsPorCategoriaEdicion
} from '@/app/hooks/useEstadisticas';
import { useZonasPlayoffCategoria } from '@/app/hooks/useCategoriaDashboard';
// Los partidos ahora se obtienen dentro del componente PartidosTab
import { ObtenerEquiposActualesDelJugadorResponse } from '@/app/types/jugador';
import { Partido } from '@/app/types/partido';
import { IEquipoPosicion, EquipoPosicion } from '@/app/types/posiciones';
import { ParticipacionEquipo } from '@/app/types/participacionEquipo';
import { useRouter } from 'next/navigation';

export default function MiEquipoPage() {
  const router = useRouter();
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<ObtenerEquiposActualesDelJugadorResponse | null>(null);
  const [tabActiva, setTabActiva] = useState<TabEquipo>('resumen');

  // Obtener equipos del usuario con información completa
  const { data: equiposUsuario, isLoading: loadingEquipos } = useEquiposUsuario();

  // Inicializar equipo seleccionado
  useEffect(() => {
    if (!equipoSeleccionado && equiposUsuario && equiposUsuario.length > 0) {
      setEquipoSeleccionado(equiposUsuario[0]);
    }
  }, [equiposUsuario, equipoSeleccionado]);

  // Obtener resumen del equipo seleccionado
  const { data: resumen, isLoading: loadingResumen } = useEquipoResumen(
    equipoSeleccionado?.id_equipo || null,
    equipoSeleccionado?.id_categoria_edicion || null
  );

  // Obtener plantel del equipo
  const { data: plantel, isLoading: loadingPlantel } = useEquipoPlantel(
    equipoSeleccionado?.id_equipo || null,
    equipoSeleccionado?.id_categoria_edicion || null
  );

  // Obtener estadísticas de la categoría edición
  const { data: posicionesData, isLoading: loadingPosiciones } = usePosicionesPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );
  const { data: goleadores, isLoading: loadingGoleadores } = useGoleadoresPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );
  const { data: asistencias, isLoading: loadingAsistencias } = useAsistenciasPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );
  const { data: amarillas, isLoading: loadingAmarillas } = useAmarillasPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );
  const { data: rojas, isLoading: loadingRojas } = useRojasPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );
  const { data: mvps, isLoading: loadingMVPs } = useMVPsPorCategoriaEdicion(
    equipoSeleccionado?.id_categoria_edicion || null
  );

  // Procesar posiciones: aplanar si hay múltiples zonas y mapear a EquipoPosicion
  const posicionesAplanadas = useMemo(() => {
    if (!posicionesData || posicionesData.length === 0) return [];
    
    // Mapear IEquipoPosicion a EquipoPosicion
    const mapearPosicion = (pos: IEquipoPosicion): EquipoPosicion => ({
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
      ultima_actualizacion: new Date().toISOString().split('T')[0],
      img_equipo: pos.img_equipo || undefined
    });
    
    // Si hay una sola zona, devolver sus posiciones mapeadas
    if (posicionesData.length === 1) {
      return posicionesData[0].posiciones.map(mapearPosicion);
    }
    
    // Si hay múltiples zonas, aplanar todas las posiciones
    const todasPosiciones: EquipoPosicion[] = [];
    posicionesData.forEach(zona => {
      todasPosiciones.push(...zona.posiciones.map(mapearPosicion));
    });
    return todasPosiciones;
  }, [posicionesData]);

  // Obtener zonas de playoff
  const { data: zonasPlayoffData, isLoading: loadingZonasPlayoff } = useZonasPlayoffCategoria(
    equipoSeleccionado?.id_categoria_edicion || 0
  );
  
  // Preparar datos de stats para StatsTab
  const stats = useMemo(() => {
    const zonasPlayoff = zonasPlayoffData?.data || [];
    return {
      posiciones: posicionesAplanadas,
      zonasPlayoff: zonasPlayoff,
      goleadores: goleadores || [],
      asistencias: asistencias || [],
      amarillas: amarillas || [],
      rojas: rojas || [],
      mvps: mvps || []
    };
  }, [posicionesAplanadas, zonasPlayoffData, goleadores, asistencias, amarillas, rojas, mvps]);

  const loadingStats = loadingPosiciones || loadingGoleadores || loadingAsistencias || loadingAmarillas || loadingRojas || loadingMVPs || loadingZonasPlayoff;

  // Los partidos ahora se obtienen dentro del componente PartidosTab usando usePartidosUsuarioPorEquipo

  // Obtener participaciones del equipo
  const { data: participaciones, isLoading: loadingParticipaciones } = useEquipoParticipaciones(
    equipoSeleccionado?.id_equipo || null
  );

  // Verificar si el usuario pertenece al equipo
  const perteneceAlEquipo = useMemo(() => {
    if (!equipoSeleccionado) return false;
    return equiposUsuario?.some(eq => eq.id_equipo === equipoSeleccionado.id_equipo) || false;
  }, [equipoSeleccionado, equiposUsuario]);

  const esCapitan = equipoSeleccionado?.es_capitan || false;

  // Handler para cambiar de equipo desde el selector
  const handleCambiarEquipo = (nuevoIdEquipo: number) => {
    const nuevoEquipo = equiposUsuario?.find(eq => eq.id_equipo === nuevoIdEquipo);
    if (nuevoEquipo) {
      setEquipoSeleccionado(nuevoEquipo);
    }
  };

  // Handler para ver todos los stats
  const handleVerTodosStats = (tipo: string) => {
    if (equipoSeleccionado) {
      router.push(`/equipos/${equipoSeleccionado.id_equipo}/stats?tipo=${tipo}`);
    }
  };

  // Mapear equipos para el EquipoLayout
  const equiposParaLayout = useMemo(() => {
    if (!equiposUsuario) return [];
    return equiposUsuario.map(eq => ({
      id_equipo: eq.id_equipo,
      nombre_equipo: eq.nombre_equipo,
      img_equipo: eq.img_equipo,
      id_categoria_edicion: eq.id_categoria_edicion,
      nombre_categoria: eq.nombre_categoria,
      id_edicion: eq.id_edicion,
      nombre_torneo: eq.nombre_torneo,
      temporada: eq.temporada,
      es_capitan: eq.es_capitan
    }));
  }, [equiposUsuario]);

  if (loadingEquipos) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Cargando equipos...</p>
        </div>
      </UserPageWrapper>
    );
  }

  if (!equiposUsuario || equiposUsuario.length === 0) {
    return (
      <UserPageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center w-full max-w-md">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-[#737373]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-white text-base font-medium">Todavía no tienes ningún equipo asignado</p>
                <p className="text-[#737373] text-sm">Cuando te asignen a un equipo, aparecerá aquí</p>
              </div>
            </div>
          </div>
        </div>
      </UserPageWrapper>
    );
  }

  if (!equipoSeleccionado) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Selecciona un equipo</p>
        </div>
      </UserPageWrapper>
    );
  }

  const isLoading = loadingResumen;

  // Contenido según la tab activa
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'resumen':
        return (
          <ResumenTab
            idEquipo={equipoSeleccionado.id_equipo}
            resumen={resumen || null}
            loading={loadingResumen}
            onVerTodosStats={handleVerTodosStats}
          />
        );
      case 'plantel':
        return (
          <PlantelTab
            idEquipo={equipoSeleccionado.id_equipo}
            idEdicion={equipoSeleccionado.id_edicion}
            plantel={plantel || null}
            perteneceAlEquipo={perteneceAlEquipo}
            esCapitan={esCapitan}
            loading={loadingPlantel}
          />
        );
      case 'stats':
        return (
          <StatsTab
            idEquipo={equipoSeleccionado.id_equipo}
            posiciones={stats.posiciones}
            zonasPlayoff={stats.zonasPlayoff}
            goleadores={stats.goleadores}
            asistencias={stats.asistencias}
            amarillas={stats.amarillas}
            rojas={stats.rojas}
            mvps={stats.mvps}
            loading={loadingStats}
          />
        );
      case 'partidos':
        return (
          <PartidosTab
            idEquipo={equipoSeleccionado.id_equipo}
          />
        );
      case 'participaciones':
        return (
          <ParticipacionesTab
            idEquipo={equipoSeleccionado.id_equipo}
            participaciones={participaciones || []}
            loading={loadingParticipaciones}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UserPageWrapper>
      <EquipoLayout
        idEquipo={equipoSeleccionado.id_equipo}
        nombreEquipo={equipoSeleccionado.nombre_equipo}
        imgEquipo={equipoSeleccionado.img_equipo}
        perteneceAlEquipo={perteneceAlEquipo}
        esCapitan={esCapitan}
        equiposDelUsuario={equiposParaLayout}
        onCambiarEquipo={handleCambiarEquipo}
        loading={isLoading}
      >
        <EquipoTabs
          tabActiva={tabActiva}
          onTabChange={setTabActiva}
          loading={isLoading}
        />
        {renderTabContent()}
      </EquipoLayout>
    </UserPageWrapper>
  );
}
