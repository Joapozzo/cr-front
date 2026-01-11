'use client';

import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import CapitanesBlock from '../CapitanesBlock';
import CapitanesSkeleton from '../skeletons/CapitanesSkeleton';

interface CapitanesContainerProps {
    idEquipo: number;
    idCategoriaEdicion: number;
}

export default function CapitanesContainer({
    idEquipo,
    idCategoriaEdicion
}: CapitanesContainerProps) {
    const { data: response, isLoading } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idEquipo && !!idCategoriaEdicion
    });

    if (isLoading || !response?.data) {
        return <CapitanesSkeleton />;
    }

    const { equipo, plantel } = response.data;

    return (
        <CapitanesBlock
            plantel={plantel}
            idEquipo={idEquipo}
            idCategoriaEdicion={idCategoriaEdicion}
            equipo={equipo}
        />
    );
}

