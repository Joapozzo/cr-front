/**
 * Componente reutilizable para campos del formulario de formato
 */

import React from 'react';
import { Input } from '../../ui/Input';
import { PosicionInputs } from './PosicionInputs';
import { ColorSelector } from './ColorSelector';
import { ErrorDisplay } from './ErrorDisplay';
import { FormatoTemporal } from '../types';
import { LIMITES } from '../constants';

interface FormatoFormFieldsProps {
    formato: FormatoTemporal;
    cantidadEquipos: number;
    onPosicionDesdeChange: (valor: number) => void;
    onPosicionHastaChange: (valor: number) => void;
    onDescripcionChange: (valor: string) => void;
    onColorChange: (valor: string) => void;
    showSuperposicionError?: boolean;
    labelPosicionDesde?: string;
    labelPosicionHasta?: string;
    labelDescripcion?: string;
    placeholderDescripcion?: string;
    showColorLabel?: boolean;
}

export const FormatoFormFields: React.FC<FormatoFormFieldsProps> = ({
    formato,
    cantidadEquipos,
    onPosicionDesdeChange,
    onPosicionHastaChange,
    onDescripcionChange,
    onColorChange,
    showSuperposicionError = true,
    labelPosicionDesde = 'Desde',
    labelPosicionHasta = 'Hasta',
    labelDescripcion = 'Descripción',
    placeholderDescripcion,
    showColorLabel = true,
}) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            <PosicionInputs
                posicionDesde={formato.posicion_desde}
                posicionHasta={formato.posicion_hasta}
                cantidadEquipos={cantidadEquipos}
                onPosicionDesdeChange={onPosicionDesdeChange}
                onPosicionHastaChange={onPosicionHastaChange}
                errorDesde={formato.errores?.posicion_desde}
                errorHasta={formato.errores?.posicion_hasta}
                labelDesde={labelPosicionDesde}
                labelHasta={labelPosicionHasta}
            />
            <div className="col-span-2">
                <Input
                    type="text"
                    label={labelDescripcion}
                    maxLength={LIMITES.DESCRIPCION_MAX_LENGTH}
                    value={formato.descripcion}
                    onChange={(e) => onDescripcionChange(e.target.value)}
                    placeholder={placeholderDescripcion}
                    error={formato.errores?.descripcion}
                />
            </div>
            <div className="col-span-2">
                <ColorSelector
                    colorSeleccionado={formato.color}
                    onColorChange={onColorChange}
                    label={showColorLabel ? 'Color' : undefined}
                />
            </div>
            {showSuperposicionError && formato.errores?.superposicion && (
                <div className="col-span-2">
                    <ErrorDisplay
                        errores={{ superposicion: formato.errores.superposicion }}
                    />
                </div>
            )}
        </div>
    );
};

