'use client';

import React from 'react';
import SolicitudesCapitan from '@/app/components/CaptainRequest';

interface SolicitudesCapitanPlantelProps {
  idEquipo: number;
  onAcceptSolicitud?: (id_solicitud: number) => void;
  onRejectSolicitud?: (id_solicitud: number) => void;
}

export const SolicitudesCapitanPlantel: React.FC<SolicitudesCapitanPlantelProps> = ({
  idEquipo,
  onAcceptSolicitud,
  onRejectSolicitud
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-sm px-1">Solicitudes entrantes</h3>
      <SolicitudesCapitan
        id_equipo={idEquipo}
        onAcceptSolicitud={onAcceptSolicitud}
        onRejectSolicitud={onRejectSolicitud}
      />
    </div>
  );
};

