'use client';

import { ResumenTab } from '@/app/components/equipo/resumen/ResumenTab';
import { useEquipoResumen } from '@/app/hooks/useEquipoResumen';

interface ResumenContentProps {
  idEquipo: number;
  idCategoriaEdicion: number;
  onVerTodosStats?: (tipo: string) => void;
}

export default function ResumenContent({
  idEquipo,
  idCategoriaEdicion,
  onVerTodosStats
}: ResumenContentProps) {
  const { data: resumen, isLoading: loadingResumen } = useEquipoResumen(
    idEquipo,
    idCategoriaEdicion
  );

  return (
    <ResumenTab
      idEquipo={idEquipo}
      resumen={resumen || null}
      loading={loadingResumen}
      onVerTodosStats={onVerTodosStats}
    />
  );
}

