import { useState, useEffect } from 'react';
import { useFasesPorCategoria } from '../hooks/useFases';
import { useZonasPorFase } from '../hooks/useZonas';
import { useOcuparVacanteConAutomatizacion, useConfigurarAutomatizacionPartido } from '../hooks/useAutomatizaciones';
import { Button } from './ui/Button';
import Select, { SelectOption } from './ui/Select';
import toast from 'react-hot-toast';

interface TabAutomatizacionProps {
    idZona: number;
    idCategoriaEdicion: number;
    vacante: number;
    numeroFaseActual: number;
    onClose: () => void;
    idPartido?: number;
}

const TabAutomatizacion = ({
    idZona,
    idCategoriaEdicion,
    vacante,
    numeroFaseActual,
    onClose,
    idPartido
}: TabAutomatizacionProps) => {
    const [selectedFase, setSelectedFase] = useState<number | null>(null);
    const [selectedZona, setSelectedZona] = useState<number | null>(null);
    const [selectedPosicion, setSelectedPosicion] = useState<number | null>(null);
    const [selectedPartido, setSelectedPartido] = useState<number | null>(null);
    const [selectedResultado, setSelectedResultado] = useState<'G' | 'P' | null>(null);

    const { data: fases, isLoading: loadingFases } = useFasesPorCategoria(idCategoriaEdicion);
    const { data: zonas, isLoading: loadingZonas } = useZonasPorFase(
        idCategoriaEdicion,
        selectedFase || 0,
        { enabled: !!selectedFase }
    );
    
    const { mutate: automatizarPosicion, isPending: pendingPosicion } = useOcuparVacanteConAutomatizacion();
    const { mutate: automatizarPartido, isPending: pendingPartido } = useConfigurarAutomatizacionPartido();

    const isPending = pendingPosicion || pendingPartido;

    // Reset cascada
    useEffect(() => {
        setSelectedZona(null);
        setSelectedPosicion(null);
        setSelectedPartido(null);
        setSelectedResultado(null);
    }, [selectedFase]);

    useEffect(() => {
        setSelectedPosicion(null);
        setSelectedPartido(null);
        setSelectedResultado(null);
    }, [selectedZona]);

    useEffect(() => {
        setSelectedResultado(null);
    }, [selectedPartido]);

    // ✅ Filtrar solo fases anteriores
    const fasesOptions: SelectOption[] = fases
        ?.filter(fase => fase.numero_fase < numeroFaseActual)
        ?.map(fase => ({
            value: fase.numero_fase,
            label: `Fase ${fase.numero_fase}`
        })) || [];

    const zonasOptions: SelectOption[] = zonas?.map(zona => ({
        value: zona.id_zona,
        label: `${zona.nombre} - ${zona.etapa.nombre}` || `Zona ${zona.id_zona}`
    })) || [];

    const zonaSeleccionada = zonas?.find(z => z.id_zona === selectedZona);
    const esEliminacionDirecta = zonaSeleccionada?.tipoZona?.nombre?.includes('eliminacion');

    // ✅ Opciones según tipo de zona
    const posicionesOptions: SelectOption[] = Array.from(
        { length: zonaSeleccionada?.cantidad_equipos || 0 },
        (_, i) => ({
            value: i + 1,
            label: `${i + 1}° Posición`
        })
    );

    const partidosOptions: SelectOption[] = zonaSeleccionada?.partidos?.map((partido, index) => ({
        value: partido.id_partido,
        label: `Cruce ${index + 1}: ${partido.vacante_local} vs ${partido.vacante_visita}`
    })) || [];

    const resultadoOptions: SelectOption[] = [
        { value: 'G', label: 'Ganador' },
        { value: 'P', label: 'Perdedor' }
    ];

    const handleSubmit = () => {
        if (!selectedZona) {
            toast.error('Debe seleccionar una zona');
            return;
        }

        // ✅ CASO 1: TODOS CONTRA TODOS - Usar posiciones
        if (!esEliminacionDirecta) {
            if (!selectedPosicion) {
                toast.error('Debe seleccionar una posición');
                return;
            }

            automatizarPosicion({
                id_zona: idZona,
                id_categoria_edicion: idCategoriaEdicion,
                vacante: vacante,
                id_zona_previa: selectedZona,
                pos_zona_previa: selectedPosicion
            }, {
                onSuccess: () => {
                    toast.success('Automatización por posición configurada exitosamente');
                    onClose();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al configurar automatización');
                }
            });
        } 
        // ✅ CASO 2: ELIMINACIÓN DIRECTA - Usar partidos
        else {
            if (!selectedPartido || !selectedResultado || !idPartido) {
                toast.error('Debe seleccionar un partido y un resultado');
                return;
            }

            automatizarPartido({
                id_partido: idPartido,
                vacante: vacante,
                id_partido_previo: selectedPartido,
                res_partido_previo: selectedResultado
            }, {
                onSuccess: () => {
                    toast.success('Automatización por partido configurada exitosamente');
                    onClose();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al configurar automatización');
                }
            });
        }
    };

    if (loadingFases) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[var(--gray-100)]">Cargando fases...</span>
                </div>
            </div>
        );
    }

    if (fasesOptions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-[var(--gray-100)] mb-2">
                    No hay fases anteriores disponibles para automatización
                </p>
                <p className="text-xs text-[var(--gray-100)]">
                    Esta es la primera fase de la categoría
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Seleccionar Fase */}
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Fase anterior
                </label>
                <Select
                    options={fasesOptions}
                    value={selectedFase || ''}
                    onChange={(value) => setSelectedFase(Number(value))}
                    placeholder="Selecciona una fase..."
                    bgColor='bg-[var(--gray-300)]'
                />
            </div>

            {/* Seleccionar Zona */}
            {selectedFase && (
                <div>
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        Zona de la fase {selectedFase}
                    </label>
                    {loadingZonas ? (
                        <div className="flex items-center gap-2 text-[var(--gray-100)] text-sm">
                            <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                            Cargando zonas...
                        </div>
                    ) : (
                        <Select
                            options={zonasOptions}
                            value={selectedZona || ''}
                            onChange={(value) => setSelectedZona(Number(value))}
                            placeholder="Selecciona una zona..."
                            bgColor='bg-[var(--gray-300)]'
                        />
                    )}
                </div>
            )}

            {/* ✅ OPCIÓN 1: TODOS CONTRA TODOS - Seleccionar Posición */}
            {selectedZona && zonaSeleccionada && !esEliminacionDirecta && (
                <div>
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        Posición en {zonaSeleccionada.nombre}
                    </label>
                    <Select
                        options={posicionesOptions}
                        value={selectedPosicion || ''}
                        onChange={(value) => setSelectedPosicion(Number(value))}
                        placeholder="Selecciona una posición..."
                        bgColor='bg-[var(--gray-300)]'
                    />
                    <p className="mt-2 text-xs text-[var(--blue)]">
                        💡 El equipo que quede en esta posición ocupará automáticamente la vacante {vacante}
                    </p>
                </div>
            )}

            {/* ✅ OPCIÓN 2: ELIMINACIÓN DIRECTA - Seleccionar Partido */}
            {selectedZona && zonaSeleccionada && esEliminacionDirecta && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-[var(--white)] mb-2">
                            Partido de {zonaSeleccionada.nombre}
                        </label>
                        <Select
                            options={partidosOptions}
                            value={selectedPartido || ''}
                            onChange={(value) => setSelectedPartido(Number(value))}
                            placeholder="Selecciona un partido..."
                            bgColor='bg-[var(--gray-300)]'
                        />
                    </div>

                    {/* Seleccionar Ganador o Perdedor */}
                    {selectedPartido && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--white)] mb-2">
                                Resultado
                            </label>
                            <Select
                                options={resultadoOptions}
                                value={selectedResultado || ''}
                                onChange={(value) => setSelectedResultado(value as 'G' | 'P')}
                                placeholder="Selecciona ganador o perdedor..."
                                bgColor='bg-[var(--gray-300)]'
                            />
                        </div>
                    )}
                </>
            )}

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-4">
                <Button
                    variant="more"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={
                        !selectedZona || 
                        (!esEliminacionDirecta && !selectedPosicion) ||
                        (esEliminacionDirecta && (!selectedPartido || !selectedResultado)) ||
                        isPending
                    }
                >
                    {isPending ? 'Configurando...' : 'Configurar automatización'}
                </Button>
            </div>
        </div>
    );
};

export default TabAutomatizacion;