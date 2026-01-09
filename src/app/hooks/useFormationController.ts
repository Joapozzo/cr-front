import { useState, useEffect, useCallback } from 'react';
import { FORMACIONES_DISPONIBLES } from '../utils/formacionesDT';

type FormacionKey = keyof typeof FORMACIONES_DISPONIBLES;

interface UseFormationControllerProps {
    initialFormation?: string;
    onFormationChange?: (formacion: string) => void;
}

/**
 * Verifica si una cadena es una clave válida de FORMACIONES_DISPONIBLES
 */
function isValidFormationKey(key: string): key is FormacionKey {
    return key in FORMACIONES_DISPONIBLES;
}

/**
 * Hook que maneja el estado y lógica de las formaciones
 */
export const useFormationController = ({
    initialFormation = '1-2-3-1',
    onFormationChange,
}: UseFormationControllerProps = {}) => {
    const [formacionNombre, setFormacionNombre] = useState<string>(initialFormation);
    const [formacionActual, setFormacionActual] = useState<number[]>(() => {
        if (isValidFormationKey(initialFormation)) {
            return FORMACIONES_DISPONIBLES[initialFormation];
        }
        return [1, 2, 3, 1];
    });

    // Sincronizar con initialFormation cuando cambia
    useEffect(() => {
        if (initialFormation && isValidFormationKey(initialFormation)) {
            setFormacionNombre(initialFormation);
            setFormacionActual(FORMACIONES_DISPONIBLES[initialFormation]);
        }
    }, [initialFormation]);

    const cambiarFormacion = useCallback(
        (nombre: string) => {
            if (isValidFormationKey(nombre)) {
                const nuevaFormacion = FORMACIONES_DISPONIBLES[nombre];
                setFormacionNombre(nombre);
                setFormacionActual(nuevaFormacion);
                onFormationChange?.(nombre);
            }
        },
        [onFormationChange]
    );

    // Notificar cambio inicial
    useEffect(() => {
        onFormationChange?.(formacionNombre);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        formacionNombre,
        formacionActual,
        cambiarFormacion,
    };
};

