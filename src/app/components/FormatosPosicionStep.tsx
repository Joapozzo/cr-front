import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { FormatoPosicion } from '../types/zonas';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface FormatosPosicionStepProps {
    cantidadEquipos: number;
    onFormatosChange: (formatos: FormatoPosicion[]) => void;
    formatosIniciales?: FormatoPosicion[];
    onActualizarFormato?: (id_formato: number, data: {
        posicion_desde?: number;
        posicion_hasta?: number;
        descripcion?: string;
        color?: string | null;
        orden?: number;
    }) => Promise<void>;
    onEliminarFormato?: (id_formato: number) => Promise<void>;
}

interface FormatoTemporal {
    id: string;
    posicion_desde: number;
    posicion_hasta: number;
    descripcion: string;
    color: string;
    orden: number;
    errores?: {
        posicion_desde?: string;
        posicion_hasta?: string;
        descripcion?: string;
        color?: string;
        superposicion?: string;
    };
}

// Colores predefinidos
const COLORES_PREDEFINIDOS = [
    { nombre: 'Verde', hex: '#2ad174' },
    { nombre: 'Amarillo', hex: '#e2b000' },
    { nombre: 'Rojo', hex: '#ef4444' },
    { nombre: 'Azul', hex: '#6366F1' },
    { nombre: 'Naranja', hex: '#f97316' },
] as const;

/**
 * Valida si dos rangos se superponen
 */
const rangosSeSuperponen = (
    desde1: number,
    hasta1: number,
    desde2: number,
    hasta2: number
): boolean => {
    return !(hasta1 < desde2 || hasta2 < desde1);
};

/**
 * Valida un formato individual
 */
const validarFormato = (
    formato: FormatoTemporal,
    otrosFormatos: FormatoTemporal[],
    cantidadEquipos: number
): FormatoTemporal['errores'] => {
    const errores: FormatoTemporal['errores'] = {};

    if (formato.posicion_desde < 1) {
        errores.posicion_desde = 'La posición desde debe ser mayor a 0';
    } else if (formato.posicion_desde > cantidadEquipos) {
        errores.posicion_desde = `La posición desde no puede ser mayor a ${cantidadEquipos}`;
    }

    if (formato.posicion_hasta < 1) {
        errores.posicion_hasta = 'La posición hasta debe ser mayor a 0';
    } else if (formato.posicion_hasta > cantidadEquipos) {
        errores.posicion_hasta = `La posición hasta no puede ser mayor a ${cantidadEquipos}`;
    }

    if (formato.posicion_desde > formato.posicion_hasta) {
        errores.posicion_hasta = 'La posición hasta debe ser mayor o igual a la posición desde';
    }

    if (!formato.descripcion.trim()) {
        errores.descripcion = 'La descripción es requerida';
    } else if (formato.descripcion.length > 100) {
        errores.descripcion = 'La descripción no puede exceder 100 caracteres';
    }

    const formatosSuperpuestos = otrosFormatos.filter(
        (otro) =>
            otro.id !== formato.id &&
            rangosSeSuperponen(
                formato.posicion_desde,
                formato.posicion_hasta,
                otro.posicion_desde,
                otro.posicion_hasta
            )
    );

    if (formatosSuperpuestos.length > 0) {
        const rangos = formatosSuperpuestos
            .map((f) => `${f.posicion_desde}-${f.posicion_hasta}`)
            .join(', ');
        errores.superposicion = `Se superpone con los rangos: ${rangos}`;
    }

    return Object.keys(errores).length > 0 ? errores : undefined;
};

const FormatosPosicionStep = ({
    cantidadEquipos,
    onFormatosChange,
    formatosIniciales = [],
    onActualizarFormato,
    onEliminarFormato,
}: FormatosPosicionStepProps) => {
    const [formatos, setFormatos] = useState<FormatoTemporal[]>([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formatoNuevo, setFormatoNuevo] = useState<FormatoTemporal>({
        id: '',
        posicion_desde: 1,
        posicion_hasta: 1,
        descripcion: '',
        color: COLORES_PREDEFINIDOS[0].hex,
        orden: 0,
    });

    // Cargar formatos iniciales
    useEffect(() => {
        if (formatosIniciales.length > 0) {
            const formatosTemporales: FormatoTemporal[] = formatosIniciales.map((f) => ({
                id: `existing-${f.id_formato_posicion}`,
                posicion_desde: f.posicion_desde,
                posicion_hasta: f.posicion_hasta,
                descripcion: f.descripcion,
                color: f.color || COLORES_PREDEFINIDOS[0].hex,
                orden: f.orden,
            }));
            setFormatos(formatosTemporales);
        }
    }, [formatosIniciales]);

    // Notificar cambios a componente padre
    useEffect(() => {
        const formatosValidados = formatos
            .filter((f) => !f.errores)
            .map((f) => ({
                id_formato_posicion: f.id.startsWith('existing-')
                    ? parseInt(f.id.replace('existing-', ''))
                    : 0,
                id_zona: 0,
                posicion_desde: f.posicion_desde,
                posicion_hasta: f.posicion_hasta,
                descripcion: f.descripcion,
                color: f.color || null,
                orden: f.orden,
            })) as FormatoPosicion[];

        onFormatosChange(formatosValidados);
    }, [formatos, onFormatosChange]);

    const validarYActualizarFormato = (formato: FormatoTemporal) => {
        const otrosFormatos = formatos.filter((f) => f.id !== formato.id);
        const errores = validarFormato(formato, otrosFormatos, cantidadEquipos);
        return { ...formato, errores };
    };

    const handleAgregarFormato = () => {
        const formatoValidado = validarYActualizarFormato(formatoNuevo);

        if (formatoValidado.errores) {
            setFormatoNuevo(formatoValidado);
            toast.error('Por favor corrige los errores antes de agregar el formato');
            return;
        }

        const nuevoId = `temp-${Date.now()}-${Math.random()}`;
        const siguienteOrden = formatos.length > 0
            ? Math.max(...formatos.map((f) => f.orden)) + 1
            : 1;

        const nuevoFormato: FormatoTemporal = {
            ...formatoNuevo,
            id: nuevoId,
            orden: siguienteOrden,
        };

        setFormatos([...formatos, nuevoFormato]);
        setFormatoNuevo({
            id: '',
            posicion_desde: 1,
            posicion_hasta: 1,
            descripcion: '',
            color: COLORES_PREDEFINIDOS[0].hex,
            orden: 0,
        });
        setMostrarFormulario(false);
        toast.success('Formato agregado exitosamente');
    };

    const handleEliminarFormato = async (id: string) => {
        const esFormatoExistente = id.startsWith('existing-');
        const idFormato = esFormatoExistente ? parseInt(id.replace('existing-', '')) : null;

        // Si es un formato existente y hay callback, llamar a la API
        if (esFormatoExistente && idFormato && onEliminarFormato) {
            try {
                await onEliminarFormato(idFormato);
                setFormatos(formatos.filter((f) => f.id !== id));
                toast.success('Formato eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el formato');
                console.error(error);
            }
        } else {
            // Si es un formato temporal, solo eliminarlo del estado
            setFormatos(formatos.filter((f) => f.id !== id));
            toast.success('Formato eliminado');
        }
    };

    // Usar useRef para almacenar los timeouts de debounce
    const debounceTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

    const handleActualizarFormato = (id: string, campo: keyof FormatoTemporal, valor: string | number) => {
        const esFormatoExistente = id.startsWith('existing-');
        const idFormato = esFormatoExistente ? parseInt(id.replace('existing-', '')) : null;

        // Limpiar timeout anterior si existe
        if (debounceTimeoutsRef.current[id]) {
            clearTimeout(debounceTimeoutsRef.current[id]);
        }

        // Actualizar en el estado local inmediatamente
        setFormatos((prev) => {
            const actualizados = prev.map((f) => {
                if (f.id === id) {
                    const actualizado = { ...f, [campo]: valor };
                    return validarYActualizarFormato(actualizado);
                }
                return f;
            });
            
            // Si es un formato existente, programar actualización en API con debounce
            if (esFormatoExistente && idFormato && onActualizarFormato) {
                const timeoutId = setTimeout(async () => {
                    const formatoActualizado = actualizados.find(f => f.id === id);
                    if (formatoActualizado && !formatoActualizado.errores) {
                        try {
                            await onActualizarFormato(idFormato, {
                                posicion_desde: formatoActualizado.posicion_desde,
                                posicion_hasta: formatoActualizado.posicion_hasta,
                                descripcion: formatoActualizado.descripcion,
                                color: formatoActualizado.color || null,
                                orden: formatoActualizado.orden,
                            });
                        } catch (error) {
                            toast.error('Error al actualizar el formato');
                            console.error(error);
                        }
                    }
                    delete debounceTimeoutsRef.current[id];
                }, 1000);
                
                debounceTimeoutsRef.current[id] = timeoutId;
            }
            
            return actualizados;
        });
    };

    const generarPreviewTabla = () => {
        const filas = [];
        for (let i = 1; i <= Math.min(cantidadEquipos, 10); i++) {
            const formato = formatos.find(
                (f) =>
                    !f.errores &&
                    i >= f.posicion_desde &&
                    i <= f.posicion_hasta
            );
            const colorFondo = formato?.color || 'transparent';
            const colorTexto = formato?.color ? '#ffffff' : 'inherit';

            filas.push(
                <tr key={i} style={{ backgroundColor: colorFondo, color: colorTexto }}>
                    <td className="px-3 py-2 text-sm font-medium">{i}</td>
                    <td className="px-3 py-2 text-sm">
                        {formato?.descripcion || '-'}
                    </td>
                </tr>
            );
        }
        return filas;
    };

    return (
        <div className="space-y-4">
            <div className="border border-[var(--gray-300)] rounded-lg p-4 bg-[var(--gray-400)]">
                <h3 className="text-[var(--white)] font-medium mb-4">
                    Formatos de posición
                </h3>

                {/* Lista de formatos */}
                {formatos.length > 0 ? (
                    <div className="space-y-3 mb-4">
                        {formatos.map((formato) => (
                            <div
                                key={formato.id}
                                className={`p-3 rounded-lg border ${
                                    formato.errores
                                        ? 'border-[var(--red)] bg-red-500/10'
                                        : 'border-[var(--gray-300)] bg-[var(--gray-500)]'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="w-4 h-4 rounded-full border-2 border-[var(--gray-300)]"
                                                style={{ backgroundColor: formato.color }}
                                            />
                                            <span className="text-[var(--white)] font-medium text-sm">
                                                Posiciones {formato.posicion_desde} - {formato.posicion_hasta}
                                            </span>
                                        </div>
                                        <p className="text-[var(--gray-100)] text-sm mb-2">
                                            {formato.descripcion}
                                        </p>

                                        {/* Errores */}
                                        {formato.errores && (
                                            <div className="mt-2 space-y-1">
                                                {Object.entries(formato.errores).map(([campo, mensaje]) => (
                                                    <div
                                                        key={campo}
                                                        className="flex items-center gap-2 text-xs text-[var(--red)]"
                                                    >
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>{mensaje}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Inputs de edición */}
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <Input
                                                type="number"
                                                label="Desde"
                                                min={1}
                                                max={cantidadEquipos}
                                                value={formato.posicion_desde.toString()}
                                                onChange={(e) =>
                                                    handleActualizarFormato(
                                                        formato.id,
                                                        'posicion_desde',
                                                        parseInt(e.target.value) || 1
                                                    )
                                                }
                                                error={formato.errores?.posicion_desde}
                                            />
                                            <Input
                                                type="number"
                                                label="Hasta"
                                                min={formato.posicion_desde}
                                                max={cantidadEquipos}
                                                value={formato.posicion_hasta.toString()}
                                                onChange={(e) =>
                                                    handleActualizarFormato(
                                                        formato.id,
                                                        'posicion_hasta',
                                                        parseInt(e.target.value) || 1
                                                    )
                                                }
                                                error={formato.errores?.posicion_hasta}
                                            />
                                            <div className="col-span-2">
                                                <Input
                                                    type="text"
                                                    label="Descripción"
                                                    maxLength={100}
                                                    value={formato.descripcion}
                                                    onChange={(e) =>
                                                        handleActualizarFormato(
                                                            formato.id,
                                                            'descripcion',
                                                            e.target.value
                                                        )
                                                    }
                                                    error={formato.errores?.descripcion}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs text-[var(--gray-100)] mb-2 block">
                                                    Color
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    {COLORES_PREDEFINIDOS.map((color) => (
                                                        <button
                                                            key={color.hex}
                                                            type="button"
                                                            onClick={() =>
                                                                handleActualizarFormato(
                                                                    formato.id,
                                                                    'color',
                                                                    color.hex
                                                                )
                                                            }
                                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                                formato.color === color.hex
                                                                    ? 'border-[var(--white)] scale-110'
                                                                    : 'border-[var(--gray-300)] hover:border-[var(--gray-200)]'
                                                            }`}
                                                            style={{ backgroundColor: color.hex }}
                                                            title={color.nombre}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEliminarFormato(formato.id)}
                                        className="p-2 text-[var(--red)] hover:bg-[var(--gray-300)] rounded transition-colors"
                                        title="Eliminar formato"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[var(--gray-100)] text-sm mb-4">
                        No hay formatos de posición definidos. Agrega uno para comenzar.
                    </p>
                )}

                {/* Botón agregar */}
                {!mostrarFormulario && (
                    <Button
                        onClick={() => setMostrarFormulario(true)}
                        variant="secondary"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar formato
                    </Button>
                )}

                {/* Formulario nuevo formato */}
                {mostrarFormulario && (
                    <div className="mt-4 p-4 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-500)]">
                        <h4 className="text-[var(--white)] font-medium mb-3 text-sm">
                            Nuevo formato de posición
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                type="number"
                                label="Posición desde *"
                                min={1}
                                max={cantidadEquipos}
                                value={formatoNuevo.posicion_desde.toString()}
                                onChange={(e) =>
                                    setFormatoNuevo({
                                        ...formatoNuevo,
                                        posicion_desde: parseInt(e.target.value) || 1,
                                    })
                                }
                                error={formatoNuevo.errores?.posicion_desde}
                            />
                            <Input
                                type="number"
                                label="Posición hasta *"
                                min={formatoNuevo.posicion_desde}
                                max={cantidadEquipos}
                                value={formatoNuevo.posicion_hasta.toString()}
                                onChange={(e) =>
                                    setFormatoNuevo({
                                        ...formatoNuevo,
                                        posicion_hasta: parseInt(e.target.value) || 1,
                                    })
                                }
                                error={formatoNuevo.errores?.posicion_hasta}
                            />
                            <div className="col-span-2">
                                <Input
                                    type="text"
                                    label="Descripción *"
                                    maxLength={100}
                                    value={formatoNuevo.descripcion}
                                    onChange={(e) =>
                                        setFormatoNuevo({
                                            ...formatoNuevo,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    placeholder="Ej: Clasifican a Semifinales"
                                    error={formatoNuevo.errores?.descripcion}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-[var(--gray-100)] mb-2 block">
                                    Color *
                                </label>
                                <div className="flex items-center gap-3">
                                    {COLORES_PREDEFINIDOS.map((color) => (
                                        <button
                                            key={color.hex}
                                            type="button"
                                            onClick={() =>
                                                setFormatoNuevo({
                                                    ...formatoNuevo,
                                                    color: color.hex,
                                                })
                                            }
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                formatoNuevo.color === color.hex
                                                    ? 'border-[var(--white)] scale-110'
                                                    : 'border-[var(--gray-300)] hover:border-[var(--gray-200)]'
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.nombre}
                                        />
                                    ))}
                                </div>
                            </div>
                            {formatoNuevo.errores?.superposicion && (
                                <div className="col-span-2">
                                    <p className="text-xs text-[var(--red)] flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        {formatoNuevo.errores.superposicion}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                onClick={handleAgregarFormato}
                                variant="success"
                                size="sm"
                            >
                                Agregar
                            </Button>
                            <Button
                                onClick={() => {
                                    setMostrarFormulario(false);
                                    setFormatoNuevo({
                                        id: '',
                                        posicion_desde: 1,
                                        posicion_hasta: 1,
                                        descripcion: '',
                                        color: COLORES_PREDEFINIDOS[0].hex,
                                        orden: 0,
                                    });
                                }}
                                variant="default"
                                size="sm"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Preview de tabla */}
                {formatos.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-[var(--white)] font-medium mb-2 text-sm">
                            Preview de Tabla de posiciones
                        </h4>
                        <div className="border border-[var(--gray-300)] rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--gray-500)]">
                                    <tr>
                                        <th className="px-3 py-2 text-xs font-medium text-[var(--gray-100)]">
                                            Pos
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium text-[var(--gray-100)]">
                                            Formato
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{generarPreviewTabla()}</tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormatosPosicionStep;
