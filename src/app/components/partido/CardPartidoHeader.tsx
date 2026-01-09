import React from 'react';
import { IncidenciaGol, PartidoCompleto } from '@/app/types/partido';
import BotoneraPartido from '../ButtonContainer';
import ModalPenales from '../modals/ModalPenales';
import { Button } from '../ui/Button';
import { CardPartidoHeaderSkeleton } from '../skeletons/CardPartidoHeaderSkeleton';
import { usePartidoHeaderData } from '@/app/hooks/usePartidoHeaderData';
import { usePartidoPenales } from '@/app/hooks/usePartidoPenales';
import { PartidoHeaderMeta } from './PartidoHeaderMeta';
import { PartidoEstado } from './PartidoEstado';
import { PartidoEquipos } from './PartidoEquipos';
import { PartidoGoleadores } from './PartidoGoleadores';

interface PartidoHeaderStickyProps {
    partido: PartidoCompleto;
    goles?: IncidenciaGol[];
    esPlanillero?: boolean;
    onEmpezarPartido?: () => void;
    onTerminarPrimerTiempo?: () => void;
    onEmpezarSegundoTiempo?: () => void;
    onTerminarPartido?: () => void;
    onFinalizarPartido?: () => void;
    
    onSuspenderPartido?: () => void;
    isLoading?: boolean;
    cronometro?: {
        fase: 'PT' | 'HT' | 'ST' | 'ET';
        tiempoFormateado: string;
        shouldShowAdicional: boolean;
        tiempoAdicional: number;
    };
    isLoadingButton?: boolean;
    actionInProgress?: 'empezarPartido' | 'terminarPrimerTiempo' | 'empezarSegundoTiempo' | 'terminarPartido' | 'finalizarPartido' | 'suspenderPartido' | null;
}

const PartidoHeaderSticky: React.FC<PartidoHeaderStickyProps> = ({
    partido,
    goles = [],
    esPlanillero = false,
    onEmpezarPartido,
    onTerminarPrimerTiempo,
    onEmpezarSegundoTiempo,
    onTerminarPartido,
    onFinalizarPartido,
    onSuspenderPartido,
    isLoading,
    cronometro,
    isLoadingButton,
    actionInProgress
}) => {
    // Hook para formatear y procesar datos del partido (siempre se llaman, partido está garantizado por el padre)
    const {
        estadoActual,
        fechaFormateada,
        nombreCancha,
        golesLocal,
        golesVisita,
        mostrarResultado,
    } = usePartidoHeaderData({
        partido,
        goles,
        esPlanillero,
    });

    // Hook para manejar lógica de penales
    const {
        mostrarBotonPenales,
        isModalPenalesOpen,
        abrirModalPenales,
        cerrarModalPenales,
        registrarPenales,
        isLoadingPenales,
    } = usePartidoPenales({
        partido,
        estadoActual,
        esPlanillero,
    });

    // Mostrar skeleton si está cargando (partido siempre está definido gracias al guard en el padre)
    if (isLoading) {
        return <CardPartidoHeaderSkeleton />;
    }

    return (
        <div className="bg-[var(--black-900)] border-b border-t border-[#262626] overflow-hidden rounded-xl">
            {/* Header - Categoría */}
            <PartidoHeaderMeta
                jornada={partido.jornada}
                fecha={fechaFormateada}
                cancha={nombreCancha}
            />

            {/* Info del partido */}
            <div className="px-6 py-4 space-y-4">
                {/* Línea 1: Tiempo/Estado */}
                <PartidoEstado
                    estado={estadoActual}
                    partidoId={partido.id_partido}
                    esPlanillero={esPlanillero}
                    cronometro={cronometro}
                />

                {/* Línea 2: Equipos y Resultado */}
                <PartidoEquipos
                    partido={partido}
                    mostrarResultado={mostrarResultado}
                />

                {/* Línea 3: Goleadores - Horizontal y compacto */}
                {mostrarResultado && (golesLocal.length > 0 || golesVisita.length > 0) && (
                    <PartidoGoleadores
                        golesLocal={golesLocal}
                        golesVisita={golesVisita}
                    />
                )}
            </div>

            {esPlanillero && estadoActual !== 'F' && (
                <BotoneraPartido
                    estado={estadoActual}
                    isLoading={isLoadingButton}
                    actionInProgress={actionInProgress}
                    onEmpezarPartido={onEmpezarPartido}
                    onTerminarPrimerTiempo={onTerminarPrimerTiempo}
                    onEmpezarSegundoTiempo={onEmpezarSegundoTiempo}
                    onTerminarPartido={onTerminarPartido}
                    onFinalizarPartido={onFinalizarPartido}
                    onSuspenderPartido={onSuspenderPartido}
                />
            )}

            {/* Botón Registrar Penales - Solo visible si cumple condiciones */}
            {mostrarBotonPenales && (
                <div className="sticky bottom-0 z-50 border-t border-[#262626] px-6 py-4 bg-[var(--black-900)]">
                    <Button
                        onClick={abrirModalPenales}
                        className="w-full py-3"
                        variant="footer"
                    >
                        Registrar Penales
                    </Button>
                </div>
            )}

            {/* Modal de Penales */}
            <ModalPenales
                isOpen={isModalPenalesOpen}
                onClose={cerrarModalPenales}
                onConfirm={registrarPenales}
                penLocalActual={partido.pen_local}
                penVisitaActual={partido.pen_visita}
                equipoLocal={partido.equipoLocal?.nombre || 'Local'}
                equipoVisita={partido.equipoVisita?.nombre || 'Visitante'}
                isLoading={isLoadingPenales}
            />
        </div>
    );
};

export default PartidoHeaderSticky;