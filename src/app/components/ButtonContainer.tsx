import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/Button'; 
import { EstadoPartido } from '@/app/types/partido';

type ActionInProgress = 'empezarPartido' | 'terminarPrimerTiempo' | 'empezarSegundoTiempo' | 'terminarPartido' | 'finalizarPartido' | 'suspenderPartido' | null;

interface BotoneraPartidoProps {
    estado: EstadoPartido;
    isLoading: boolean | undefined;
    actionInProgress?: ActionInProgress;
    onEmpezarPartido?: () => void;
    onTerminarPrimerTiempo?: () => void;
    onEmpezarSegundoTiempo?: () => void;
    onTerminarPartido?: () => void;
    onFinalizarPartido?: () => void;
    onSuspenderPartido?: () => void;
}

const BotoneraPartido: React.FC<BotoneraPartidoProps> = ({
    estado,
    isLoading = false,
    actionInProgress = null,
    onEmpezarPartido,
    onTerminarPrimerTiempo,
    onEmpezarSegundoTiempo,
    onTerminarPartido,
    onFinalizarPartido,
    onSuspenderPartido: _onSuspenderPartido,
}) => {
    const renderBotones = () => {
        switch (estado) {
            case 'P':
                return (
                    <Button
                        onClick={onEmpezarPartido}
                        disabled={isLoading}
                        variant='footer'
                        className='py-3 flex items-center gap-2 justify-center w-full'
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                                <Loader2 size={16} className="animate-spin" />
                                Empezando...
                            </span>
                        ) : (
                            'Empezar Partido'
                        )}
                    </Button>
                );

            case 'C1':
                return (
                    <Button
                        onClick={onTerminarPrimerTiempo}
                        disabled={isLoading}
                        className='w-full py-3'
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                                <Loader2 size={16} className="animate-spin" />
                                Terminando...
                            </span>
                        ) : (
                            'Terminar 1er Tiempo'
                        )}
                    </Button>
                );

            case 'E':
                return (
                    <Button
                        onClick={onEmpezarSegundoTiempo}
                        disabled={isLoading}
                        className='w-full py-3'
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                                <Loader2 size={16} className="animate-spin" />
                                Empezando...
                            </span>
                        ) : (
                            'Empezar 2do Tiempo'
                        )}
                    </Button>
                );

            case 'C2':
                // Si estamos empezando el segundo tiempo, mostrar "Empezando..." en lugar de "Terminando..."
                const isEmpezandoSegundoTiempo = actionInProgress === 'empezarSegundoTiempo';
                return (
                    <Button
                        onClick={onTerminarPartido}
                        disabled={isLoading}
                        className='w-full py-3'
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                                <Loader2 size={16} className="animate-spin" />
                                {isEmpezandoSegundoTiempo ? 'Empezando...' : 'Terminando...'}
                            </span>
                        ) : (
                            'Terminar Partido'
                        )}
                    </Button>
                );

            case 'T':
                return (
                    <>
                        <Button
                            onClick={onFinalizarPartido}
                            disabled={isLoading}
                            className='w-full py-3'
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center w-full">
                                    <Loader2 size={16} className="animate-spin" />
                                    Finalizando...
                                </span>
                            ) : (
                                'Finalizar Partido'
                            )}
                        </Button>
                        {/* <Button
                            onClick={onSuspenderPartido}
                            disabled={isLoading}
                            className='w-full py-3'
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center w-full">
                                    <Loader2 size={16} className="animate-spin" />
                                    Suspendiendo...
                                </span>
                            ) : (
                                'Suspender'
                            )}
                        </Button> */}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="sticky bottom-0 z-50 border-t border-[#262626] px-6 py-4 bg-[var(--black-900)]">
            <div className="flex gap-3">
                {renderBotones()}
            </div>
        </div>
    );
};

export default BotoneraPartido;