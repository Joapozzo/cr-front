import { FormatoPosicion } from '../../types/zonas';
import FormatosPosicionStep from '../FormatosPosicionStep';

interface ZonaEditTabsProps {
    activeTab: 'info' | 'formatos';
    setActiveTab: (tab: 'info' | 'formatos') => void;
    formatosPosicion: FormatoPosicion[];
    setFormatosPosicion: (formatos: FormatoPosicion[]) => void;
    cantidadEquipos: number;
    formatosIniciales?: FormatoPosicion[];
    onActualizarFormato: (id_formato: number, data: {
        posicion_desde?: number;
        posicion_hasta?: number;
        descripcion?: string;
        color?: string | null;
        orden?: number;
    }) => Promise<void>;
    onEliminarFormato: (id_formato: number) => Promise<void>;
}

export const ZonaEditTabs = ({
    activeTab,
    setActiveTab,
    formatosPosicion,
    setFormatosPosicion,
    cantidadEquipos,
    formatosIniciales,
    onActualizarFormato,
    onEliminarFormato,
}: ZonaEditTabsProps) => {
    return (
        <div className="w-full">
            <div className="flex border-b border-[var(--gray-300)] mb-4 -mt-2">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'info'
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]'
                            : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                    }`}
                >
                    Información
                </button>
                <button
                    onClick={() => setActiveTab('formatos')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'formatos'
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]'
                            : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                    }`}
                >
                    Formatos de Posición
                </button>
            </div>

            {activeTab === 'formatos' && (
                <div className="mt-2">
                    <FormatosPosicionStep
                        cantidadEquipos={cantidadEquipos}
                        onFormatosChange={setFormatosPosicion}
                        formatosIniciales={formatosIniciales}
                        onActualizarFormato={onActualizarFormato}
                        onEliminarFormato={onEliminarFormato}
                    />
                </div>
            )}
        </div>
    );
};

