'use client';

import { useState, useMemo, useEffect } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { CategoriaSelector, CategoriaOption } from '@/app/components/estadisticas/CategoriaSelector';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosicionesCompleta } from '@/app/components/estadisticas/TablaPosicionesCompleta';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import { useEdicionesConCategorias } from '@/app/hooks/useEdiciones';
import {
  usePosicionesPorCategoriaEdicion,
  useGoleadoresPorCategoriaEdicion,
  useAsistenciasPorCategoriaEdicion,
  useAmarillasPorCategoriaEdicion,
  useRojasPorCategoriaEdicion,
  useMVPsPorCategoriaEdicion
} from '@/app/hooks/useEstadisticas';
import { useAuthStore } from '@/app/stores/authStore';

export default function EstadisticasPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaOption | null>(null);
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');
  const equipos = useAuthStore((state) => state.equipos || []);
  const userTeamIds = useMemo(() => equipos.map(e => e.id), [equipos]);

  // Obtener ediciones con categorías
  const { data: edicionesConCategorias, isLoading: loadingCategorias } = useEdicionesConCategorias();

  // Mapear categorías al formato esperado
  const categoriasOptions = useMemo(() => {
    if (!edicionesConCategorias) return [];
    
    const categorias: CategoriaOption[] = [];
    edicionesConCategorias.forEach(edicion => {
      edicion.categorias.forEach(categoria => {
        categorias.push({
          id: categoria.id_categoria_edicion,
          nombre: categoria.nombre,
          edicion: `${edicion.nombre} ${edicion.temporada}`
        });
      });
    });
    
    return categorias;
  }, [edicionesConCategorias]);

  // Inicializar categoría seleccionada
  useEffect(() => {
    if (!categoriaSeleccionada && categoriasOptions.length > 0) {
      setCategoriaSeleccionada(categoriasOptions[0]);
    }
  }, [categoriasOptions, categoriaSeleccionada]);

  // Hooks para estadísticas
  const { data: posicionesData, isLoading: loadingPosiciones } = usePosicionesPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
  );
  const { data: goleadores, isLoading: loadingGoleadores } = useGoleadoresPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
  );
  const { data: asistencias, isLoading: loadingAsistencias } = useAsistenciasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
  );
  const { data: amarillas, isLoading: loadingAmarillas } = useAmarillasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
  );
  const { data: rojas, isLoading: loadingRojas } = useRojasPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
  );
  const { data: mvps, isLoading: loadingMVPs } = useMVPsPorCategoriaEdicion(
    categoriaSeleccionada?.id || null
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

  // Obtener información de la edición seleccionada
  const edicionActual = useMemo(() => {
    if (!categoriaSeleccionada || !edicionesConCategorias) return null;
    return edicionesConCategorias.find(e => 
      e.categorias.some(c => c.id_categoria_edicion === categoriaSeleccionada.id)
    );
  }, [categoriaSeleccionada, edicionesConCategorias]);

  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion={edicionActual?.nombre || 'Copa Relámpago'}
        temporada={edicionActual?.temporada?.toString() || '2025'}
        nombreCategoria={categoriaSeleccionada?.nombre}
        loading={loadingCategorias}
      >
        <div className="w-full space-y-6">
          {/* Selector de categorías */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Seleccionar Categoría</h2>
            </div>
            
            <CategoriaSelector 
              categorias={categoriasOptions}
              categoriaSeleccionada={categoriaSeleccionada}
              onSeleccionar={setCategoriaSeleccionada}
              loading={loadingCategorias}
            />
          </div>

        {/* Tabs de estadísticas */}
        {categoriaSeleccionada && (
          <div className="space-y-6">
            <EstadisticasTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Contenido según tab seleccionado */}
            <div className="min-h-[300px]">
              {activeTab === 'posiciones' && (
                <>
                  {posicionesData && posicionesData.length > 1 ? (
                    // Si hay múltiples zonas, mostrar cada una
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
                              ultima_actualizacion: new Date().toISOString().split('T')[0],
                              img_equipo: pos.img_equipo || undefined
                            }))}
                            zonasPlayoff={[]}
                            isLoading={loadingPosiciones}
                            userTeamIds={userTeamIds}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <TablaPosicionesCompleta
                      posiciones={posicionesAplanadas}
                      zonasPlayoff={[]}
                      isLoading={loadingPosiciones}
                      userTeamIds={userTeamIds}
                    />
                  )}
                </>
              )}

              {activeTab === 'goleadores' && (
                <TablaJugadoresEstadisticas
                  jugadores={goleadores || []}
                  tipo="goleadores"
                  isLoading={loadingGoleadores}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                    // TODO: Abrir modal con filtros o detalles del jugador
                  }}
                />
              )}

              {activeTab === 'asistencias' && (
                <TablaJugadoresEstadisticas
                  jugadores={asistencias || []}
                  tipo="asistencias"
                  isLoading={loadingAsistencias}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'amarillas' && (
                <TablaJugadoresEstadisticas
                  jugadores={amarillas || []}
                  tipo="amarillas"
                  isLoading={loadingAmarillas}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'rojas' && (
                <TablaJugadoresEstadisticas
                  jugadores={rojas || []}
                  tipo="rojas"
                  isLoading={loadingRojas}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'mvps' && (
                <TablaJugadoresEstadisticas
                  jugadores={mvps || []}
                  tipo="mvps"
                  isLoading={loadingMVPs}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}
            </div>
          </div>
        )}

          {/* Mensaje si no hay categoría seleccionada */}
          {!categoriaSeleccionada && !loadingCategorias && (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
              <p className="text-[#737373] text-center text-sm">
                {categoriasOptions.length === 0 
                  ? 'No hay categorías disponibles'
                  : 'Selecciona una categoría para ver las estadísticas'
                }
              </p>
            </div>
          )}
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

