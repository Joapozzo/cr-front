'use client';

import { useMemo } from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import getEquiposColumns from '@/app/components/columns/EquiposColumns';

interface EquiposActivosTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    equipos: any[];
    isLoading: boolean;
    onRowClick: (equipo: { id_equipo: number }) => void;
    onExpulsarEquipo: (idEquipo: number) => void;
}

export default function EquiposActivosTable({
    equipos,
    isLoading,
    onRowClick,
    onExpulsarEquipo
}: EquiposActivosTableProps) {
    const columns = useMemo(
        () => getEquiposColumns(onExpulsarEquipo),
        [onExpulsarEquipo]
    );

    return (
        <DataTable
            data={equipos}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No se encontraron equipos activos para esta categoría."
            onRowClick={onRowClick}
        />
    );
}

