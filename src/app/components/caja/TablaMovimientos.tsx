'use client';

import { MovimientoCaja } from '@/app/services/movimientoCaja.service';
// Función simple para formatear fecha
const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
import { TrendingUp, TrendingDown, DollarSign, X, Wallet, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import { useAnularMovimiento } from '@/app/hooks/useMovimientosCaja';
import toast from 'react-hot-toast';
import { Input } from '../ui/Input';
import MovimientosCajaTableSkeleton from '../skeletons/MovimientosCajaTableSkeleton';

interface TablaMovimientosProps {
    movimientos: MovimientoCaja[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export default function TablaMovimientos({ movimientos, isLoading, onRefresh }: TablaMovimientosProps) {
    const [movimientoAnular, setMovimientoAnular] = useState<MovimientoCaja | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [modalAnularAbierto, setModalAnularAbierto] = useState(false);

    const anularMovimiento = useAnularMovimiento({
        onSuccess: () => {
            toast.success('Movimiento anulado exitosamente');
            setModalAnularAbierto(false);
            setMovimientoAnular(null);
            setMotivoAnulacion('');
            onRefresh?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al anular movimiento');
        }
    });

    const handleAnular = (movimiento: MovimientoCaja) => {
        setMovimientoAnular(movimiento);
        setModalAnularAbierto(true);
    };

    const confirmarAnulacion = () => {
        if (!movimientoAnular || !motivoAnulacion.trim()) {
            toast.error('Debes ingresar un motivo para anular el movimiento');
            return;
        }

        if (motivoAnulacion.trim().length < 10) {
            toast.error('El motivo debe tener al menos 10 caracteres');
            return;
        }

        anularMovimiento.mutate({
            id_movimiento: movimientoAnular.id_movimiento,
            data: { motivo: motivoAnulacion.trim() }
        });
    };

    if (isLoading) {
        return <MovimientosCajaTableSkeleton />;
    }

    if (movimientos.length === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-12 text-center">
                <DollarSign className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay movimientos</h3>
                <p className="text-[var(--gray-100)]">
                    Aún no se han registrado movimientos en esta caja
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--black-950)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Concepto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Método
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Registrado por
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Observaciones
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {movimientos.map((movimiento) => (
                                <tr
                                    key={movimiento.id_movimiento}
                                    className={`hover:bg-[var(--black-950)] transition-colors ${
                                        movimiento.anulado ? 'opacity-50' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {formatDate(movimiento.fecha_movimiento)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {movimiento.categoria === 'INGRESO' ? (
                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className={`text-sm font-medium ${
                                                movimiento.categoria === 'INGRESO' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {movimiento.categoria}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {movimiento.tipoMovimiento?.nombre || movimiento.concepto}
                                            </p>
                                            {movimiento.transaccionPago && (
                                                <div className="mt-1">
                                                    {movimiento.transaccionPago.pago?.equipo && movimiento.transaccionPago.pago?.partido && (
                                                        <p className="text-xs text-[var(--gray-100)]">
                                                            {movimiento.transaccionPago.pago.equipo.nombre} - {movimiento.transaccionPago.pago.partido.equipoLocal?.nombre || 'Local'} vs {movimiento.transaccionPago.pago.partido.equipoVisita?.nombre || 'Visita'}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            {movimiento.anulado && (
                                                <p className="text-xs text-red-400 mt-1">
                                                    Anulado: {movimiento.motivo_anulacion}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {movimiento.afecta_saldo_fisico ? (
                                                <Wallet className="w-4 h-4 text-[var(--green)]" title="Dinero físico" />
                                            ) : (
                                                <CreditCard className="w-4 h-4 text-blue-400" title="Dinero digital" />
                                            )}
                                            <span className={`text-sm ${
                                                movimiento.afecta_saldo_fisico ? 'text-[var(--green)]' : 'text-blue-400'
                                            }`}>
                                                {movimiento.metodo_pago}
                                            </span>
                                            {!movimiento.afecta_saldo_fisico && (
                                                <span className="text-xs text-[var(--gray-100)]">(Digital)</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                                        movimiento.categoria === 'INGRESO' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {movimiento.categoria === 'INGRESO' ? '+' : '-'}$
                                        {Number(movimiento.monto).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-100)]">
                                        {movimiento.registrador 
                                            ? `${movimiento.registrador.nombre} ${movimiento.registrador.apellido}`
                                            : '-'
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--gray-100)] max-w-[200px]">
                                        {movimiento.observaciones ? (
                                            <span className="text-xs line-clamp-2" title={movimiento.observaciones}>
                                                {movimiento.observaciones}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-[var(--gray-300)] italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {!movimiento.anulado && movimiento.afecta_saldo_fisico && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleAnular(movimiento)}
                                                disabled={anularMovimiento.isPending}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación para anular */}
            <ConfirmActionModal
                isOpen={modalAnularAbierto}
                onClose={() => {
                    setModalAnularAbierto(false);
                    setMovimientoAnular(null);
                    setMotivoAnulacion('');
                }}
                onConfirm={confirmarAnulacion}
                title="Anular movimiento"
                message="¿Estás seguro de que deseas anular este movimiento? Esta acción no se puede deshacer."
                confirmText="Anular"
                cancelText="Cancelar"
                variant="danger"
                isLoading={anularMovimiento.isPending}
                details={
                    <div className="mt-4 space-y-4">
                        <Input
                            label="Motivo de anulación *"
                            value={motivoAnulacion}
                            onChange={(e) => setMotivoAnulacion(e.target.value)}
                            placeholder="Ingresa el motivo de la anulación (mínimo 10 caracteres)"
                            error={motivoAnulacion && motivoAnulacion.trim().length < 10 ? 'El motivo debe tener al menos 10 caracteres' : undefined}
                        />
                        {movimientoAnular && (
                            <div className="p-3 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg">
                                <p className="text-sm text-[var(--gray-100)] mb-1">Movimiento a anular:</p>
                                <p className="text-white font-medium">
                                    {movimientoAnular.tipoMovimiento?.nombre || movimientoAnular.concepto} - 
                                    ${Number(movimientoAnular.monto).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        )}
                    </div>
                }
            />
        </>
    );
}

