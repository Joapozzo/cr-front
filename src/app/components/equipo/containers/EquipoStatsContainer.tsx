'use client';

import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import EquipoStatsCards from '../EquipoStatsCards';
import EquipoStatsSkeleton from '../skeletons/EquipoStatsSkeleton';

interface EquipoStatsContainerProps {
    idEquipo: number;
    idCategoriaEdicion: number;
}

export default function EquipoStatsContainer({
    idEquipo,
    idCategoriaEdicion
}: EquipoStatsContainerProps) {
    const { data: response, isLoading } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idEquipo && !!idCategoriaEdicion
    });

    if (isLoading || !response?.data) {
        return <EquipoStatsSkeleton />;
    }

    const { estadisticas } = response.data;

    return <EquipoStatsCards estadisticas={estadisticas} />;
}

