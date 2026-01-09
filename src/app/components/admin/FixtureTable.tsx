import { DataTable } from '@/app/components/ui/DataTable';
import GetPartidosColumns from '@/app/components/columns/PartidosColumns';
import { PartidoResponse } from '@/app/schemas/partidos.schema';

interface FixtureTableProps {
    partidos: PartidoResponse[];
    onEliminarPartido: (partido: PartidoResponse) => void;
    onEditarPartido: (partido: PartidoResponse) => void;
    onVerDescripcion: (partido: PartidoResponse) => void;
    isLoading: boolean;
}

/**
 * Componente para mostrar la tabla de partidos del fixture
 */
export const FixtureTable = ({
    partidos,
    onEliminarPartido,
    onEditarPartido,
    onVerDescripcion,
    isLoading,
}: FixtureTableProps) => {
    const partidosColumns = GetPartidosColumns(
        onEliminarPartido,
        onEditarPartido,
        onVerDescripcion
    );

    return (
        <DataTable
            data={partidos}
            columns={partidosColumns}
            emptyMessage="No se encontraron partidos para esta jornada."
            isLoading={isLoading}
        />
    );
};

