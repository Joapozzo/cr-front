/**
 * Hook para manejar el estado y validación del formulario de categoría
 * Responsabilidad: Estado del formulario, detección automática de cambios, validación
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CategoriaEdicionConfig } from '../types/configuracion.types';
import { getChangedFields, getDefaultConfig } from '../utils/categoriaUtils';

interface UseCategoriaFormReturn {
    config: CategoriaEdicionConfig;
    hasChanges: boolean;
    changedFields: Partial<CategoriaEdicionConfig>;
    updateField: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
    resetForm: () => void;
}

/**
 * Hook para manejar el formulario de configuración de categoría
 * @param initialConfig - Configuración inicial (del API o del store)
 */
export function useCategoriaForm(
    initialConfig?: CategoriaEdicionConfig | null
): UseCategoriaFormReturn {
    // Mantener referencia inmutable a la configuración inicial
    const initialConfigRef = useRef<CategoriaEdicionConfig>(
        initialConfig || getDefaultConfig()
    );

    const [config, setConfig] = useState<CategoriaEdicionConfig>(
        initialConfig || getDefaultConfig()
    );

    // Actualizar valores iniciales si cambian (cuando llegan nuevos datos del API)
    useEffect(() => {
        if (initialConfig) {
            // Solo actualizar si realmente cambió (evitar re-renders innecesarios)
            const currentInitial = initialConfigRef.current;
            const changedConfigFields = getChangedFields(initialConfig, currentInitial);
            
            if (Object.keys(changedConfigFields).length > 0) {
                initialConfigRef.current = initialConfig;
                setConfig(initialConfig);
            }
        }
    }, [initialConfig]);

    // Auto-detectar cambios con comparación profunda
    const hasChanges = useMemo(() => {
        return Object.keys(getChangedFields(config, initialConfigRef.current)).length > 0;
    }, [config]);

    // Obtener solo los campos modificados
    const changedFields = useMemo(() => {
        return getChangedFields(config, initialConfigRef.current);
    }, [config]);

    // Handler genérico para actualizar cualquier campo
    const updateField = useCallback(<K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    }, []);

    // Resetear formulario a valores iniciales
    const resetForm = useCallback(() => {
        setConfig(initialConfigRef.current);
    }, []);

    return {
        config,
        hasChanges,
        changedFields,
        updateField,
        resetForm,
    };
}

