'use client';

import { useState, useCallback } from 'react';
import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import EquipoHeader from '../EquipoHeader';
import EquipoHeaderSkeleton from '../skeletons/EquipoHeaderSkeleton';
import ModalEditarEquipo from '@/app/components/modals/ModalEditarEquipo';
import ModalApercibimientos from '@/app/components/modals/ModalApercibimientos';

interface EquipoHeaderContainerProps {
    idEquipo: number;
    idCategoriaEdicion: number;
}

export default function EquipoHeaderContainer({
    idEquipo,
    idCategoriaEdicion
}: EquipoHeaderContainerProps) {
    const [isEditarEquipoModalOpen, setIsEditarEquipoModalOpen] = useState(false);
    const [isApercibimientosModalOpen, setIsApercibimientosModalOpen] = useState(false);
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());

    const { data: response, isLoading, refetch } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idEquipo && !!idCategoriaEdicion
    });

    const handleEditSuccess = useCallback(async () => {
        await refetch();
        setImageTimestamp(Date.now());
    }, [refetch]);

    if (isLoading || !response?.data) {
        return <EquipoHeaderSkeleton />;
    }

    const { equipo, estadisticas, id_zona } = response.data;

    return (
        <>
            <EquipoHeader
                equipo={equipo}
                apercibimientos={estadisticas.apercibimientos || 0}
                onEditEquipo={() => setIsEditarEquipoModalOpen(true)}
                onApercibimientos={() => setIsApercibimientosModalOpen(true)}
            />

            <ModalEditarEquipo
                key={`equipo-${equipo.id_equipo}-${equipo.img || 'no-img'}-${imageTimestamp}`}
                isOpen={isEditarEquipoModalOpen}
                onClose={() => setIsEditarEquipoModalOpen(false)}
                equipo={{
                    id_equipo: equipo.id_equipo,
                    nombre: equipo.nombre,
                    descripcion: equipo.descripcion,
                    img: equipo.img
                }}
                onSuccess={handleEditSuccess}
            />

            {id_zona && (
                <ModalApercibimientos
                    isOpen={isApercibimientosModalOpen}
                    onClose={() => setIsApercibimientosModalOpen(false)}
                    idEquipo={idEquipo}
                    idCategoriaEdicion={idCategoriaEdicion}
                    idZona={id_zona}
                    apercibimientosActuales={estadisticas.apercibimientos || 0}
                    equipoNombre={equipo.nombre}
                />
            )}
        </>
    );
}

