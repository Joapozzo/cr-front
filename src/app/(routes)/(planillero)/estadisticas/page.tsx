'use client';

import { useState, useMemo } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { SelectorEdicionCategoria } from '@/app/components/estadisticas/SelectorEdicionCategoria';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosicionesCompleta } from '@/app/components/estadisticas/TablaPosicionesCompleta';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import {
  usePosicionesPorCategoriaEdicion,
  useZonasPlayoffPorCategoriaEdicion,
  useGoleadoresPorCategoriaEdicion,
  useAsistenciasPorCategoriaEdicion,
  useAmarillasPorCategoriaEdicion,
  useRojasPorCategoriaEdicion,
  useMVPsPorCategoriaEdicion
} from '@/app/hooks/useEstadisticas';
import { useAuthStore } from '@/app/stores/authStore';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';

export default function EstadisticasPage() {
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');
  const equipos = useAuthStore((state) => state.equipos || []);
  const userTeamIds = useMemo(() => equipos.map(e => e.id), [equipos]);

  // Usar el contexto de edición y categoría
  const { 
    categoriaSeleccionada, 
    edicionActual, 
    isLoading: loadingCategorias 
  } = useEdicionCategoria();

  // Hooks para estadísticas (solo si hay categoría seleccionada)
  const { data: posicionesData, isLoading: loadingPosiciones, error: errorPosiciones } = usePosicionesPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: zonasPlayoffData, isLoading: loadingPlayoff, error: errorPlayoff } = useZonasPlayoffPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: goleadores, isLoading: loadingGoleadores, error: errorGoleadores } = useGoleadoresPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: asistencias, isLoading: loadingAsistencias, error: errorAsistencias } = useAsistenciasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: amarillas, isLoading: loadingAmarillas, error: errorAmarillas } = useAmarillasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: rojas, isLoading: loadingRojas, error: errorRojas } = useRojasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );
  const { data: mvps, isLoading: loadingMVPs, error: errorMVPs } = useMVPsPorCategoriaEdicion(
    categoriaSeleccionada?.id || null,
    { enabled: !!categoriaSeleccionada }
  );

  // Procesar posiciones: si hay múltiples zonas, aplanarlas o mostrar por zona
  const posicionesAplanadas = useMemo(() => {
    if (!posicionesData || posicionesData.length === 0) return [];
    
    // Si hay una sola zona, devolver sus posiciones directamente
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
    
    // Si hay múltiples zonas, aplanar todas las posiciones
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
    
    // Ordenar por puntos, diferencia de goles, goles a favor
    return todasPosiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
      return b.goles_favor - a.goles_favor;
    });
  }, [posicionesData]);

  // Obtener zonas de todos contra todos desde zonasPlayoffData
  // const zonasTodosContraTodos = useMemo(() => {
  //   if (!zonasPlayoffData) return [];
  //   return zonasPlayoffData.filter(z => 
  //     z.tipoZona?.nombre === 'todos-contra-todos' || 
  //     z.tipoZona?.nombre === 'todos-contra-todos-ida-vuelta'
  //   );
  // }, [zonasPlayoffData]);


  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion={edicionActual?.nombre || 'Copa Relámpago'}
        temporada={edicionActual?.temporada?.toString() || '2025'}
        nombreCategoria={categoriaSeleccionada?.nombre}
        logoEdicion={edicionActual?.img || undefined}
        loading={loadingCategorias}
      >
        <div className="w-full space-y-6">
          {/* Selector de edición y categoría */}
          <SelectorEdicionCategoria />

        {/* Tabs de estadísticas - Solo mostrar si hay categoría seleccionada */}
        {categoriaSeleccionada ? (
          <div className="space-y-6">
            <EstadisticasTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Contenido según tab seleccionado */}
            <div className="min-h-[300px]">
              {activeTab === 'posiciones' && (
                <>
                  {(errorPosiciones || errorPlayoff) ? (
                    <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                      <p className="text-red-400 text-center text-sm">
                        {(errorPosiciones || errorPlayoff)?.message || 'Error al cargar las posiciones'}
                      </p>
                    </div>
                  ) : posicionesData && posicionesData.length > 1 ? (
                    // Si hay múltiples zonas, mostrar cada una por separado
                    <div className="space-y-6">
                      {posicionesData.map((zona) => (
                        <div key={zona.id_zona} className="space-y-2">
                          <h3 className="text-white font-semibold text-sm px-2">
                            {zona.nombre_zona}
                          </h3>
                          <TablaPosicionesCompleta
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
                            isLoading={loadingPosiciones || loadingPlayoff}
                            userTeamIds={userTeamIds}
                            formatosPosicion={zona.formatosPosicion}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Si hay una sola zona o ninguna, mostrar directamente
                    <TablaPosicionesCompleta
                      posiciones={posicionesAplanadas}
                      zonasPlayoff={zonasPlayoffData || []}
                      isLoading={loadingPosiciones || loadingPlayoff}
                      userTeamIds={userTeamIds}
                      formatosPosicion={posicionesData && posicionesData.length === 1 ? posicionesData[0].formatosPosicion : undefined}
                    />
                  )}
                </>
              )}

              {activeTab === 'goleadores' && (
                errorGoleadores ? (
                  <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-center text-sm">
                      {errorGoleadores.message || 'Error al cargar los goleadores'}
                    </p>
                  </div>
                ) : (
                  <TablaJugadoresEstadisticas
                    jugadores={goleadores || []}
                    tipo="goleadores"
                    isLoading={loadingGoleadores}
                    // onRowClick={(jugador) => {
                    //   ('Jugador seleccionado:', jugador);
                    //   // TODO: Abrir modal con filtros o detalles del jugador
                    // }}
                  />
                )
              )}

              {activeTab === 'asistencias' && (
                errorAsistencias ? (
                  <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-center text-sm">
                      {errorAsistencias.message || 'Error al cargar las asistencias'}
                    </p>
                  </div>
                ) : (
                  <TablaJugadoresEstadisticas
                    jugadores={asistencias || []}
                    tipo="asistencias"
                    isLoading={loadingAsistencias}
                    // onRowClick={(jugador) => {
                    //   ('Jugador seleccionado:', jugador);
                    // }}
                  />
                )
              )}

              {activeTab === 'amarillas' && (
                errorAmarillas ? (
                  <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-center text-sm">
                      {errorAmarillas.message || 'Error al cargar las tarjetas amarillas'}
                    </p>
                  </div>
                ) : (
                  <TablaJugadoresEstadisticas
                    jugadores={amarillas || []}
                    tipo="amarillas"
                    isLoading={loadingAmarillas}
                    // onRowClick={(jugador) => {
                    //   ('Jugador seleccionado:', jugador);
                    // }}
                  />
                )
              )}

              {activeTab === 'rojas' && (
                errorRojas ? (
                  <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-center text-sm">
                      {errorRojas.message || 'Error al cargar las tarjetas rojas'}
                    </p>
                  </div>
                ) : (
                  <TablaJugadoresEstadisticas
                    jugadores={rojas || []}
                    tipo="rojas"
                    isLoading={loadingRojas}
                    // onRowClick={(jugador) => {
                    //   ('Jugador seleccionado:', jugador);
                    // }}
                  />
                )
              )}

              {activeTab === 'mvps' && (
                errorMVPs ? (
                  <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-center text-sm">
                      {errorMVPs.message || 'Error al cargar los MVPs'}
                    </p>
                  </div>
                ) : (
                  <TablaJugadoresEstadisticas
                    jugadores={mvps || []}
                    tipo="mvps"
                    isLoading={loadingMVPs}
                    // onRowClick={(jugador) => {
                    //   ('Jugador seleccionado:', jugador);
                    // }}
                  />
                )
              )}
            </div>
          </div>
        ) : edicionActual && !loadingCategorias ? (
          // Si hay edición pero no categorías, mostrar mensaje
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
            <p className="text-[#737373] text-center text-sm">
              Esta edición no tiene categorías disponibles
            </p>
          </div>
        ) : !edicionActual && !loadingCategorias ? (
          // Si no hay edición disponible
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
            <p className="text-[#737373] text-center text-sm">
              No hay ediciones disponibles
            </p>
          </div>
        ) : null}
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

