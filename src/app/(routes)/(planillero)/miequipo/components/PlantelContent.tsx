'use client';

import { PlantelTab } from '@/app/components/equipo/plantel/PlantelTab';
import { useEquipoPlantel } from '@/app/hooks/useEquipoPlantel';

interface PlantelContentProps {
  idEquipo: number;
  idCategoriaEdicion: number;
  perteneceAlEquipo: boolean;
  esCapitan: boolean;
}

export default function PlantelContent({
  idEquipo,
  idCategoriaEdicion,
  perteneceAlEquipo,
  esCapitan
}: PlantelContentProps) {
  const { data: plantel, isLoading: loadingPlantel } = useEquipoPlantel(
    idEquipo,
    idCategoriaEdicion
  );

  return (
    <PlantelTab
      idEquipo={idEquipo}
      plantel={plantel || null}
      perteneceAlEquipo={perteneceAlEquipo}
      esCapitan={esCapitan}
      loading={loadingPlantel}
    />
  );
}

