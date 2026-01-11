'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import getPlantelColumns from '@/app/components/columns/PlantelesColumns';

interface JugadorPlantel {
    id_jugador: number;
    nombre: string;
    [key: string]: unknown;
}

interface PlantelTableProps {
    plantel: JugadorPlantel[];
    totalJugadores: number;
    onAddJugador: () => void;
    onDarBaja: (id_jugador: number, nombre: string) => void;
    onExpulsar: (id_jugador: number, nombre: string) => void;
}

export default function PlantelTable({
    plantel,
    totalJugadores,
    onAddJugador,
    onDarBaja,
    onExpulsar
}: PlantelTableProps) {
    const router = useRouter();

    const handleDarBaja = useCallback(
        (id_jugador: number, nombre: string) => {
            onDarBaja(id_jugador, nombre);
        },
        [onDarBaja]
    );

    const handleExpulsar = useCallback(
        (id_jugador: number, nombre: string) => {
            onExpulsar(id_jugador, nombre);
        },
        [onExpulsar]
    );

    const handleRowClick = useCallback(
        (row: JugadorPlantel) => {
            router.push(`/adm/legajos/jugadores/${row.id_jugador}`);
        },
        [router]
    );

    const columns = useMemo(
        () =>
            getPlantelColumns({
                onDarBaja: handleDarBaja,
                onExpulsar: handleExpulsar
            }),
        [handleDarBaja, handleExpulsar]
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--white)] mb-1">
                        Lista de buena fé ({totalJugadores}){' '}
                        {totalJugadores > 1 ? 'jugadores' : 'jugador'}
                    </h2>
                    <p className="text-[var(--gray-100)] text-sm">
                        Gestiona los jugadores del plantel
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="success"
                        onClick={onAddJugador}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar jugador
                    </Button>
                </div>
            </div>

            <DataTable
                data={plantel}
                columns={columns}
                emptyMessage="No se encontraron jugadores en el plantel."
                onRowClick={handleRowClick}
            />
        </div>
    );
}

