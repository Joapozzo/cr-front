'use client';

import { useMemo } from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import getEquiposInactivosColumns from '@/app/components/columns/EquiposInactivosColumns';
import { EquiposExpulsion } from '@/app/types/equipo';

interface EquiposInactivosTableProps {
    equipos: EquiposExpulsion[];
    isLoading: boolean;
    onReactivarEquipo: (idEquipo: number) => void;
}

export default function EquiposInactivosTable({
    equipos,
    isLoading,
    onReactivarEquipo
}: EquiposInactivosTableProps) {
    const columns = useMemo(
        () => getEquiposInactivosColumns(onReactivarEquipo),
        [onReactivarEquipo]
    );

    // Cast para compatibilidad con DataTable genérico
    const equiposAsRecords = equipos as unknown as Array<Record<string, unknown>>;

    return (
        <DataTable
            data={equiposAsRecords}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No hay equipos expulsados en esta categoría."
        />
    );
}

