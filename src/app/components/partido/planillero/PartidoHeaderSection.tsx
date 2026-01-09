import React from 'react';
import { PartidoCompleto, IncidenciaGol } from '@/app/types/partido';
import PartidoHeaderSticky from '../CardPartidoHeader';
import { CardPartidoHeaderSkeleton } from '../../skeletons/CardPartidoHeaderSkeleton';

interface PartidoHeaderSectionProps {
    partido?: PartidoCompleto;
    goles: IncidenciaGol[];
    isLoading: boolean;
    isLoadingButton: boolean;
    actionInProgress?: 'empezarPartido' | 'terminarPrimerTiempo' | 'empezarSegundoTiempo' | 'terminarPartido' | 'finalizarPartido' | 'suspenderPartido' | null;
    cronometro?: {
        fase: 'PT' | 'HT' | 'ST' | 'ET';
        tiempoFormateado: string;
        shouldShowAdicional: boolean;
        tiempoAdicional: number;
    };
    onEmpezarPartido?: () => void;
    onTerminarPrimerTiempo?: () => void;
    onEmpezarSegundoTiempo?: () => void;
    onTerminarPartido?: () => void;
    onFinalizarPartido?: () => void;
    onSuspenderPartido?: () => void;
}

export const PartidoHeaderSection: React.FC<PartidoHeaderSectionProps> = ({
    partido,
    goles,
    isLoading,
    isLoadingButton,
    actionInProgress,
    cronometro,
    onEmpezarPartido,
    onTerminarPrimerTiempo,
    onEmpezarSegundoTiempo,
    onTerminarPartido,
    onFinalizarPartido,
    onSuspenderPartido
}) => {
    // Mostrar skeleton mientras carga o si no hay partido aún
    // Esto evita que los componentes de abajo "salten" cuando el componente se renderiza
    if (isLoading || !partido) {
        return <CardPartidoHeaderSkeleton />;
    }

    return (
        <PartidoHeaderSticky
            partido={partido}
            goles={goles}
            esPlanillero={true}
            onEmpezarPartido={onEmpezarPartido}
            onTerminarPrimerTiempo={onTerminarPrimerTiempo}
            onEmpezarSegundoTiempo={onEmpezarSegundoTiempo}
            onTerminarPartido={onTerminarPartido}
            onFinalizarPartido={onFinalizarPartido}
            onSuspenderPartido={onSuspenderPartido}
            isLoading={false}
            cronometro={cronometro}
            isLoadingButton={isLoadingButton}
            actionInProgress={actionInProgress}
        />
    );
};

