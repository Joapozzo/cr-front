'use client';

import { PartidosTab } from '@/app/components/equipo/partidos/PartidosTab';

interface PartidosContentProps {
  idEquipo: number;
  idCategoriaEdicion: number;
}

export default function PartidosContent({
  idEquipo,
  idCategoriaEdicion
}: PartidosContentProps) {
  return (
    <PartidosTab
      idEquipo={idEquipo}
      idCategoriaEdicion={idCategoriaEdicion}
    />
  );
}

