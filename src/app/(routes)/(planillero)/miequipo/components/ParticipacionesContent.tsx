'use client';

import { ParticipacionesTab } from '@/app/components/equipo/participaciones/ParticipacionesTab';
import { useEquipoParticipaciones } from '@/app/hooks/useEquipoParticipaciones';

interface ParticipacionesContentProps {
  idEquipo: number;
}

export default function ParticipacionesContent({
  idEquipo
}: ParticipacionesContentProps) {
  const { data: participaciones, isLoading: loadingParticipaciones } = useEquipoParticipaciones(
    idEquipo
  );

  return (
    <ParticipacionesTab
      idEquipo={idEquipo}
      participaciones={participaciones || []}
      loading={loadingParticipaciones}
    />
  );
}

