'use client';

import React, { useState } from 'react';
import { PlantelEquipo } from '@/app/types/plantelEquipo';
import { JugadorPlantelCard } from './JugadorPlantelCard';
import { BotonUnirseEquipo } from './BotonUnirseEquipo';
import { SolicitudesCapitanPlantel } from './SolicitudesCapitanPlantel';
import { PlantelTabSkeleton } from '@/app/components/skeletons/PlantelTabSkeleton';
import { usePlayerStore } from '@/app/stores/playerStore';
import { ModalSolicitarBaja } from './ModalSolicitarBaja';
import { useSolicitarBaja, useObtenerSolicitudesBajaPorJugador } from '@/app/hooks/useSolicitudesBaja';
import { Button } from '@/app/components/ui/Button';
import { LogOut, UserMinus } from 'lucide-react';

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
  const { mutate: solicitarBaja, isPending: isSolicitandoBaja } = useSolicitarBaja();
  
  // Estados para modales de baja
  const [showModalBajaPropia, setShowModalBajaPropia] = useState(false);
  const [showModalBajaJugador, setShowModalBajaJugador] = useState(false);
  const [jugadorBajaSeleccionado, setJugadorBajaSeleccionado] = useState<{ id_jugador: number; nombre: string } | null>(null);
  
  // Obtener idEdicion y idCategoriaEdicion del equipo desde el store
  const equipoDelStore = equipos.find(eq => eq.id_equipo === idEquipo);
  const idEdicion = equipoDelStore?.id_edicion;
  const idCategoriaEdicion = equipoDelStore?.id_categoria_edicion;

  // Obtener solicitudes de baja del jugador para verificar si hay una pendiente
  const { data: solicitudesBajaData } = useObtenerSolicitudesBajaPorJugador(jugador?.id_jugador || 0);
  
  // Verificar si el jugador tiene una solicitud de baja pendiente para este equipo y categoría
  const tieneSolicitudBajaPendiente = solicitudesBajaData?.data?.some(
    (solicitud) => 
      solicitud.id_equipo === idEquipo && 
      solicitud.id_categoria_edicion === idCategoriaEdicion && 
      solicitud.estado === 'P'
  ) || false;

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
  };

  const handleRejectSolicitud = (id_solicitud: number) => {
    // TODO: Refrescar el plantel después de rechazar
  };

  // Handler para solicitar baja propia
  const handleSolicitarBajaPropia = async (motivo?: string, observaciones?: string) => {
    if (!jugador?.id_jugador || !idCategoriaEdicion) {
      return;
    }

    solicitarBaja({
      id_equipo: idEquipo,
      id_jugador_capitan: jugador.id_jugador, // El jugador solicita su propia baja
      id_categoria_edicion: idCategoriaEdicion,
      id_jugador_baja: jugador.id_jugador,
      motivo,
      observaciones
    }, {
      onSuccess: () => {
        setShowModalBajaPropia(false);
      }
    });
  };

  // Handler para capitán solicitar baja de otro jugador
  const handleSolicitarBajaJugador = (jugador: { id_jugador: number; nombre: string; apellido: string }) => {
    setJugadorBajaSeleccionado({
      id_jugador: jugador.id_jugador,
      nombre: `${jugador.nombre} ${jugador.apellido}`
    });
    setShowModalBajaJugador(true);
  };

  const handleConfirmarBajaJugador = async (motivo?: string, observaciones?: string) => {
    if (!jugador?.id_jugador || !idCategoriaEdicion || !jugadorBajaSeleccionado) {
      return;
    }

    solicitarBaja({
      id_equipo: idEquipo,
      id_jugador_capitan: jugador.id_jugador, // El capitán solicita la baja
      id_categoria_edicion: idCategoriaEdicion,
      id_jugador_baja: jugadorBajaSeleccionado.id_jugador,
      motivo,
      observaciones
    }, {
      onSuccess: () => {
        setShowModalBajaJugador(false);
        setJugadorBajaSeleccionado(null);
      }
    });
  };

  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Lista de jugadores */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-white font-semibold text-sm px-1">Plantel</h3>
        {plantel.jugadores && plantel.jugadores.length > 0 ? (
          plantel.jugadores.map((jugadorItem) => (
            <div key={jugadorItem.id_jugador} className="relative">
              <JugadorPlantelCard jugador={jugadorItem} />
              {/* Botón para capitán solicitar baja de otro jugador - siempre visible (no hover) */}
              {esCapitan && 
               jugador?.id_jugador && 
               jugadorItem.id_jugador !== jugador.id_jugador && (
                <div className="absolute top-2 right-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSolicitarBajaJugador(jugadorItem)}
                    className="flex items-center gap-1"
                    title="Solicitar baja de este jugador"
                  >
                    <UserMinus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
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
          <p className="text-[var(--color-primary)]/50 text-sm font-medium">
            Ya estás en este equipo
          </p>
        </div>
        )}

        {esCapitan && idCategoriaEdicion && (
          <SolicitudesCapitanPlantel
            idEquipo={idEquipo}
            id_categoria_edicion={idCategoriaEdicion}
            onAcceptSolicitud={handleAcceptSolicitud}
            onRejectSolicitud={handleRejectSolicitud}
          />
        )}

        {/* Botón para solicitar baja propia - siempre visible si pertenece al equipo */}
        {perteneceAlEquipo && jugador?.id_jugador && (
          <div className="w-full">
            <Button
              variant="danger"
              size="md"
              onClick={() => setShowModalBajaPropia(true)}
              className="w-full flex items-center justify-center gap-2"
              disabled={isSolicitandoBaja || tieneSolicitudBajaPendiente}
              title={tieneSolicitudBajaPendiente ? 'Ya tienes una solicitud de baja pendiente' : 'Solicitar darse de baja'}
            >
              <LogOut className="w-4 h-4" />
              {tieneSolicitudBajaPendiente ? 'Solicitud de baja pendiente' : 'Solicitar darse de baja'}
            </Button>
            {tieneSolicitudBajaPendiente && (
              <p className="text-[var(--gray-100)] text-xs mt-2 text-center">
                Ya tienes una solicitud de baja pendiente para este equipo
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modales de solicitud de baja */}
      {jugador && (
        <>
          {/* Modal para jugador solicitar su propia baja */}
          <ModalSolicitarBaja
            isOpen={showModalBajaPropia}
            onClose={() => setShowModalBajaPropia(false)}
            onConfirm={handleSolicitarBajaPropia}
            jugadorNombre={`${jugador.nombre} ${jugador.apellido}`}
            esPropiaBaja={true}
            isLoading={isSolicitandoBaja}
          />

          {/* Modal para capitán solicitar baja de otro jugador */}
          {jugadorBajaSeleccionado && (
            <ModalSolicitarBaja
              isOpen={showModalBajaJugador}
              onClose={() => {
                setShowModalBajaJugador(false);
                setJugadorBajaSeleccionado(null);
              }}
              onConfirm={handleConfirmarBajaJugador}
              jugadorNombre={jugadorBajaSeleccionado.nombre}
              esPropiaBaja={false}
              isLoading={isSolicitandoBaja}
            />
          )}
        </>
      )}
    </div>
  );
};

