import { useState, useEffect, useCallback } from 'react';
import { EdicionSeleccionada } from '@/app/stores/edicionStore';

export interface EdicionConfig {
    nombre: string;
    temporada: number;
    cantidad_eventuales: number;
    partidos_eventuales: number;
    apercibimientos: number;
    puntos_descuento: number;
    img: string;
}

interface UseEdicionConfigProps {
    edicionSeleccionada: EdicionSeleccionada | null;
    imagenPreview: string | null;
}

interface UseEdicionConfigReturn {
    config: EdicionConfig;
    hasChanges: boolean;
    handleInputChange: (field: keyof EdicionConfig, value: string | number) => void;
    resetConfig: () => void;
    getDatosActualizar: () => Partial<{
        nombre: string;
        temporada: number;
        cantidad_eventuales: number;
        partidos_eventuales: number;
        apercibimientos: number;
        puntos_descuento: number;
    }>;
}

export const useEdicionConfig = ({
    edicionSeleccionada,
    imagenPreview,
}: UseEdicionConfigProps): UseEdicionConfigReturn => {
    const [config, setConfig] = useState<EdicionConfig>({
        nombre: 'Apertura',
        temporada: 2025,
        cantidad_eventuales: 5,
        partidos_eventuales: -1,
        apercibimientos: 5,
        puntos_descuento: 1,
        img: '/images/edicion-default.jpg',
    });

    const detectChanges = useCallback(
        (newConfig: EdicionConfig): boolean => {
            if (!edicionSeleccionada) return false;

            return (
                newConfig.nombre !== edicionSeleccionada.nombre ||
                newConfig.temporada !== edicionSeleccionada.temporada ||
                newConfig.cantidad_eventuales !== edicionSeleccionada.cantidad_eventuales ||
                newConfig.partidos_eventuales !== edicionSeleccionada.partidos_eventuales ||
                newConfig.apercibimientos !== edicionSeleccionada.apercibimientos ||
                newConfig.puntos_descuento !== edicionSeleccionada.puntos_descuento ||
                !!imagenPreview
            );
        },
        [edicionSeleccionada, imagenPreview]
    );

    const [hasChanges, setHasChanges] = useState(false);

    const handleInputChange = useCallback(
        (field: keyof EdicionConfig, value: string | number) => {
            const newConfig = { ...config, [field]: value };
            setConfig(newConfig);
            setHasChanges(detectChanges(newConfig));
        },
        [config, detectChanges]
    );

    const resetConfig = useCallback(() => {
        if (edicionSeleccionada) {
            const newConfig = {
                nombre: edicionSeleccionada.nombre || 'Apertura',
                temporada: edicionSeleccionada.temporada || 2025,
                cantidad_eventuales: edicionSeleccionada.cantidad_eventuales || 5,
                partidos_eventuales: edicionSeleccionada.partidos_eventuales || -1,
                apercibimientos: edicionSeleccionada.apercibimientos || 5,
                puntos_descuento: edicionSeleccionada.puntos_descuento || 1,
                img: edicionSeleccionada.img || '/images/edicion-default.jpg',
            };
            setConfig(newConfig);
            setHasChanges(false);
        }
    }, [edicionSeleccionada]);

    const getDatosActualizar = useCallback((): Partial<{
        nombre: string;
        temporada: number;
        cantidad_eventuales: number;
        partidos_eventuales: number;
        apercibimientos: number;
        puntos_descuento: number;
    }> => {
        if (!edicionSeleccionada) return {};

        const datosActualizar: Partial<{
            nombre: string;
            temporada: number;
            cantidad_eventuales: number;
            partidos_eventuales: number;
            apercibimientos: number;
            puntos_descuento: number;
        }> = {};

        if (config.nombre !== edicionSeleccionada.nombre) {
            datosActualizar.nombre = config.nombre;
        }
        if (config.temporada !== edicionSeleccionada.temporada) {
            datosActualizar.temporada = config.temporada;
        }
        if (config.cantidad_eventuales !== edicionSeleccionada.cantidad_eventuales) {
            datosActualizar.cantidad_eventuales = config.cantidad_eventuales;
        }
        if (config.partidos_eventuales !== edicionSeleccionada.partidos_eventuales) {
            datosActualizar.partidos_eventuales = config.partidos_eventuales;
        }
        if (config.apercibimientos !== edicionSeleccionada.apercibimientos) {
            datosActualizar.apercibimientos = config.apercibimientos;
        }
        if (config.puntos_descuento !== edicionSeleccionada.puntos_descuento) {
            datosActualizar.puntos_descuento = config.puntos_descuento;
        }

        return datosActualizar;
    }, [config, edicionSeleccionada]);

    // Sincronizar config cuando cambia edicionSeleccionada
    useEffect(() => {
        resetConfig();
    }, [edicionSeleccionada, resetConfig]);

    // Actualizar hasChanges cuando cambia imagenPreview
    useEffect(() => {
        setHasChanges(detectChanges(config));
    }, [imagenPreview, config, detectChanges]);

    return {
        config,
        hasChanges,
        handleInputChange,
        resetConfig,
        getDatosActualizar,
    };
};

