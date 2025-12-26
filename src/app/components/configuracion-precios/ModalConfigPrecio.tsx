'use client';

import { useState, useEffect } from 'react';
import { ConfiguracionPrecio, CrearPrecioInput, TipoConcepto, UnidadMedida } from '@/app/services/configuracionPrecio.services';
import { useCrearPrecio, useActualizarPrecio } from '@/app/hooks/useConfiguracionPrecios';
import { X, Loader2, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface ModalConfigPrecioProps {
    isOpen: boolean;
    onClose: () => void;
    precioEditando: ConfiguracionPrecio | null;
    id_edicion: number;
    onSuccess: () => void;
}

export default function ModalConfigPrecio({
    isOpen,
    onClose,
    precioEditando,
    id_edicion,
    onSuccess
}: ModalConfigPrecioProps) {
    const [formData, setFormData] = useState<CrearPrecioInput>({
        id_edicion,
        id_categoria_edicion: null,
        tipo_concepto: 'CANCHA',
        unidad: 'POR_PARTIDO',
        monto: 0,
        monto_transferencia: null,
        fecha_desde: new Date().toISOString().split('T')[0],
        fecha_hasta: null,
        descripcion: '',
        observaciones: ''
    });

    const [esGlobal, setEsGlobal] = useState(true);
    const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState<number | null>(null);

    const crearPrecio = useCrearPrecio({
        onSuccess: () => {
            toast.success('Precio creado exitosamente');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al crear precio');
        }
    });

    const actualizarPrecio = useActualizarPrecio({
        onSuccess: () => {
            toast.success('Precio actualizado exitosamente');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar precio');
        }
    });

    useEffect(() => {
        if (precioEditando) {
            setFormData({
                id_edicion: precioEditando.id_edicion,
                id_categoria_edicion: precioEditando.id_categoria_edicion,
                tipo_concepto: precioEditando.tipo_concepto,
                unidad: precioEditando.unidad,
                monto: precioEditando.monto,
                monto_transferencia: precioEditando.monto_transferencia,
                fecha_desde: precioEditando.fecha_desde.split('T')[0],
                fecha_hasta: precioEditando.fecha_hasta ? precioEditando.fecha_hasta.split('T')[0] : null,
                descripcion: precioEditando.descripcion || '',
                observaciones: precioEditando.observaciones || ''
            });
            setEsGlobal(precioEditando.id_categoria_edicion === null);
            setIdCategoriaSeleccionada(precioEditando.id_categoria_edicion);
        } else {
            setFormData({
                id_edicion,
                id_categoria_edicion: null,
                tipo_concepto: 'CANCHA',
                unidad: 'POR_PARTIDO',
                monto: 0,
                monto_transferencia: null,
                fecha_desde: new Date().toISOString().split('T')[0],
                fecha_hasta: null,
                descripcion: '',
                observaciones: '',
                aplicar_fines_semana: false,
                aplicar_feriados: false
            });
            setEsGlobal(true);
            setIdCategoriaSeleccionada(null);
        }
    }, [precioEditando, id_edicion, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.monto <= 0) {
            toast.error('El monto debe ser mayor a 0');
            return;
        }

        if (!esGlobal && !idCategoriaSeleccionada) {
            toast.error('Debe seleccionar una categoría');
            return;
        }

        if (precioEditando) {
            // Actualizar precio existente
            actualizarPrecio.mutate({
                id_config: precioEditando.id_config,
                data: {
                    monto: formData.monto,
                    monto_transferencia: formData.monto_transferencia || null,
                    unidad: formData.unidad,
                    fecha_desde: formData.fecha_desde,
                    fecha_hasta: formData.fecha_hasta || null,
                    descripcion: formData.descripcion || undefined,
                    observaciones: formData.observaciones || undefined
                }
            });
        } else {
            // Crear nuevo precio
            crearPrecio.mutate({
                ...formData,
                id_categoria_edicion: esGlobal ? null : idCategoriaSeleccionada
            });
        }
    };

    if (!isOpen) return null;

    const isLoading = crearPrecio.isPending || actualizarPrecio.isPending;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {precioEditando ? 'Editar' : 'Crear'} Precio
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-[var(--gray-300)] hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tipo de Concepto */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Tipo de Concepto <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.tipo_concepto}
                                onChange={(e) => setFormData({ ...formData, tipo_concepto: e.target.value as TipoConcepto })}
                                className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                required
                                disabled={isLoading || !!precioEditando}
                            >
                                <option value="CANCHA">Cancha</option>
                                <option value="INSCRIPCION">Inscripción</option>
                                <option value="PLANILLERO">Planillero</option>
                                <option value="ARBITRO">Árbitro</option>
                                <option value="MEDICO">Médico</option>
                                <option value="FOTOGRAFO">Fotógrafo</option>
                                <option value="VIDEOGRAFO">Videógrafo</option>
                                <option value="CAJERO">Cajero</option>
                                <option value="ENCARGADO">Encargado</option>
                                <option value="OTRO">Otro</option>
                            </select>
                        </div>

                        {/* Alcance */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Alcance <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="alcance"
                                        checked={esGlobal}
                                        onChange={() => {
                                            setEsGlobal(true);
                                            setIdCategoriaSeleccionada(null);
                                        }}
                                        disabled={isLoading || !!precioEditando}
                                        className="text-[var(--green)]"
                                    />
                                    <span className="text-white">Global (todas las categorías)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="alcance"
                                        checked={!esGlobal}
                                        onChange={() => setEsGlobal(false)}
                                        disabled={isLoading || !!precioEditando}
                                        className="text-[var(--green)]"
                                    />
                                    <span className="text-white">Específico por categoría</span>
                                </label>
                            </div>
                        </div>

                        {/* Categoría (si es específico) */}
                        {!esGlobal && (
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Categoría <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={idCategoriaSeleccionada || ''}
                                    onChange={(e) => setIdCategoriaSeleccionada(e.target.value ? parseInt(e.target.value) : null)}
                                    placeholder="ID de categoría"
                                    className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                    required={!esGlobal}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-[var(--gray-100)] mt-1">
                                    TODO: Reemplazar con selector de categorías
                                </p>
                            </div>
                        )}

                        {/* Unidad */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Unidad <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                                {(['POR_PARTIDO', 'POR_EQUIPO', 'POR_HORA', 'POR_DIA', 'POR_JORNADA'] as UnidadMedida[]).map((unidad) => (
                                    <label key={unidad} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="unidad"
                                            value={unidad}
                                            checked={formData.unidad === unidad}
                                            onChange={(e) => setFormData({ ...formData, unidad: e.target.value as UnidadMedida })}
                                            disabled={isLoading}
                                            className="text-[var(--green)]"
                                        />
                                        <span className="text-white">{unidad.replace('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Monto (Efectivo) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={formData.monto}
                                onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                placeholder="0.00"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Monto Transferencia */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Monto Transferencia (opcional)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.monto_transferencia || ''}
                                onChange={(e) => setFormData({ ...formData, monto_transferencia: e.target.value ? parseFloat(e.target.value) : null })}
                                className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                placeholder="Dejar vacío para usar el mismo precio"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-[var(--gray-100)] mt-1">
                                Si se especifica, este precio se usará cuando el pago sea por transferencia. Si se deja vacío, se usará el precio de efectivo.
                            </p>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Fecha Desde <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_desde}
                                    onChange={(e) => setFormData({ ...formData, fecha_desde: e.target.value })}
                                    className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Fecha Hasta (opcional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha_hasta || ''}
                                    onChange={(e) => setFormData({ ...formData, fecha_hasta: e.target.value || null })}
                                    className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Descripción y Observaciones */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-100)] mb-2">
                                Descripción (opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.descripcion || ''}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)]"
                                placeholder="Descripción breve del precio"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-100)] mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={formData.observaciones || ''}
                                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white focus:outline-none focus:border-[var(--green)] resize-none"
                                placeholder="Notas adicionales..."
                                disabled={isLoading}
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        {precioEditando ? 'Actualizar' : 'Guardar'} Precio
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


