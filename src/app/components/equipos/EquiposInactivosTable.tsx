'use client';

import { useMemo } from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import getEquiposInactivosColumns from '@/app/components/columns/EquiposInactivosColumns';

interface EquiposInactivosTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    equipos: any[];
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

    return (
        <DataTable
            data={equipos}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No hay equipos expulsados en esta categoría."
        />
    );
}

