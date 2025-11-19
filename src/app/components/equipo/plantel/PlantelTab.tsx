'use client';

import React from 'react';
import { PlantelEquipo } from '@/app/types/plantelEquipo';
import { JugadorPlantelCard } from './JugadorPlantelCard';
import { BotonUnirseEquipo } from './BotonUnirseEquipo';
import { SolicitudesCapitanPlantel } from './SolicitudesCapitanPlantel';
import { PlantelTabSkeleton } from '@/app/components/skeletons/PlantelTabSkeleton';
import { usePlayerStore } from '@/app/stores/playerStore';

interface PlantelTabProps {
  idEquipo: number;
  plantel: PlantelEquipo | null;
  perteneceAlEquipo: boolean;
  esCapitan: boolean;
  loading?: boolean;
}

export const PlantelTab: React.FC<PlantelTabProps> = ({
  idEquipo,
  plantel,
  perteneceAlEquipo,
  esCapitan,
  loading = false
}) => {
  const { jugador, equipos } = usePlayerStore();
  
  // Obtener idEdicion del equipo desde el store
  const equipoDelStore = equipos.find(eq => eq.id_equipo === idEquipo);
  const idEdicion = equipoDelStore?.id_edicion;

  if (loading) {
    return <PlantelTabSkeleton />;
  }

  if (!plantel) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const handleAcceptSolicitud = (id_solicitud: number) => {
    // TODO: Refrescar el plantel después de aceptar
    console.log('Solicitud aceptada:', id_solicitud);
  };

  const handleRejectSolicitud = (id_solicitud: number) => {
    // TODO: Refrescar el plantel después de rechazar
    console.log('Solicitud rechazada:', id_solicitud);
  };

  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Lista de jugadores */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-white font-semibold text-sm px-1">Plantel</h3>
        {plantel.jugadores && plantel.jugadores.length > 0 ? (
          plantel.jugadores.map((jugador) => (
            <JugadorPlantelCard key={jugador.id_jugador} jugador={jugador} />
          ))
        ) : (
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
            <p className="text-[#737373] text-xs sm:text-sm">No hay jugadores en el plantel</p>
          </div>
        )}
      </div>

      {/* Acciones según el rol del usuario */}
      <div className="pt-4 border-t border-[#262626] space-y-4">
        {!perteneceAlEquipo && jugador?.id_jugador && idEdicion && (
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm px-1">Unirse al equipo</h3>
            <BotonUnirseEquipo
              idEquipo={idEquipo}
              idEdicion={idEdicion}
              loading={loading}
            />
          </div>
        )}

        {perteneceAlEquipo && !esCapitan && (
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 text-center">
          <p className="text-[var(--green)]/50 text-sm font-medium">
            Ya estás en este equipo
          </p>
        </div>
        )}

        {esCapitan && (
          <SolicitudesCapitanPlantel
            idEquipo={idEquipo}
            onAcceptSolicitud={handleAcceptSolicitud}
            onRejectSolicitud={handleRejectSolicitud}
          />
        )}
      </div>
    </div>
  );
};

