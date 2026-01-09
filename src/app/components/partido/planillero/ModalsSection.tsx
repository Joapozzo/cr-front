import React from 'react';
import PartidoModals from '@/app/components/PartidoModals';
import JugadorEventualModal from '@/app/components/modals/CrearJugadorEventualModal';
import { DatosCompletosPlanillero } from '@/app/types/partido';
import { usePartidoModals } from '@/app/hooks/usePartidoModals';

interface ModalsSectionProps {
    datosPartido?: DatosCompletosPlanillero;
    idPartido: number;
    showEventualModal: boolean;
    equipoEventual: 'local' | 'visita';
    isDeleting: boolean;
    onLoadingChange: (isLoading: boolean, jugadorId: number) => void;
    onConfirmDelete: (jugadorId: number) => void;
    onCloseEventualModal: () => void;
    modals: ReturnType<typeof usePartidoModals>;
}

export const ModalsSection: React.FC<ModalsSectionProps> = ({
    datosPartido,
    idPartido,
    showEventualModal,
    equipoEventual,
    isDeleting,
    onLoadingChange,
    onConfirmDelete,
    onCloseEventualModal,
    modals
}) => {

    return (
        <>
            <PartidoModals
                modals={modals}
                datosPartido={datosPartido}
                onLoadingChange={onLoadingChange}
                onConfirmDelete={onConfirmDelete}
                isDeleting={isDeleting}
            />

            {datosPartido?.partido.id_categoria_edicion && 
             datosPartido?.partido.equipoLocal?.id_equipo && 
             datosPartido?.partido.equipoVisita?.id_equipo && (
                <JugadorEventualModal
                    isOpen={showEventualModal}
                    onClose={onCloseEventualModal}
                    idPartido={idPartido}
                    idCategoriaEdicion={datosPartido.partido.id_categoria_edicion}
                    idEquipo={equipoEventual === 'local'
                        ? datosPartido.partido.equipoLocal.id_equipo
                        : datosPartido.partido.equipoVisita.id_equipo
                    }
                />
            )}
        </>
    );
};

