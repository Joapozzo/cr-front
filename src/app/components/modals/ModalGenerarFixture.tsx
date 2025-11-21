'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { BaseModal } from './ModalAdmin';
import { Button } from '../ui/Button';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useGenerarFixture } from '@/app/hooks/useFixtureGenerator';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import { useCanchas, usePredios } from '@/app/hooks/usePredios';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { GenerarFixtureInput, PreviewFecha } from '@/app/types/fixture-generator';
import StepIndicators from '../fixture-generator/StepIndicators';
import PasoSeleccionZonas from '../fixture-generator/PasoSeleccionZonas';
import PasoConfiguracion from '../fixture-generator/PasoConfiguracion';
import PasoDiaHorarios from '../fixture-generator/PasoDiaHorarios';
import PasoResumen from '../fixture-generator/PasoResumen';
import toast from 'react-hot-toast';

interface ModalGenerarFixtureProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type Paso = 1 | 2 | 3 | 4;

const STEP_LABELS = ['Zonas', 'Config', 'Horarios', 'Resumen'];
const DIAS_SEMANA = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

export default function ModalGenerarFixture({
    isOpen,
    onClose,
    onSuccess
}: ModalGenerarFixtureProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const [pasoActual, setPasoActual] = useState<Paso>(1);
    const [formData, setFormData] = useState<Partial<GenerarFixtureInput>>({
        id_categoria_edicion: idCategoriaEdicion,
        zonas_seleccionadas: [],
        incluir_interzonales: false,
        distribucion_interzonales: 'distribuida',
        formato_torneo: 'ida',
        permitir_fecha_libre: false,
        autocompletar_planillero: false,
        dia_semana: 4, // Jueves por defecto
        canchas_seleccionadas: [],
        hora_inicio: '17:00',
        hora_fin: '23:00',
    });

    const { data: todasLasZonas = [], isLoading: loadingZonas } = useObtenerTodasLasZonas(idCategoriaEdicion);
    
    // Filtrar solo zonas de tipo "todos contra todos"
    const zonasElegibles = useMemo(() => {
        if (!todasLasZonas) return [];
        return todasLasZonas
            .filter((zona) => zona.tipoZona?.nombre === 'todos-contra-todos')
            .map((zona) => ({
                id_zona: zona.id_zona,
                nombre: zona.nombre || `Zona ${zona.id_zona}`,
                cantidad_equipos: zona.cantidad_equipos || 0,
                es_impar: (zona.cantidad_equipos || 0) % 2 !== 0
            }));
    }, [todasLasZonas]);
    
    const { data: planilleros = [] } = useObtenerPlanilleros();
    const { data: predios = [], isLoading: loadingPredios } = usePredios(false);
    
    const [idPredioSeleccionado, setIdPredioSeleccionado] = useState<number | undefined>();
    const { data: canchas = [], isLoading: loadingCanchas } = useCanchas({ 
        incluir_inactivas: false,
        id_predio: idPredioSeleccionado
    });

    const { mutateAsync: generarFixture, isPending: isGenerating } = useGenerarFixture();

    // Resetear formulario al abrir
    useEffect(() => {
        if (isOpen) {
            setPasoActual(1);
            setFormData({
                id_categoria_edicion: idCategoriaEdicion,
                zonas_seleccionadas: [],
                incluir_interzonales: false,
                distribucion_interzonales: 'distribuida',
                formato_torneo: 'ida',
                permitir_fecha_libre: false,
                autocompletar_planillero: false,
                dia_semana: 4,
                canchas_seleccionadas: [],
                hora_inicio: '17:00',
                hora_fin: '23:00',
            });
            setIdPredioSeleccionado(undefined);
        }
    }, [isOpen, idCategoriaEdicion]);

    // Calcular si fecha libre está habilitada
    const fechaLibreHabilitada = useMemo(() => {
        if (formData.zonas_seleccionadas?.length === 0) return false;
        
        if (formData.incluir_interzonales && (formData.zonas_seleccionadas?.length || 0) >= 2) {
            // Sumar total de equipos de todas las zonas seleccionadas
            const totalEquipos = zonasElegibles
                .filter(z => formData.zonas_seleccionadas?.includes(z.id_zona))
                .reduce((sum, z) => sum + z.cantidad_equipos, 0);
            return totalEquipos % 2 !== 0;
        }
        
        // Una o múltiples zonas sin interzonales
        return zonasElegibles.some(z => 
            formData.zonas_seleccionadas?.includes(z.id_zona) && z.es_impar
        );
    }, [formData.zonas_seleccionadas, formData.incluir_interzonales, zonasElegibles]);

    // Calcular total de fechas del fixture (aproximado)
    // Calcular total de fechas del fixture
    const totalFechasFixture = useMemo(() => {
        const zonasSeleccionadas = formData.zonas_seleccionadas || [];
        if (zonasSeleccionadas.length === 0) return 0;
        
        // Calcular fechas intrazonales (máximo de todas las zonas)
        const fechasIntrazonales = Math.max(
            ...zonasElegibles
                .filter(z => zonasSeleccionadas.includes(z.id_zona))
                .map(z => {
                    const esImpar = z.cantidad_equipos % 2 !== 0;
                    const incluirFechaLibre = formData.permitir_fecha_libre && esImpar;
                    return esImpar && incluirFechaLibre ? z.cantidad_equipos : z.cantidad_equipos - 1;
                }),
            0
        );
        
        let total = fechasIntrazonales;
        
        // Si hay interzonales
        if (formData.incluir_interzonales && zonasSeleccionadas.length >= 2) {
            // Calcular fechas interzonales
            const zonasInfo = zonasElegibles.filter(z => zonasSeleccionadas.includes(z.id_zona));
            if (zonasInfo.length >= 2) {
                if (formData.distribucion_interzonales === 'concentrada') {
                    // Interzonales concentrados = 1 fecha adicional
                    total += 1;
                } else {
                    // Interzonales distribuidos: se distribuyen en las fechas existentes
                    // Pero si no caben, necesitamos 1 fecha adicional
                    // Por ahora, asumimos que se distribuyen en las fechas intrazonales
                    // Si no caben, el backend lanzará un error
                    // El total será el máximo entre intrazonales y la cantidad de equipos (para asegurar espacio)
                    const maxEquiposZonas = Math.max(...zonasInfo.map(z => z.cantidad_equipos));
                    // Si los interzonales no caben en las fechas intrazonales, agregar 1 fecha
                    // Esto es una aproximación - el backend calculará el valor real
                    total = Math.max(total, maxEquiposZonas);
                }
            }
        }
        
        // Si es ida y vuelta, duplicar
        if (formData.formato_torneo === 'ida-vuelta') {
            total *= 2;
        }
        
        return total;
    }, [formData.zonas_seleccionadas, formData.incluir_interzonales, formData.distribucion_interzonales, formData.formato_torneo, formData.permitir_fecha_libre, zonasElegibles]);

    // Calcular preview de fechas
    const previewFechas = useMemo<PreviewFecha[]>(() => {
        if (!formData.fecha_inicio || formData.dia_semana === undefined) return [];
        
        const fechas: PreviewFecha[] = [];
        // Parsear la fecha en formato local para evitar problemas de zona horaria
        const [year, month, day] = formData.fecha_inicio.split('-').map(Number);
        const fechaInicio = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexed months
        const diaSemana = formData.dia_semana;
        
        // Ajustar fecha al día de la semana correcto
        const diaActual = fechaInicio.getDay();
        const diferencia = (diaSemana - diaActual + 7) % 7;
        fechaInicio.setDate(fechaInicio.getDate() + diferencia);
        
        // Mostrar las primeras fechas (mínimo 3, máximo totalFechasFixture)
        const cantidadFechasPreview = Math.min(Math.max(3, totalFechasFixture), totalFechasFixture || 3);
        for (let i = 0; i < cantidadFechasPreview; i++) {
            const fecha = new Date(fechaInicio);
            fecha.setDate(fecha.getDate() + (i * 7));
            
            const diaNombre = DIAS_SEMANA.find(d => d.value === fecha.getDay())?.label || '';
            const fechaStr = fecha.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            fechas.push({
                fecha: fechaStr,
                diaSemana: diaNombre
            });
        }
        
        return fechas;
    }, [formData.fecha_inicio, formData.dia_semana, totalFechasFixture]);

    // Validar fecha de inicio coincide con día de semana
    const fechaInicioValida = useMemo(() => {
        if (!formData.fecha_inicio || formData.dia_semana === undefined) return true;
        
        // Parsear la fecha en formato local para evitar problemas de zona horaria
        const [year, month, day] = formData.fecha_inicio.split('-').map(Number);
        const fecha = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexed months
        return fecha.getDay() === formData.dia_semana;
    }, [formData.fecha_inicio, formData.dia_semana]);

    const handleChange = (field: keyof GenerarFixtureInput, value: string | number | boolean | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value as never }));
    };

    const toggleZona = (id_zona: number) => {
        setFormData(prev => {
            const zonas = prev.zonas_seleccionadas || [];
            if (zonas.includes(id_zona)) {
                return { ...prev, zonas_seleccionadas: zonas.filter(z => z !== id_zona) };
            } else {
                return { ...prev, zonas_seleccionadas: [...zonas, id_zona] };
            }
        });
    };

    const toggleCancha = (id_cancha: number) => {
        setFormData(prev => {
            const canchas = prev.canchas_seleccionadas || [];
            if (canchas.includes(id_cancha)) {
                return { ...prev, canchas_seleccionadas: canchas.filter(c => c !== id_cancha) };
            } else {
                return { ...prev, canchas_seleccionadas: [...canchas, id_cancha] };
            }
        });
    };

    const validarPaso = (paso: Paso): boolean => {
        switch (paso) {
            case 1:
                return (formData.zonas_seleccionadas?.length || 0) > 0;
            case 2:
                // Si incluye interzonales, debe haber al menos 2 zonas seleccionadas
                if (formData.incluir_interzonales && (formData.zonas_seleccionadas?.length || 0) < 2) return false;
                return true;
            case 3:
                if (!formData.fecha_inicio || formData.dia_semana === undefined) return false;
                if (!fechaInicioValida) return false;
                if (!idPredioSeleccionado) return false;
                if ((formData.canchas_seleccionadas?.length || 0) === 0) return false;
                if (!formData.hora_inicio || !formData.hora_fin) return false;
                return true;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const siguientePaso = () => {
        if (validarPaso(pasoActual) && pasoActual < 4) {
            setPasoActual((prev) => (prev + 1) as Paso);
        }
    };

    const pasoAnterior = () => {
        if (pasoActual > 1) {
            setPasoActual((prev) => (prev - 1) as Paso);
        }
    };

    const handleSubmit = async () => {
        if (!validarPaso(4)) {
            toast.error('Por favor complete todos los campos requeridos');
            return;
        }

        try {
            const input: GenerarFixtureInput = {
                id_categoria_edicion: formData.id_categoria_edicion!,
                zonas_seleccionadas: formData.zonas_seleccionadas!,
                incluir_interzonales: formData.incluir_interzonales || false,
                distribucion_interzonales: formData.distribucion_interzonales || 'distribuida',
                posicion_interzonales: formData.posicion_interzonales,
                formato_torneo: formData.formato_torneo || 'ida',
                permitir_fecha_libre: formData.permitir_fecha_libre || false,
                autocompletar_planillero: formData.autocompletar_planillero || false,
                dia_semana: formData.dia_semana!,
                fecha_inicio: formData.fecha_inicio!,
                canchas_seleccionadas: formData.canchas_seleccionadas!,
                hora_inicio: formData.hora_inicio!,
                hora_fin: formData.hora_fin!,
            };

            await generarFixture(input);
            onSuccess?.();
            onClose();
        } catch {
            // El error ya se maneja en el hook
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Generar Fixture Automático"
            type="create"
            maxWidth="max-w-4xl"
        >
            <div className="space-y-6">
                {/* Step Indicators */}
                <div className="mb-6 pb-4 border-b border-[var(--gray-300)]">
                    <StepIndicators
                        pasoActual={pasoActual}
                        totalPasos={4}
                        labels={STEP_LABELS}
                    />
                </div>

                {/* Paso 1: Selección de zonas */}
                {pasoActual === 1 && (
                    <PasoSeleccionZonas
                        zonasElegibles={zonasElegibles}
                        zonasSeleccionadas={formData.zonas_seleccionadas || []}
                        loadingZonas={loadingZonas}
                        onToggleZona={toggleZona}
                    />
                )}

                {/* Paso 2: Configuración del fixture */}
                {pasoActual === 2 && (
                    <PasoConfiguracion
                        formData={formData}
                        zonasElegibles={zonasElegibles}
                        planilleros={planilleros}
                        fechaLibreHabilitada={fechaLibreHabilitada}
                        totalFechasFixture={totalFechasFixture}
                        onFormDataChange={handleChange}
                    />
                )}

                {/* Paso 3: Día y horarios */}
                {pasoActual === 3 && (
                    <PasoDiaHorarios
                        formData={formData}
                        previewFechas={previewFechas}
                        fechaInicioValida={fechaInicioValida}
                        canchas={canchas}
                        loadingCanchas={loadingCanchas}
                        predios={predios}
                        loadingPredios={loadingPredios}
                        idPredioSeleccionado={idPredioSeleccionado}
                        onFormDataChange={handleChange}
                        onToggleCancha={toggleCancha}
                        onPredioChange={setIdPredioSeleccionado}
                    />
                )}

                {/* Paso 4: Resumen */}
                {pasoActual === 4 && (
                    <PasoResumen formData={formData} />
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--gray-300)]">
                    <Button
                        variant="default"
                        onClick={pasoActual === 1 ? onClose : pasoAnterior}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2"
                    >
                        {pasoActual === 1 ? (
                            'Cancelar'
                        ) : (
                            <>
                                <ChevronLeft size={16} />
                                Anterior
                            </>
                        )}
                    </Button>
                    <div className="flex gap-2">
                        {pasoActual < 4 ? (
                            <Button
                                variant="success"
                                onClick={siguientePaso}
                                disabled={!validarPaso(pasoActual)}
                                className="w-full flex items-center justify-center"
                            >
                                Siguiente
                                <ChevronRight size={16} className="ml-1" />
                            </Button>
                        ) : (
                            <Button
                                variant="success"
                                onClick={handleSubmit}
                                disabled={isGenerating || !validarPaso(4)}
                                className='flex items-center justify-center gap-2'
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    'Generar Fixture'
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}
