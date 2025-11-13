'use client';

import { useState } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { CategoriaSelector, CategoriaOption } from '@/app/components/estadisticas/CategoriaSelector';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosicionesCompleta } from '@/app/components/estadisticas/TablaPosicionesCompleta';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import { JugadorEstadistica } from '@/app/types/estadisticas';

// Mock data para testing
const mockCategorias: CategoriaOption[] = [
  { id: 1, nombre: 'Primera - Masculino', edicion: 'Clausura 2025' },
  { id: 2, nombre: 'Segunda - Masculino', edicion: 'Clausura 2025' },
  { id: 3, nombre: 'Femenino', edicion: 'Clausura 2025' },
  { id: 4, nombre: 'Primera - Masculino', edicion: 'Apertura 2024' },
];

const mockPosiciones: EquipoPosicion[] = [
  {
    id_equipo: 1,
    nombre_equipo: 'Los Cracks FC',
    partidos_jugados: 10,
    ganados: 8,
    empatados: 1,
    perdidos: 1,
    goles_favor: 25,
    goles_contra: 8,
    diferencia_goles: 17,
    puntos: 25,
    ultima_actualizacion: '2025-01-10',
    img_equipo: '/img/team1.png'
  },
  {
    id_equipo: 2,
    nombre_equipo: 'Real Fútbol',
    partidos_jugados: 10,
    ganados: 7,
    empatados: 2,
    perdidos: 1,
    goles_favor: 22,
    goles_contra: 10,
    diferencia_goles: 12,
    puntos: 23,
    ultima_actualizacion: '2025-01-10',
    img_equipo: '/img/team2.png'
  },
  {
    id_equipo: 3,
    nombre_equipo: 'Deportivo Unidos',
    partidos_jugados: 10,
    ganados: 6,
    empatados: 2,
    perdidos: 2,
    goles_favor: 18,
    goles_contra: 12,
    diferencia_goles: 6,
    puntos: 20,
    ultima_actualizacion: '2025-01-10',
    img_equipo: '/img/team3.png'
  },
  {
    id_equipo: 4,
    nombre_equipo: 'Club Atlético',
    partidos_jugados: 10,
    ganados: 5,
    empatados: 3,
    perdidos: 2,
    goles_favor: 16,
    goles_contra: 11,
    diferencia_goles: 5,
    puntos: 18,
    ultima_actualizacion: '2025-01-10',
    img_equipo: '/img/team4.png'
  },
  {
    id_equipo: 5,
    nombre_equipo: 'FC Campeones',
    partidos_jugados: 10,
    ganados: 4,
    empatados: 4,
    perdidos: 2,
    goles_favor: 14,
    goles_contra: 10,
    diferencia_goles: 4,
    puntos: 16,
    ultima_actualizacion: '2025-01-10',
    img_equipo: '/img/team5.png'
  },
];

const mockGoleadores: JugadorEstadistica[] = [
  {
    id_jugador: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    img: '/img/player1.png',
    equipo: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 15
  },
  {
    id_jugador: 2,
    nombre: 'Carlos',
    apellido: 'García',
    img: '/img/player2.png',
    equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 12
  },
  {
    id_jugador: 3,
    nombre: 'Mateo',
    apellido: 'Rodríguez',
    img: '/img/player3.png',
    equipo: { id_equipo: 3, nombre: 'Deportivo Unidos', img: '/img/team3.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 10
  },
  {
    id_jugador: 4,
    nombre: 'Lucas',
    apellido: 'Fernández',
    img: '/img/player4.png',
    equipo: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 9
  },
  {
    id_jugador: 5,
    nombre: 'Diego',
    apellido: 'Martínez',
    img: '/img/player5.png',
    equipo: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 8
  },
];

const mockAsistencias: JugadorEstadistica[] = [
  {
    id_jugador: 6,
    nombre: 'Sebastián',
    apellido: 'López',
    img: '/img/player6.png',
    equipo: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 10
  },
  {
    id_jugador: 7,
    nombre: 'Martín',
    apellido: 'González',
    img: '/img/player7.png',
    equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 8
  },
  {
    id_jugador: 8,
    nombre: 'Tomás',
    apellido: 'Sánchez',
    img: '/img/player8.png',
    equipo: { id_equipo: 3, nombre: 'Deportivo Unidos', img: '/img/team3.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 7
  },
];

const mockAmarillas: JugadorEstadistica[] = [
  {
    id_jugador: 9,
    nombre: 'Pablo',
    apellido: 'Ramírez',
    img: '/img/player9.png',
    equipo: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 5
  },
  {
    id_jugador: 10,
    nombre: 'Facundo',
    apellido: 'Torres',
    img: '/img/player10.png',
    equipo: { id_equipo: 5, nombre: 'FC Campeones', img: '/img/team5.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 4
  },
];

const mockRojas: JugadorEstadistica[] = [
  {
    id_jugador: 11,
    nombre: 'Nicolás',
    apellido: 'Díaz',
    img: '/img/player11.png',
    equipo: { id_equipo: 3, nombre: 'Deportivo Unidos', img: '/img/team3.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 2
  },
  {
    id_jugador: 12,
    nombre: 'Agustín',
    apellido: 'Morales',
    img: '/img/player12.png',
    equipo: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 1
  },
];

const mockMVPs: JugadorEstadistica[] = [
  {
    id_jugador: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    img: '/img/player1.png',
    equipo: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 7
  },
  {
    id_jugador: 2,
    nombre: 'Carlos',
    apellido: 'García',
    img: '/img/player2.png',
    equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 5
  },
  {
    id_jugador: 6,
    nombre: 'Sebastián',
    apellido: 'López',
    img: '/img/player6.png',
    equipo: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    categoria_edicion: 'Primera - Clausura 2025',
    valor: 4
  },
];

export default function EstadisticasPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaOption | null>(mockCategorias[0]);
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');

  // TODO: Implementar hooks reales
  // const { data: categorias, isLoading: loadingCategorias } = useCategorias();
  // const { data: edicion, isLoading: loadingEdicion } = useEdicionActual();

  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion="Copa Relámpago"
        temporada="Clausura 2025"
        nombreCategoria={categoriaSeleccionada?.nombre}
        // logoEdicion={edicion?.logo}
        // loading={loadingEdicion}
      >
        <div className="w-full space-y-6">
          {/* Selector de categorías */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Seleccionar Categoría</h2>
            </div>
            
            <CategoriaSelector 
              categorias={mockCategorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onSeleccionar={setCategoriaSeleccionada}
              // loading={loadingCategorias}
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
                <TablaPosicionesCompleta
                  posiciones={mockPosiciones}
                  zonasPlayoff={[]} // TODO: Agregar mock de playoffs si es necesario
                  isLoading={false}
                  userTeamIds={[1]} // TODO: Obtener del authStore/playerStore
                />
              )}

              {activeTab === 'goleadores' && (
                <TablaJugadoresEstadisticas
                  jugadores={mockGoleadores}
                  tipo="goleadores"
                  isLoading={false}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                    // TODO: Abrir modal con filtros o detalles del jugador
                  }}
                />
              )}

              {activeTab === 'asistencias' && (
                <TablaJugadoresEstadisticas
                  jugadores={mockAsistencias}
                  tipo="asistencias"
                  isLoading={false}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'amarillas' && (
                <TablaJugadoresEstadisticas
                  jugadores={mockAmarillas}
                  tipo="amarillas"
                  isLoading={false}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'rojas' && (
                <TablaJugadoresEstadisticas
                  jugadores={mockRojas}
                  tipo="rojas"
                  isLoading={false}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}

              {activeTab === 'mvps' && (
                <TablaJugadoresEstadisticas
                  jugadores={mockMVPs}
                  tipo="mvps"
                  isLoading={false}
                  onRowClick={(jugador) => {
                    console.log('Jugador seleccionado:', jugador);
                  }}
                />
              )}
            </div>
          </div>
        )}

          {/* Mensaje si no hay categoría seleccionada */}
          {!categoriaSeleccionada && (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
              <p className="text-[#737373] text-center text-sm">
                Selecciona una categoría para ver las estadísticas
              </p>
            </div>
          )}
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

