'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import Select, { SelectOption } from '@/app/components/ui/Select';
import Switch from '@/app/components/ui/Switch';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useActualizarCategoriaEdicion } from '@/app/hooks/useCategorias';
import toast from 'react-hot-toast';
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
}

const ConfiguracionCategoriaPage = () => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { mutate: actualizarCategoriaEdicion } = useActualizarCategoriaEdicion();

    const [config, setConfig] = useState<CategoriaEdicionConfig>({
        tipo_futbol: 7,
        duracion_tiempo: 25,
        duracion_entretiempo: 5,
        puntos_victoria: 3,
        puntos_empate: 1,
        puntos_derrota: 0,
        limite_cambios: null,
        recambio: null,
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
            const datosActualizar: any = {};

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
            newConfig.recambio !== categoriaSeleccionada.recambio
        );
    };

    useEffect(() => {
        if (categoriaSeleccionada) {
            const newConfig = {
                tipo_futbol: categoriaSeleccionada.tipo_futbol || 7,
                duracion_tiempo: categoriaSeleccionada.duracion_tiempo || 25,
                duracion_entretiempo: categoriaSeleccionada.duracion_entretiempo || 5,
                puntos_victoria: categoriaSeleccionada.puntos_victoria || 3,
                puntos_empate: categoriaSeleccionada.puntos_empate || 1,
                puntos_derrota: categoriaSeleccionada.puntos_derrota || 0,
                fecha_inicio_mercado: formatISOToDateInput(categoriaSeleccionada.fecha_inicio_mercado),
                fecha_fin_mercado: formatISOToDateInput(categoriaSeleccionada.fecha_fin_mercado),
                limite_cambios: categoriaSeleccionada.limite_cambios ?? null,
                recambio: categoriaSeleccionada.recambio ?? null,
            };
            setConfig(newConfig);
            setHasChanges(false);
        }
    }, [categoriaSeleccionada]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Configuración de la categoría {categoriaSeleccionada?.nombre_completo || ""}
                </h1>
                <p className="text-[var(--gray-100)] text-sm">
                    Configura los parámetros de la categoría
                </p>
            </div>

            {/* Formulario de configuración */}
            <div className="rounded-lg w-[70%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de Fútbol */}
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
                        value={config.fecha_inicio_mercado}
                        onChange={(e) => handleInputChange('fecha_inicio_mercado', e.target.value)}
                        placeholder="Fecha de inicio del mercado"
                        type="date"
                    />

                    {/* Fecha de fin mercado */}
                    <Input
                        label="FECHA DE FIN DEL MERCADO"
                        value={config.fecha_fin_mercado}
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
                </div>

                {/* Botón de actualizar */}
                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={!hasChanges || isLoading}
                        className={`px-8 transition-colors ${hasChanges
                            ? "bg-[var(--green)] hover:bg-[var(--green-win)] text-white"
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