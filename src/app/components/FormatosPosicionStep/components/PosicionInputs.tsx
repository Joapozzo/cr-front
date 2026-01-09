/**
 * Componente reutilizable para inputs de posiciones
 */

import React from 'react';
import { Input } from '../../ui/Input';

interface PosicionInputsProps {
    posicionDesde: number;
    posicionHasta: number;
    cantidadEquipos: number;
    onPosicionDesdeChange: (valor: number) => void;
    onPosicionHastaChange: (valor: number) => void;
    errorDesde?: string;
    errorHasta?: string;
    labelDesde?: string;
    labelHasta?: string;
}

export const PosicionInputs: React.FC<PosicionInputsProps> = ({
    posicionDesde,
    posicionHasta,
    cantidadEquipos,
    onPosicionDesdeChange,
    onPosicionHastaChange,
    errorDesde,
    errorHasta,
    labelDesde = 'Desde',
    labelHasta = 'Hasta',
}) => {
    return (
        <>
            <Input
                type="number"
                label={labelDesde}
                min={1}
                max={cantidadEquipos}
                value={posicionDesde.toString()}
                onChange={(e) => onPosicionDesdeChange(parseInt(e.target.value) || 1)}
                error={errorDesde}
            />
            <Input
                type="number"
                label={labelHasta}
                min={posicionDesde}
                max={cantidadEquipos}
                value={posicionHasta.toString()}
                onChange={(e) => onPosicionHastaChange(parseInt(e.target.value) || 1)}
                error={errorHasta}
            />
        </>
    );
};

