import { useState, useEffect } from 'react';
import { Shield, Zap } from 'lucide-react';
import TabSeleccionManual from '../TabSeleccionManual';
import TabAutomatizacion from '../TabAutomatizacion';
import { BaseModal } from './ModalAdmin';

interface ModalSeleccionarEquipoProps {
    isOpen: boolean;
    onClose: () => void;
    idEdicion: number;
    idZona: number;
    idCategoriaEdicion: number;
    vacante: number;
    isOcupada: boolean;
    esEliminacionDirecta?: boolean;
    numeroFaseActual?: number;
    idPartido?: number;
}

const ModalSeleccionarEquipo = ({
    isOpen,
    onClose,
    idEdicion,
    idZona,
    idCategoriaEdicion,
    vacante,
    isOcupada,
    esEliminacionDirecta = false,
    numeroFaseActual = 1,
    idPartido
}: ModalSeleccionarEquipoProps) => {
    const [activeTab, setActiveTab] = useState<'manual' | 'automatizacion'>('manual');

    useEffect(() => {
        if (isOpen) {
            setActiveTab(esEliminacionDirecta ? 'automatizacion' : 'manual');
        }
    }, [isOpen, esEliminacionDirecta]);

    const modalTitle = `${isOcupada ? 'Reemplazar' : 'Seleccionar'} equipo - Vacante ${vacante}`;

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={modalTitle}
            type="create"
            maxWidth="max-w-3xl"
        >
            {esEliminacionDirecta && (
                <div className="flex gap-2 p-1 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] mb-6">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'manual'
                                ? 'bg-[var(--green)] text-white'
                                : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                        }`}
                    >
                        <Shield className="w-4 h-4" />
                        Selección Manual
                    </button>
                    <button
                        onClick={() => setActiveTab('automatizacion')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'automatizacion'
                                ? 'bg-[var(--green)] text-white'
                                : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Automatización
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'manual' ? (
                    <TabSeleccionManual
                        idEdicion={idEdicion}
                        idZona={idZona}
                        idCategoriaEdicion={idCategoriaEdicion}
                        vacante={vacante}
                        isOcupada={isOcupada}
                        onClose={onClose}
                    />
                ) : (
                    <TabAutomatizacion
                        idZona={idZona}
                        idCategoriaEdicion={idCategoriaEdicion}
                        vacante={vacante}
                        numeroFaseActual={numeroFaseActual}
                        onClose={onClose}
                        idPartido={idPartido}
                    />
                )}
            </div>
        </BaseModal>
    );
};

export default ModalSeleccionarEquipo;