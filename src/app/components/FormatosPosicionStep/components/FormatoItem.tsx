/**
 * Componente de presentación para un formato individual
 */

import React from 'react';
import { Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../../ui/Input';
import { FormatoTemporal } from '../types';
import { FormatoFormFields } from './FormatoFormFields';
import { ErrorDisplay } from './ErrorDisplay';

interface FormatoItemProps {
    formato: FormatoTemporal;
    cantidadEquipos: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onActualizar: (campo: keyof FormatoTemporal, valor: string | number) => void;
    onEliminar: () => void;
}

export const FormatoItem: React.FC<FormatoItemProps> = ({
    formato,
    cantidadEquipos,
    isExpanded,
    onToggleExpand,
    onActualizar,
    onEliminar,
}) => {
    return (
        <div
            className={`p-3 rounded-lg border transition-all ${
                formato.errores
                    ? 'border-[var(--color-danger)] bg-red-500/10'
                    : 'border-[var(--gray-300)] bg-[var(--gray-500)]'
            }`}
        >
            {/* Header minimizado/expandido */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={onToggleExpand}
                    className="flex-1 flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
                >
                    <span
                        className="w-4 h-4 rounded-full border-2 border-[var(--gray-300)] flex-shrink-0"
                        style={{ backgroundColor: formato.color }}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--white)] font-medium text-sm">
                                Posiciones {formato.posicion_desde} - {formato.posicion_hasta}
                            </span>
                            {formato.errores && (
                                <AlertCircle className="w-4 h-4 text-[var(--color-danger)] flex-shrink-0" />
                            )}
                        </div>
                        {!isExpanded && (
                            <p className="text-[var(--gray-100)] text-xs mt-1 truncate">
                                {formato.descripcion}
                            </p>
                        )}
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[var(--gray-100)] flex-shrink-0" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--gray-100)] flex-shrink-0" />
                    )}
                </button>
                <button
                    onClick={onEliminar}
                    className="p-2 text-[var(--color-danger)] hover:bg-[var(--gray-300)] rounded transition-colors flex-shrink-0"
                    title="Eliminar formato"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Contenido expandido */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[var(--gray-300)]">
                    <p className="text-[var(--gray-100)] text-sm mb-3">
                        {formato.descripcion}
                    </p>

                    {/* Errores */}
                    {formato.errores && (
                        <ErrorDisplay errores={formato.errores} className="mb-3" />
                    )}

                    {/* Inputs de edición */}
                    <FormatoFormFields
                        formato={formato}
                        cantidadEquipos={cantidadEquipos}
                        onPosicionDesdeChange={(valor) => onActualizar('posicion_desde', valor)}
                        onPosicionHastaChange={(valor) => onActualizar('posicion_hasta', valor)}
                        onDescripcionChange={(valor) => onActualizar('descripcion', valor)}
                        onColorChange={(valor) => onActualizar('color', valor)}
                        showSuperposicionError={false}
                        showColorLabel={true}
                    />
                </div>
            )}
        </div>
    );
};

