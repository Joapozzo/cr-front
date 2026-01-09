import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { FormatosPosicionStepProps } from './types';
import { useFormatosState } from './hooks/useFormatosState';
import { useFormatosValidation } from './hooks/useFormatosValidation';
import { useFormatosSync } from './hooks/useFormatosSync';
import { useDebouncedUpdate } from './hooks/useDebouncedUpdate';
import { FormatoItem } from './components/FormatoItem';
import { FormularioNuevoFormato } from './components/FormularioNuevoFormato';
import { PreviewTabla } from './components/PreviewTabla';
import { FormatoTemporal } from './types';
import { FORMATO_INICIAL, MENSAJES } from './constants';

const FormatosPosicionStep = ({
    cantidadEquipos,
    onFormatosChange,
    formatosIniciales = [],
    onActualizarFormato,
    onEliminarFormato,
}: FormatosPosicionStepProps) => {
    // Hooks de estado
    const {
        formatos,
        setFormatos,
        formatosExpandidos,
        toggleExpandFormato,
        removeFormatoFromExpanded,
    } = useFormatosState(formatosIniciales);

    const { validarYActualizarFormato } = useFormatosValidation(formatos, cantidadEquipos);
    const { scheduleUpdate } = useDebouncedUpdate(onActualizarFormato);

    // Sincronización con callbacks externos
    useFormatosSync(formatos, onFormatosChange);

    // Estado local del formulario
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formatoNuevo, setFormatoNuevo] = useState<FormatoTemporal>(FORMATO_INICIAL);

    // Handlers
    const handleAgregarFormato = () => {
        const formatoValidado = validarYActualizarFormato(formatoNuevo);

        if (formatoValidado.errores) {
            setFormatoNuevo(formatoValidado);
            toast.error(MENSAJES.TOAST_ERROR_VALIDACION);
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
        setFormatoNuevo(FORMATO_INICIAL);
        setMostrarFormulario(false);
        toast.success(MENSAJES.TOAST_SUCCESS_AGREGAR);
    };

    const handleEliminarFormato = async (id: string) => {
        const esFormatoExistente = id.startsWith('existing-');
        const idFormato = esFormatoExistente ? parseInt(id.replace('existing-', '')) : null;

        if (esFormatoExistente && idFormato && onEliminarFormato) {
            try {
                await onEliminarFormato(idFormato);
                setFormatos(formatos.filter((f) => f.id !== id));
                removeFormatoFromExpanded(id);
                toast.success(MENSAJES.TOAST_SUCCESS_ELIMINAR);
            } catch (error) {
                toast.error(MENSAJES.TOAST_ERROR_ELIMINAR);
                console.error(error);
            }
        } else {
            setFormatos(formatos.filter((f) => f.id !== id));
            removeFormatoFromExpanded(id);
            toast.success(MENSAJES.TOAST_SUCCESS_ELIMINAR_TEMPORAL);
        }
    };

    const handleActualizarFormato = (id: string, campo: keyof FormatoTemporal, valor: string | number) => {
        setFormatos((prev) => {
            const actualizados = prev.map((f) => {
                if (f.id === id) {
                    const actualizado = { ...f, [campo]: valor };
                    return validarYActualizarFormato(actualizado);
                }
                return f;
            });

            // Programar actualización con debounce si es formato existente
            const formatoActualizado = actualizados.find((f) => f.id === id);
            if (formatoActualizado) {
                scheduleUpdate(id, formatoActualizado);
            }

            return actualizados;
        });
    };

    const handleCancelarFormulario = () => {
        setMostrarFormulario(false);
        setFormatoNuevo(FORMATO_INICIAL);
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
                            <FormatoItem
                                key={formato.id}
                                formato={formato}
                                cantidadEquipos={cantidadEquipos}
                                isExpanded={formatosExpandidos.has(formato.id)}
                                onToggleExpand={() => toggleExpandFormato(formato.id)}
                                onActualizar={(campo, valor) =>
                                    handleActualizarFormato(formato.id, campo, valor)
                                }
                                onEliminar={() => handleEliminarFormato(formato.id)}
                            />
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
                    <FormularioNuevoFormato
                        formatoNuevo={formatoNuevo}
                        cantidadEquipos={cantidadEquipos}
                        onFormatoNuevoChange={setFormatoNuevo}
                        onAgregar={handleAgregarFormato}
                        onCancelar={handleCancelarFormulario}
                    />
                )}

                {/* Preview de tabla */}
                {formatos.length > 0 && (
                    <PreviewTabla formatos={formatos} cantidadEquipos={cantidadEquipos} />
                )}
            </div>
        </div>
    );
};

export default FormatosPosicionStep;

