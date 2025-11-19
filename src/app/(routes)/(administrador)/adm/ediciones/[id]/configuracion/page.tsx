'use client';

import { useEffect, useState, useRef } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import Select, { SelectOption } from '@/app/components/ui/Select';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useActualizarEdicion } from '@/app/hooks/useEdiciones';
import { convertirABase64 } from '@/app/services/upload.service';
import { AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EdicionConfig {
    nombre: string;
    temporada: number;
    cantidad_eventuales: number;
    partidos_eventuales: number;
    apercibimientos: number;
    puntos_descuento: number;
    img: string;
    imagen_base64?: string | null; // Nueva imagen en base64 (solo para envío)
}

const ConfiguracionPage = () => {
    const { edicionSeleccionada } = useEdicionStore();
    const { mutate: actualizarEdicion } = useActualizarEdicion();

    const [config, setConfig] = useState<EdicionConfig>({
        nombre: 'Apertura',
        temporada: 2025,
        cantidad_eventuales: 5,
        partidos_eventuales: -1,
        apercibimientos: 5,
        puntos_descuento: 1,
        img: '/images/edicion-default.jpg',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE_MB = 5; // Máximo 5MB

    const temporadaOptions: SelectOption[] = [
        { value: 2030, label: '2030' },
        { value: 2029, label: '2029' },
        { value: 2028, label: '2028' },
        { value: 2027, label: '2027' },
        { value: 2026, label: '2026' },
        { value: 2025, label: '2025' },
        { value: 2024, label: '2024' },
        { value: 2023, label: '2023' },
        { value: 2022, label: '2022' },
    ];

    const eventualOptions: SelectOption[] = [
        { value: -1, label: 'Sin límite' },
        { value: 1, label: '1 jugador' },
        { value: 2, label: '2 jugadores' },
        { value: 3, label: '3 jugadores' },
        { value: 4, label: '4 jugadores' },
        { value: 5, label: '5 jugadores' },
    ];

    const apercibimientosOptions: SelectOption[] = [
        { value: 1, label: '1 apercibimiento' },
        { value: 2, label: '2 apercibimientos' },
        { value: 3, label: '3 apercibimientos' },
        { value: 4, label: '4 apercibimientos' },
        { value: 5, label: '5 apercibimientos' },
        { value: 6, label: '6 apercibimientos' },
    ];

    const puntosOptions: SelectOption[] = [
        { value: 1, label: '1 punto' },
        { value: 2, label: '2 puntos' },
        { value: 3, label: '3 puntos' },
    ];

    const handleInputChange = (field: keyof EdicionConfig, value: string | number) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        setHasChanges(detectChanges(newConfig));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo (solo PNG)
        if (file.type !== 'image/png') {
            toast.error('Solo se permiten archivos PNG');
            setImagenFile(null);
            setImagenPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validar tamaño (máximo 5MB antes de comprimir)
        const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB`);
            setImagenFile(null);
            setImagenPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setImagenFile(file);

        try {
            // Convertir a Base64 para preview y envío
            const base64 = await convertirABase64(file);
            setImagenPreview(base64);
            setHasChanges(true); // Marcar como cambios
        } catch (error) {
            console.error('Error al procesar imagen:', error);
            toast.error('Error al procesar la imagen');
            setImagenFile(null);
            setImagenPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        setImagenFile(null);
        setImagenPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // Verificar si hay otros cambios
        setHasChanges(detectChanges(config));
    };

    const handleSubmit = async () => {
        if (!edicionSeleccionada?.id_edicion) {
            toast.error('No se encontró la edición a actualizar');
            return;
        }

        setIsLoading(true);
        try {
            // Preparar datos - solo enviar lo que cambió
            const datosActualizar: Partial<{
                nombre: string;
                temporada: number;
                cantidad_eventuales: number;
                partidos_eventuales: number;
                apercibimientos: number;
                puntos_descuento: number;
                imagen_base64: string;
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
                datosActualizar.partidos_eventuales = config.partidos_eventuales
            }
            if (config.apercibimientos !== edicionSeleccionada.apercibimientos) {
                datosActualizar.apercibimientos = config.apercibimientos;
            }
            if (config.puntos_descuento !== edicionSeleccionada.puntos_descuento) {
                datosActualizar.puntos_descuento = config.puntos_descuento;
            }

            // Si hay una nueva imagen, agregarla
            if (imagenPreview) {
                datosActualizar.imagen_base64 = imagenPreview;
            }

            // Verificar que hay cambios
            if (Object.keys(datosActualizar).length === 0) {
                toast('No hay cambios para guardar', { icon: 'ℹ️' });
                setIsLoading(false);
                return;
            }

            // ← AGREGAR DELAY PARA VER LOADING
            await new Promise(resolve => setTimeout(resolve, 1200));

            actualizarEdicion(
                { id: edicionSeleccionada.id_edicion, data: datosActualizar },
                {
                    onSuccess: () => {
                        toast.success('Edición actualizada exitosamente');
                        setHasChanges(false); // ← RESETEAR CAMBIOS
                        setImagenFile(null);
                        setImagenPreview(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al actualizar la edición');
                        setIsLoading(false);
                    },
                    onSettled: () => {
                        setIsLoading(false);
                    }
                }
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error inesperado');
            setIsLoading(false);
        }
    };

    const detectChanges = (newConfig: EdicionConfig) => {
        if (!edicionSeleccionada) return false;

        return (
            newConfig.nombre !== edicionSeleccionada.nombre ||
            newConfig.temporada !== edicionSeleccionada.temporada ||
            newConfig.cantidad_eventuales !== edicionSeleccionada.cantidad_eventuales ||
            newConfig.partidos_eventuales !== edicionSeleccionada.partidos_eventuales ||
            newConfig.apercibimientos !== edicionSeleccionada.apercibimientos ||
            newConfig.puntos_descuento !== edicionSeleccionada.puntos_descuento ||
            !!imagenPreview // Si hay una nueva imagen, hay cambios
        );
    };

    useEffect(() => {
        if (edicionSeleccionada) {
            const newConfig = {
                nombre: edicionSeleccionada.nombre || 'Apertura',
                temporada: edicionSeleccionada.temporada || 2025,
                cantidad_eventuales: edicionSeleccionada.cantidad_eventuales || 5,
                partidos_eventuales: edicionSeleccionada.partidos_eventuales || -1,
                apercibimientos: edicionSeleccionada.apercibimientos || 5,
                puntos_descuento: edicionSeleccionada.puntos_descuento || 1,
                img: edicionSeleccionada.img || '/images/edicion-default.jpg',
                imagen_base64: null,
            };
            setConfig(newConfig);
            setHasChanges(false);
            setImagenFile(null);
            setImagenPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [edicionSeleccionada]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Configuración de la edición {edicionSeleccionada?.nombre || ""}
                </h1>
                <p className="text-[var(--gray-100)] text-sm">
                    Configura los parámetros generales de la edición
                </p>
            </div>

            {/* Formulario de configuración */}
            <div className="rounded-lg w-[70%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <Input
                        label="NOMBRE"
                        value={config.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Nombre de la edición"
                        className="text-[var(--white)] py-3"
                    />

                    {/* Temporada */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            TEMPORADA
                        </label>
                        <Select
                            options={temporadaOptions}
                            value={config.temporada}
                            onChange={(value) =>
                                handleInputChange("temporada", value as number)
                            }
                            placeholder="Seleccionar temporada"
                        />
                    </div>

                    {/* Cantidad de eventuales */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            CANTIDAD DE EVENTUALES
                        </label>
                        <Select
                            options={[
                                { value: 1, label: "1 jugadores" },
                                { value: 2, label: "2 jugadores" },
                                { value: 3, label: "3 jugadores" },
                                { value: 4, label: "4 jugadores" },
                                { value: 5, label: "5 jugadores" },
                            ]}
                            value={config.cantidad_eventuales}
                            onChange={(value) =>
                                handleInputChange("cantidad_eventuales", value as number)
                            }
                            placeholder="Seleccionar cantidad"
                        />
                    </div>

                    {/* Partidos por eventual */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            PARTIDOS POR EVENTUAL
                        </label>
                        <Select
                            options={eventualOptions}
                            value={config.partidos_eventuales}
                            onChange={(value) =>
                                handleInputChange("partidos_eventuales", value as number)
                            }
                            placeholder="Seleccionar límite"
                        />
                    </div>

                    {/* Apercibimientos */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            APERCIBIMIENTOS
                        </label>
                        <Select
                            options={apercibimientosOptions}
                            value={config.apercibimientos}
                            onChange={(value) =>
                                handleInputChange("apercibimientos", value as number)
                            }
                            placeholder="Seleccionar apercibimientos"
                        />
                    </div>

                    {/* Puntos por apercibimientos */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            PUNTOS POR APERCIBIMIENTOS
                        </label>
                        <Select
                            options={puntosOptions}
                            value={config.puntos_descuento}
                            onChange={(value) =>
                                handleInputChange("puntos_descuento", value as number)
                            }
                            placeholder="Seleccionar puntos"
                        />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-4">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            IMAGEN DE LA EDICIÓN
                        </label>

                        {/* Información sobre formato de imagen */}
                        <div className="p-4 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-[var(--blue)] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-[var(--blue)] mb-1">
                                        Requisitos de la imagen
                                    </h4>
                                    <ul className="text-xs text-[var(--gray-100)] space-y-1">
                                        <li>• Formato: <strong>PNG</strong> únicamente</li>
                                        <li>• Tamaño máximo: <strong>{MAX_FILE_SIZE_MB}MB</strong></li>
                                        <li>• Dimensiones recomendadas: 1920x1080px</li>
                                        <li>• <strong>Debe ser sin fondo (transparente)</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Preview de la imagen */}
                        <div className="flex items-start gap-4">
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-[var(--gray-300)] border-2 border-[var(--gray-200)]">
                                {(imagenPreview || edicionSeleccionada?.img) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imagenPreview || edicionSeleccionada?.img || '/logo-edicion.png'}
                                        alt="Preview de edición"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/logo-edicion.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--gray-300)]">
                                        <span className="text-[var(--gray-100)] text-xs text-center px-2">Sin imagen</span>
                                    </div>
                                )}
                                {imagenPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--red)] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                        disabled={isLoading}
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                )}
                            </div>

                            {/* Input de archivo */}
                            <div className="flex flex-col gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imagen-upload"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="imagen-upload"
                                    className={`cursor-pointer bg-[var(--gray-200)] hover:bg-[var(--gray-100)] text-[var(--black)] px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {imagenFile ? 'Cambiar imagen' : 'Seleccionar imagen PNG'}
                                </label>
                                {imagenFile && (
                                    <p className="text-xs text-[var(--gray-100)]">
                                        Archivo: {imagenFile.name} ({(imagenFile.size / 1024 / 1024).toFixed(2)}MB)
                                    </p>
                                )}
                                <p className="text-xs text-[var(--gray-100)]">PNG únicamente, máx. {MAX_FILE_SIZE_MB}MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de actualizar */}
                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={!hasChanges || isLoading} // ← Deshabilitar si no hay cambios
                        className={`px-8 transition-colors ${hasChanges
                                ? "bg-[var(--green)] hover:bg-[var(--green-win)] text-white"
                                : "bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Actualizando..." : "Actualizar edición"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracionPage;