/**
 * Componente de presentación para el formulario de nuevo formato
 */

import React from 'react';
import { Button } from '../../ui/Button';
import { FormatoTemporal } from '../types';
import { FormatoFormFields } from './FormatoFormFields';

interface FormularioNuevoFormatoProps {
    formatoNuevo: FormatoTemporal;
    cantidadEquipos: number;
    onFormatoNuevoChange: (formato: FormatoTemporal) => void;
    onAgregar: () => void;
    onCancelar: () => void;
}

export const FormularioNuevoFormato: React.FC<FormularioNuevoFormatoProps> = ({
    formatoNuevo,
    cantidadEquipos,
    onFormatoNuevoChange,
    onAgregar,
    onCancelar,
}) => {
    return (
        <div className="mt-4 p-4 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-500)]">
            <h4 className="text-[var(--white)] font-medium mb-3 text-sm">
                Nuevo formato de posición
            </h4>
            <FormatoFormFields
                formato={formatoNuevo}
                cantidadEquipos={cantidadEquipos}
                onPosicionDesdeChange={(valor) =>
                    onFormatoNuevoChange({ ...formatoNuevo, posicion_desde: valor })
                }
                onPosicionHastaChange={(valor) =>
                    onFormatoNuevoChange({ ...formatoNuevo, posicion_hasta: valor })
                }
                onDescripcionChange={(valor) =>
                    onFormatoNuevoChange({ ...formatoNuevo, descripcion: valor })
                }
                onColorChange={(valor) =>
                    onFormatoNuevoChange({ ...formatoNuevo, color: valor })
                }
                labelPosicionDesde="Posición desde *"
                labelPosicionHasta="Posición hasta *"
                labelDescripcion="Descripción *"
                placeholderDescripcion="Ej: Clasifican a Semifinales"
                showSuperposicionError={true}
                showColorLabel={true}
            />
            <div className="flex gap-2 mt-4">
                <Button onClick={onAgregar} variant="success" size="sm">
                    Agregar
                </Button>
                <Button onClick={onCancelar} variant="default" size="sm">
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

