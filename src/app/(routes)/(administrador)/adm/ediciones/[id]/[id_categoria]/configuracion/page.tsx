'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import Select, { SelectOption } from '@/app/components/ui/Select';
import Switch from '@/app/components/ui/Switch';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useActualizarCategoriaEdicion, useActualizarPublicadaCategoria, useCategoriaEdicionPorId } from '@/app/hooks/useCategorias';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { convertDateToISO, formatISOToDateInput } from '@/app/utils/fechas';

interface CategoriaEdicionConfig {
    tipo_futbol: number;
    duracion_tiempo: number;
    duracion_entretiempo: number;
    puntos_victoria: number;
    puntos_empate: number;
    puntos_derrota: number;
    fecha_inicio_mercado?: string;
    fecha_fin_mercado?: string;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
}

const ConfiguracionCategoriaPage = () => {
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();
    const { mutate: actualizarCategoriaEdicion } = useActualizarCategoriaEdicion();
    const { mutate: actualizarPublicada, isPending: isUpdatingPublicada } = useActualizarPublicadaCategoria();
    
    // Obtener datos completos de la categoría para asegurar que tenemos las fechas
    const { data: categoriaCompleta } = useCategoriaEdicionPorId(
        categoriaSeleccionada?.id_categoria_edicion || 0,
        { enabled: !!categoriaSeleccionada?.id_categoria_edicion }
    );
    
    const isPublicada = categoriaSeleccionada?.publicada === 'S';

    const [config, setConfig] = useState<CategoriaEdicionConfig>({
        tipo_futbol: 7,
        duracion_tiempo: 25,
        duracion_entretiempo: 5,
        puntos_victoria: 3,
        puntos_empate: 1,
        puntos_derrota: 0,
        fecha_inicio_mercado: '',
        fecha_fin_mercado: '',
        limite_cambios: null,
        recambio: null,
        color: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const tipoFutbolOptions: SelectOption[] = [
        { value: 5, label: 'Fútbol 5' },
        { value: 7, label: 'Fútbol 7' },
        { value: 11, label: 'Fútbol 11' },
    ];

    const puntosOptions: SelectOption[] = [
        { value: 0, label: '0 puntos' },
        { value: 1, label: '1 punto' },
        { value: 2, label: '2 puntos' },
        { value: 3, label: '3 puntos' },
        { value: 4, label: '4 puntos' },
        { value: 5, label: '5 puntos' },
    ];

    const handleInputChange = (field: keyof CategoriaEdicionConfig, value: string | number | boolean | null) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        setHasChanges(detectChanges(newConfig));
    };

    const handleSubmit = async () => {

        if (!categoriaSeleccionada?.id_categoria_edicion) {
            toast.error('No se encontró la categoría a actualizar');
            return;
        }

        setIsLoading(true);
        try {
            const datosActualizar: Record<string, string | number | boolean | null | undefined> = {};

            if (config.tipo_futbol !== categoriaSeleccionada.tipo_futbol) {
                datosActualizar.tipo_futbol = config.tipo_futbol;
            }
            if (config.duracion_tiempo !== categoriaSeleccionada.duracion_tiempo) {
                datosActualizar.duracion_tiempo = config.duracion_tiempo;
            }
            if (config.duracion_entretiempo !== categoriaSeleccionada.duracion_entretiempo) {
                datosActualizar.duracion_entretiempo = config.duracion_entretiempo;
            }
            if (config.puntos_victoria !== categoriaSeleccionada.puntos_victoria) {
                datosActualizar.puntos_victoria = config.puntos_victoria;
            }
            if (config.puntos_empate !== categoriaSeleccionada.puntos_empate) {
                datosActualizar.puntos_empate = config.puntos_empate;
            }
            if (config.puntos_derrota !== categoriaSeleccionada.puntos_derrota) {
                datosActualizar.puntos_derrota = config.puntos_derrota;
            }

            const original_fecha_inicio = formatISOToDateInput(categoriaSeleccionada.fecha_inicio_mercado);
            const original_fecha_fin = formatISOToDateInput(categoriaSeleccionada.fecha_fin_mercado);

            if (config.fecha_inicio_mercado !== original_fecha_inicio) {
                // Convertir la fecha "YYYY-MM-DD" a un string ISO completo
                datosActualizar.fecha_inicio_mercado = convertDateToISO(config.fecha_inicio_mercado);
            }

            if (config.fecha_fin_mercado !== original_fecha_fin) {
                // Convertir la fecha "YYYY-MM-DD" a un string ISO completo
                datosActualizar.fecha_fin_mercado = convertDateToISO(config.fecha_fin_mercado);
            }
            if (config.limite_cambios !== categoriaSeleccionada.limite_cambios) {
                datosActualizar.limite_cambios = config.limite_cambios;
            }
            if (config.recambio !== categoriaSeleccionada.recambio) {
                datosActualizar.recambio = config.recambio;
            }
            if (config.color !== categoriaSeleccionada.color) {
                datosActualizar.color = config.color;
            }
            if (Object.keys(datosActualizar).length === 0) {
                toast.error('No hay cambios para guardar');
                return;
            }

            // Delay para ver loading
            await new Promise(resolve => setTimeout(resolve, 1200));

            actualizarCategoriaEdicion(
                { id_categoria_edicion: categoriaSeleccionada.id_categoria_edicion, data: datosActualizar },
                {
                    onSuccess: () => {
                        toast.success('Categoría actualizada exitosamente');
                        setHasChanges(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al actualizar la categoría');
                    }
                }
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const detectChanges = (newConfig: CategoriaEdicionConfig) => {
        if (!categoriaSeleccionada) return false;

        return (
            newConfig.tipo_futbol !== categoriaSeleccionada.tipo_futbol ||
            newConfig.duracion_tiempo !== categoriaSeleccionada.duracion_tiempo ||
            newConfig.duracion_entretiempo !== categoriaSeleccionada.duracion_entretiempo ||
            newConfig.puntos_victoria !== categoriaSeleccionada.puntos_victoria ||
            newConfig.puntos_empate !== categoriaSeleccionada.puntos_empate ||
            newConfig.puntos_derrota !== categoriaSeleccionada.puntos_derrota ||
            newConfig.fecha_inicio_mercado !== categoriaSeleccionada.fecha_inicio_mercado ||
            newConfig.fecha_fin_mercado !== categoriaSeleccionada.fecha_fin_mercado ||
            newConfig.limite_cambios !== categoriaSeleccionada.limite_cambios ||
            newConfig.recambio !== categoriaSeleccionada.recambio ||
            newConfig.color !== categoriaSeleccionada.color
        );
    };

    // Actualizar el store cuando se carguen los datos completos de la categoría
    useEffect(() => {
        if (categoriaCompleta?.configuracion && categoriaSeleccionada) {
            const configuracion = categoriaCompleta.configuracion;
            
            // Verificar si realmente hay cambios antes de actualizar para evitar loops
            const hasChanges = 
                categoriaSeleccionada.tipo_futbol !== configuracion.tipo_futbol ||
                categoriaSeleccionada.duracion_tiempo !== configuracion.duracion_tiempo ||
                categoriaSeleccionada.duracion_entretiempo !== configuracion.duracion_entretiempo ||
                categoriaSeleccionada.puntos_victoria !== configuracion.puntos_victoria ||
                categoriaSeleccionada.puntos_empate !== configuracion.puntos_empate ||
                categoriaSeleccionada.puntos_derrota !== configuracion.puntos_derrota ||
                categoriaSeleccionada.fecha_inicio_mercado !== (configuracion.fecha_inicio_mercado || undefined) ||
                categoriaSeleccionada.fecha_fin_mercado !== (configuracion.fecha_fin_mercado || undefined) ||
                categoriaSeleccionada.limite_cambios !== (configuracion.limite_cambios ?? null) ||
                categoriaSeleccionada.recambio !== (configuracion.recambio ?? null) ||
                categoriaSeleccionada.color !== (configuracion.color ?? null);
            
            if (hasChanges) {
                setCategoriaSeleccionada({
                    ...categoriaSeleccionada,
                    tipo_futbol: configuracion.tipo_futbol,
                    duracion_tiempo: configuracion.duracion_tiempo,
                    duracion_entretiempo: configuracion.duracion_entretiempo,
                    puntos_victoria: configuracion.puntos_victoria,
                    puntos_empate: configuracion.puntos_empate,
                    puntos_derrota: configuracion.puntos_derrota,
                    fecha_inicio_mercado: configuracion.fecha_inicio_mercado || undefined,
                    fecha_fin_mercado: configuracion.fecha_fin_mercado || undefined,
                    limite_cambios: configuracion.limite_cambios ?? null,
                    recambio: configuracion.recambio ?? null,
                    color: configuracion.color ?? null,
                });
            }
        }
    }, [categoriaCompleta, setCategoriaSeleccionada]);

    // Inicializar el formulario con los datos de la categoría
    useEffect(() => {
        // Usar datos completos si están disponibles, sino usar los del store
        const configuracion = categoriaCompleta?.configuracion;
        const datosCategoria = configuracion || categoriaSeleccionada;
        
        if (datosCategoria) {
            const newConfig = {
                tipo_futbol: datosCategoria.tipo_futbol || 7,
                duracion_tiempo: datosCategoria.duracion_tiempo || 25,
                duracion_entretiempo: datosCategoria.duracion_entretiempo || 5,
                puntos_victoria: datosCategoria.puntos_victoria || 3,
                puntos_empate: datosCategoria.puntos_empate || 1,
                puntos_derrota: datosCategoria.puntos_derrota || 0,
                fecha_inicio_mercado: formatISOToDateInput(
                    configuracion?.fecha_inicio_mercado || categoriaSeleccionada?.fecha_inicio_mercado
                ),
                fecha_fin_mercado: formatISOToDateInput(
                    configuracion?.fecha_fin_mercado || categoriaSeleccionada?.fecha_fin_mercado
                ),
                limite_cambios: (configuracion?.limite_cambios ?? categoriaSeleccionada?.limite_cambios) ?? null,
                recambio: (configuracion?.recambio ?? categoriaSeleccionada?.recambio) ?? null,
                color: (configuracion?.color ?? categoriaSeleccionada?.color) ?? null,
            };
            setConfig(newConfig);
            setHasChanges(false);
        }
    }, [categoriaCompleta, categoriaSeleccionada]);

    const handleTogglePublicada = () => {
        if (!categoriaSeleccionada?.id_categoria_edicion) return;
        
        const nuevoEstado: 'S' | 'N' = isPublicada ? 'N' : 'S';
        
        actualizarPublicada(
            { id_categoria_edicion: categoriaSeleccionada.id_categoria_edicion, publicada: nuevoEstado },
            {
                onSuccess: () => {
                    toast.success(nuevoEstado === 'S' ? 'Categoría publicada exitosamente' : 'Categoría despublicada exitosamente');
                    // Actualizar el store
                    if (categoriaSeleccionada) {
                        const { setCategoriaSeleccionada } = useCategoriaStore.getState();
                        setCategoriaSeleccionada({
                            ...categoriaSeleccionada,
                            publicada: nuevoEstado
                        });
                    }
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al actualizar el estado de publicación');
                }
            }
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Configuración de la categoría {categoriaSeleccionada?.nombre_completo || ""}
                    </h1>
                    <p className="text-[var(--gray-100)] text-sm">
                        Configura los parámetros de la categoría
                    </p>
                </div>
                <Button
                    variant={isPublicada ? "default" : "success"}
                    onClick={handleTogglePublicada}
                    disabled={isUpdatingPublicada}
                    className="flex items-center gap-2"
                >
                    {isPublicada ? (
                        <>
                            <EyeOff className="w-4 h-4" />
                            <span>Despublicar</span>
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            <span>Publicar</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Formulario de configuración */}
            <div className="rounded-lg w-[70%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de fútbol */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            TIPO DE FÚTBOL
                        </label>
                        <Select
                            options={tipoFutbolOptions}
                            value={config.tipo_futbol}
                            onChange={(value) => handleInputChange("tipo_futbol", value as number)}
                            placeholder="Seleccionar tipo"
                        />
                    </div>

                    {/* Puntos Victoria */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            PUNTOS VICTORIA
                        </label>
                        <Select
                            options={puntosOptions}
                            value={config.puntos_victoria}
                            onChange={(value) => handleInputChange("puntos_victoria", value as number)}
                            placeholder="Puntos por victoria"
                        />
                    </div>

                    {/* Puntos Empate */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            PUNTOS EMPATE
                        </label>
                        <Select
                            options={puntosOptions}
                            value={config.puntos_empate}
                            onChange={(value) => handleInputChange("puntos_empate", value as number)}
                            placeholder="Puntos por empate"
                        />
                    </div>

                    {/* Puntos Derrota */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            PUNTOS DERROTA
                        </label>
                        <Select
                            options={puntosOptions}
                            value={config.puntos_derrota}
                            onChange={(value) => handleInputChange("puntos_derrota", value as number)}
                            placeholder="Puntos por derrota"
                        />
                    </div>

                    {/* Duración Tiempo */}
                    <Input
                        label="DURACIÓN DE CADA TIEMPO (minutos)"
                        value={config.duracion_tiempo}
                        onChange={(e) => handleInputChange('duracion_tiempo', Number(e.target.value))}
                        placeholder="Minutos por tiempo"
                        type="number"
                    />

                    {/* Duración Entretiempo */}
                    <Input
                        label="DURACIÓN DEL ENTRETIEMPO (minutos)"
                        value={config.duracion_entretiempo}
                        onChange={(e) => handleInputChange('duracion_entretiempo', Number(e.target.value))}
                        placeholder="Minutos de entretiempo"
                        type="number"
                    />

                    {/* Fecha de inicio mercado */}
                    <Input
                        label="FECHA DE INICIO DEL MERCADO"
                        value={config.fecha_inicio_mercado || ''}
                        onChange={(e) => handleInputChange('fecha_inicio_mercado', e.target.value)}
                        placeholder="Fecha de inicio del mercado"
                        type="date"
                    />

                    {/* Fecha de fin mercado */}
                    <Input
                        label="FECHA DE FIN DEL MERCADO"
                        value={config.fecha_fin_mercado || ''}
                        onChange={(e) => handleInputChange('fecha_fin_mercado', e.target.value)}
                        placeholder="Fecha de fin del mercado"
                        type="date"
                    />

                    {/* Límite de cambios */}
                    <Input
                        label="LÍMITE DE CAMBIOS"
                        value={config.limite_cambios ?? ''}
                        onChange={(e) => handleInputChange('limite_cambios', e.target.value ? Number(e.target.value) : null)}
                        placeholder="Límite de cambios"
                        type="number"
                        min="0"
                    />

                    {/* Recambio */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            RECAMBIO
                        </label>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={config.recambio ?? false}
                                onChange={(checked) => handleInputChange('recambio', checked)}
                            />
                            <span className="text-[var(--gray-100)] text-sm">
                                {config.recambio ? 'Permitido' : 'No permitido'}
                            </span>
                        </div>
                    </div>

                    {/* Color personalizado */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-[var(--white)] mb-1">
                            COLOR PERSONALIZADO
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={config.color || '#2AD174'}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                                className="w-16 h-10 rounded-lg cursor-pointer border border-[var(--gray-300)] bg-[var(--gray-400)]"
                            />
                            <Input
                                value={config.color || ''}
                                onChange={(e) => handleInputChange('color', e.target.value || null)}
                                placeholder="#2AD174"
                                type="text"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-[var(--gray-100)] mt-1">
                            Selecciona un color hexadecimal para personalizar la categoría
                        </p>
                    </div>
                </div>

                {/* Botón de actualizar */}
                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={!hasChanges || isLoading}
                        className={`px-8 transition-colors ${hasChanges
                            ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white"
                            : "bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Actualizando..." : "Actualizar categoría"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracionCategoriaPage;