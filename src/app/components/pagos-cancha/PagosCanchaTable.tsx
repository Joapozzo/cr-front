'use client';

import { PagoCancha } from '@/app/types/pagoCancha';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DollarSign, Clock, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import PagarCanchaModal from './PagarCanchaModal';
import { useState } from 'react';
import { useAnularPagoCancha } from '@/app/hooks/usePagosCancha';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';

interface PagosCanchaTableProps {
    pagos: PagoCancha[];
    onPagoRegistrado?: () => void;
}

export default function PagosCanchaTable({ pagos, onPagoRegistrado }: PagosCanchaTableProps) {
    const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoCancha | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [pagoAnular, setPagoAnular] = useState<PagoCancha | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [modalAnularAbierto, setModalAnularAbierto] = useState(false);

    const anularPago = useAnularPagoCancha({
        onSuccess: () => {
            toast.success('Pago anulado exitosamente. El pago ha sido revertido completamente.');
            setModalAnularAbierto(false);
            setPagoAnular(null);
            setMotivoAnulacion('');
            onPagoRegistrado?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al anular pago');
        }
    });

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'PAGADO':
                return (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Pagado
                    </span>
                );
            case 'PARCIAL':
                return (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Parcial
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Pendiente
                    </span>
                );
        }
    };

    const handlePagar = (pago: PagoCancha) => {
        setPagoSeleccionado(pago);
        setModalAbierto(true);
    };

    const handleAnular = (pago: PagoCancha) => {
        setPagoAnular(pago);
        setModalAnularAbierto(true);
    };

    const confirmarAnulacion = () => {
        if (!pagoAnular || !motivoAnulacion.trim()) {
            toast.error('Debes ingresar un motivo para anular el pago');
            return;
        }

        if (motivoAnulacion.trim().length < 10) {
            toast.error('El motivo debe tener al menos 10 caracteres');
            return;
        }

        anularPago.mutate({
            id_pago: pagoAnular.id_pago,
            motivo: motivoAnulacion.trim()
        });
    };

    return (
        <>
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--black-950)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Partido
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Equipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Observaciones
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {pagos.map((pago) => (
                                <tr key={pago.id_pago} className="hover:bg-[var(--black-950)] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            {pago.partido?.equipoLocal?.nombre} vs {pago.partido?.equipoVisita?.nombre}
                                        </div>
                                        <div className="text-xs text-[var(--gray-100)]">
                                            {pago.partido?.cancha_ref?.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">
                                            {pago.equipo?.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            ${Number(pago.monto_total).toLocaleString('es-AR')}
                                        </div>
                                        <div className="text-xs text-[var(--gray-100)]">
                                            Pagado: ${Number(pago.monto_pagado).toLocaleString('es-AR')}
                                        </div>
                                        <div className="text-xs text-yellow-400 font-medium">
                                            Pendiente: ${Number(pago.monto_pendiente).toLocaleString('es-AR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getEstadoBadge(pago.estado_pago)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-100)]">
                                        {pago.partido?.dia
                                            ? format(new Date(pago.partido.dia), 'dd/MM/yyyy', { locale: es })
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--gray-100)] max-w-xs">
                                        {(() => {
                                            // Verificar si hay transacciones y si tienen observaciones
                                            const transacciones = pago.transacciones || [];
                                            // Filtrar solo observaciones reales (excluir las de anulación)
                                            const transaccionesConObs = transacciones.filter((t: any) => {
                                                const obs = t.observaciones ? String(t.observaciones).trim() : '';
                                                // Excluir observaciones que empiezan con "Anulado:" ya que son información de anulación, no observaciones del pago
                                                return obs.length > 0 && !obs.startsWith('Anulado:');
                                            });
                                            
                                            if (transaccionesConObs.length === 0) {
                                                return <span className="text-xs text-[var(--gray-300)] italic">Sin observaciones</span>;
                                            }
                                            
                                            return (
                                                <div className="space-y-1">
                                                    {transaccionesConObs.map((transaccion: any, idx: number) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="text-[var(--green)] font-medium">
                                                                {transaccion.metodo_pago}:
                                                            </span>
                                                            <span className="text-[var(--gray-100)] ml-1">
                                                                {transaccion.observaciones}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {pago.estado_pago !== 'PAGADO' && (
                                                <button
                                                    onClick={() => handlePagar(pago)}
                                                    className="bg-[var(--green)] hover:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                    Pagar
                                                </button>
                                            )}
                                            {/* Solo mostrar anular si tiene pagos registrados */}
                                            {(pago.estado_pago === 'PAGADO' || pago.estado_pago === 'PARCIAL') && Number(pago.monto_pagado) > 0 && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleAnular(pago)}
                                                    disabled={anularPago.isPending}
                                                    className="flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Anular
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagoSeleccionado && (
                <PagarCanchaModal
                    isOpen={modalAbierto}
                    onClose={() => {
                        setModalAbierto(false);
                        setPagoSeleccionado(null);
                    }}
                    pago={pagoSeleccionado}
                    onPagoRegistrado={onPagoRegistrado}
                />
            )}

            {/* Modal de confirmación para anular pago */}
            <ConfirmActionModal
                isOpen={modalAnularAbierto}
                onClose={() => {
                    if (!anularPago.isPending) {
                        setModalAnularAbierto(false);
                        setPagoAnular(null);
                        setMotivoAnulacion('');
                    }
                }}
                onConfirm={confirmarAnulacion}
                title="Anular pago de cancha"
                message="¿Estás seguro de que deseas anular este pago? Esta acción revertirá completamente el pago: el movimiento de caja se anulará y el equipo volverá a estado 'no pagado'."
                confirmText="Anular pago"
                cancelText="Cancelar"
                variant="danger"
                isLoading={anularPago.isPending}
                details={
                    <div className="mt-4 space-y-4">
                        <Input
                            label="Motivo de anulación *"
                            value={motivoAnulacion}
                            onChange={(e) => setMotivoAnulacion(e.target.value)}
                            placeholder="Ingresa el motivo de la anulación (mínimo 10 caracteres)"
                            error={motivoAnulacion && motivoAnulacion.trim().length < 10 ? 'El motivo debe tener al menos 10 caracteres' : undefined}
                        />
                        {pagoAnular && (
                            <div className="p-3 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg">
                                <p className="text-sm text-[var(--gray-100)] mb-1">Pago a anular:</p>
                                <p className="text-white font-medium">
                                    {pagoAnular.equipo?.nombre} - ${Number(pagoAnular.monto_pagado).toLocaleString('es-AR')} pagado
                                </p>
                                <p className="text-xs text-[var(--gray-100)] mt-1">
                                    Se revertirá el pago completo y el equipo volverá a estado pendiente
                                </p>
                            </div>
                        )}
                    </div>
                }
            />
        </>
    );
}

