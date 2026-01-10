'use client';

import { useMemo } from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import getEquiposColumns from '@/app/components/columns/EquiposColumns';
import { EquipoTemporada } from '@/app/types/equipo';

interface EquiposActivosTableProps {
    equipos: EquipoTemporada[];
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

    // Wrapper para adaptar la firma de onRowClick
    const handleRowClick = (row: Record<string, unknown>, index: number) => {
        // Verificar que el row tenga id_equipo
        if (row && typeof row.id_equipo === 'number') {
            onRowClick({ id_equipo: row.id_equipo });
        }
    };

    // Cast para compatibilidad con DataTable genérico
    const equiposAsRecords = equipos as unknown as Array<Record<string, unknown>>;

    return (
        <DataTable
            data={equiposAsRecords}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No se encontraron equipos activos para esta categoría."
            onRowClick={handleRowClick}
        />
    );
}

