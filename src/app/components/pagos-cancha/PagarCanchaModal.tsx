'use client';

import { useState } from 'react';
import BaseModal from '../modals/ModalPlanillero';
import { PagoCancha } from '@/app/types/pagoCancha';
import { DollarSign, CreditCard, QrCode, Loader2 } from 'lucide-react';
import { useRegistrarPagoEfectivo, useRegistrarPagoTransferencia, useGenerarQR } from '@/app/hooks/usePagosCancha';
import { useCajaActual } from '@/app/hooks/useCaja';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import QRModal from './QRModal';
import AbrirCajaModal from '../modals/AbrirCajaModal';

interface PagarCanchaModalProps {
    isOpen: boolean;
    onClose: () => void;
    pago: PagoCancha;
    onPagoRegistrado?: () => void;
}

type MetodoPago = 'efectivo' | 'transferencia' | 'mercadopago';

export default function PagarCanchaModal({ isOpen, onClose, pago, onPagoRegistrado }: PagarCanchaModalProps) {
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
    const [monto, setMonto] = useState<string>(Number(pago.monto_pendiente).toString());
    const [observaciones, setObservaciones] = useState('');
    
    // Datos para transferencia
    const [numeroOperacion, setNumeroOperacion] = useState('');
    const [bancoOrigen, setBancoOrigen] = useState('');
    const [comprobanteTransferencia, setComprobanteTransferencia] = useState('');

    // QR de MercadoPago
    const [qrData, setQrData] = useState<string | null>(null);
    const [qrModalAbierto, setQrModalAbierto] = useState(false);

    // Caja
    const [abrirCajaModalAbierto, setAbrirCajaModalAbierto] = useState(false);
    const { data: cajaActual, refetch: refetchCaja } = useCajaActual({
        enabled: isOpen && metodoPago === 'efectivo' // Solo consultar si el modal está abierto y el método es efectivo
    });

    // Mutations
    const registrarEfectivo = useRegistrarPagoEfectivo({
        onSuccess: () => {
            toast.success('Pago en efectivo registrado exitosamente');
            onPagoRegistrado?.(); // Llamar callback para actualizar la lista
            onClose();
        },
        onError: (error: Error) => {
            // Si el error es que no hay caja abierta, mostrar modal de abrir caja
            if (error.message?.includes('Debe abrir una caja') || error.message?.includes('caja debe estar abierta')) {
                setAbrirCajaModalAbierto(true);
            } else {
                toast.error(error.message || 'Error al registrar pago');
            }
        }
    });

    const registrarTransferencia = useRegistrarPagoTransferencia({
        onSuccess: () => {
            toast.success('Pago por transferencia registrado exitosamente');
            onPagoRegistrado?.(); // Llamar callback para actualizar la lista
            onClose();
        },
        onError: (error: Error) => {
            // Si el error es que no hay caja abierta, mostrar modal de abrir caja
            if (error.message?.includes('Debe abrir una caja') || error.message?.includes('caja debe estar abierta')) {
                setAbrirCajaModalAbierto(true);
            } else {
                toast.error(error.message || 'Error al registrar pago');
            }
        }
    });

    const generarQR = useGenerarQR({
        onSuccess: (data) => {
            setQrData(data.qr_data);
            setQrModalAbierto(true);
            toast.success('QR generado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al generar QR');
        }
    });

    const montoPendiente = Number(pago.monto_pendiente);
    const montoIngresado = parseFloat(monto) || 0;

    const handleSubmit = async () => {
        if (montoIngresado <= 0 || montoIngresado > montoPendiente) {
            toast.error(`El monto debe estar entre $1 y $${montoPendiente.toLocaleString('es-AR')}`);
            return;
        }

        if (metodoPago === 'efectivo') {
            // Verificar si hay caja abierta antes de procesar
            if (!cajaActual) {
                setAbrirCajaModalAbierto(true);
                return;
            }

            registrarEfectivo.mutate({
                id_pago: pago.id_pago,
                monto: montoIngresado,
                observaciones: observaciones || undefined
            });
        } else if (metodoPago === 'transferencia') {
            if (!numeroOperacion || !bancoOrigen) {
                toast.error('Complete todos los campos requeridos');
                return;
            }

            // Verificar si hay caja abierta antes de procesar transferencia
            if (!cajaActual) {
                setAbrirCajaModalAbierto(true);
                return;
            }

            registrarTransferencia.mutate({
                id_pago: pago.id_pago,
                monto: montoIngresado,
                numero_operacion: numeroOperacion,
                banco_origen: bancoOrigen,
                comprobante_transferencia: comprobanteTransferencia || undefined,
                observaciones: observaciones || undefined
            });
        } else if (metodoPago === 'mercadopago') {
            // Para MercadoPago, el monto debe ser el pendiente completo
            if (montoIngresado !== montoPendiente) {
                toast.error('Para pagar con MercadoPago debe pagar el monto pendiente completo');
                return;
            }
            generarQR.mutate(pago.id_pago);
        }
    };

    const isLoading = registrarEfectivo.isPending || registrarTransferencia.isPending || generarQR.isPending;

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="Registrar pago de cancha"
            >
                <div className="space-y-6">
                    {/* Información del pago */}
                    <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-[var(--gray-100)] mb-1">Equipo</p>
                                <p className="text-sm font-medium text-white">{pago.equipo?.nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--gray-100)] mb-1">Monto Total</p>
                                <p className="text-sm font-medium text-white">${Number(pago.monto_total).toLocaleString('es-AR')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--gray-100)] mb-1">Monto Pagado</p>
                                <p className="text-sm font-medium text-green-400">${Number(pago.monto_pagado).toLocaleString('es-AR')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--gray-100)] mb-1">Monto Pendiente</p>
                                <p className="text-sm font-medium text-yellow-400">${montoPendiente.toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Selector de método de pago */}
                    <div>
                        <p className="text-sm font-medium text-white mb-3">Método de Pago</p>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setMetodoPago('efectivo')}
                                className={`p-4 rounded-lg border-2 transition-all relative ${
                                    metodoPago === 'efectivo'
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                        : 'border-[var(--gray-300)] bg-[var(--black-950)] hover:border-[var(--color-primary)]'
                                }`}
                            >
                                <DollarSign className={`w-6 h-6 mx-auto mb-2 ${metodoPago === 'efectivo' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`} />
                                <p className={`text-xs font-medium ${metodoPago === 'efectivo' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`}>
                                    Efectivo
                                </p>
                                {(metodoPago === 'efectivo' || metodoPago === 'transferencia') && !cajaActual && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[var(--black-950)]" title="Caja no abierta" />
                                )}
                            </button>
                            <button
                                onClick={() => setMetodoPago('transferencia')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    metodoPago === 'transferencia'
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                        : 'border-[var(--gray-300)] bg-[var(--black-950)] hover:border-[var(--color-primary)]'
                                }`}
                            >
                                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${metodoPago === 'transferencia' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`} />
                                <p className={`text-xs font-medium ${metodoPago === 'transferencia' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`}>
                                    Transferencia
                                </p>
                            </button>
                            <button
                                onClick={() => setMetodoPago('mercadopago')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    metodoPago === 'mercadopago'
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                        : 'border-[var(--gray-300)] bg-[var(--black-950)] hover:border-[var(--color-primary)]'
                                }`}
                            >
                                <QrCode className={`w-6 h-6 mx-auto mb-2 ${metodoPago === 'mercadopago' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`} />
                                <p className={`text-xs font-medium ${metodoPago === 'mercadopago' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`}>
                                    MercadoPago
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Advertencia si no hay caja abierta */}
                    {!cajaActual && (metodoPago === 'efectivo' || metodoPago === 'transferencia') && (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                            <p className="text-sm text-yellow-400">
                                <strong>⚠️ Caja no abierta:</strong> Debes abrir una caja antes de registrar pagos en {metodoPago === 'efectivo' ? 'efectivo' : 'transferencia'}. 
                                Se abrirá un modal para abrir la caja al intentar registrar el pago.
                            </p>
                        </div>
                    )}

                    {/* Formulario según método */}
                    <div className="space-y-4">
                        {metodoPago === 'mercadopago' ? (
                            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                                <p className="text-sm text-blue-400">
                                    Se generará un código QR para pagar con MercadoPago. 
                                    El monto a pagar será el pendiente completo: <strong>${montoPendiente.toLocaleString('es-AR')}</strong>
                                </p>
                            </div>
                        ) : (
                            <>
                                <Input
                                    label="Monto"
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    min={0.01}
                                    max={montoPendiente}
                                    step={0.01}
                                    error={montoIngresado > montoPendiente ? `El monto no puede ser mayor a $${montoPendiente.toLocaleString('es-AR')}` : undefined}
                                />
                                
                                {metodoPago === 'transferencia' && (
                                    <>
                                        <Input
                                            label="Número de Operación *"
                                            value={numeroOperacion}
                                            onChange={(e) => setNumeroOperacion(e.target.value)}
                                            placeholder="Ej: 123456789"
                                        />
                                        <Input
                                            label="Banco de Origen *"
                                            value={bancoOrigen}
                                            onChange={(e) => setBancoOrigen(e.target.value)}
                                            placeholder="Ej: Banco Nación"
                                        />
                                        <Input
                                            label="URL de Comprobante (opcional)"
                                            value={comprobanteTransferencia}
                                            onChange={(e) => setComprobanteTransferencia(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </>
                                )}

                                <Textarea
                                    label="Observaciones (opcional)"
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    rows={3}
                                    placeholder="Notas adicionales sobre el pago..."
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button
                        variant="default"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="footer"
                        onClick={handleSubmit}
                        className="flex-1 flex items-center gap-2 justify-center"
                        disabled={isLoading || (metodoPago !== 'mercadopago' && (montoIngresado <= 0 || montoIngresado > montoPendiente))}
                        
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : metodoPago === 'mercadopago' ? (
                            <>
                                <QrCode className="w-4 h-4 mr-2" />
                                Generar QR
                            </>
                        ) : (
                            <>
                                <DollarSign className="w-4 h-4 mr-2" />
                                Registrar Pago
                            </>
                        )}
                    </Button>
                </div>
            </BaseModal>

            {/* Modal de QR */}
            {qrData && (
                <QRModal
                    isOpen={qrModalAbierto}
                    onClose={() => {
                        setQrModalAbierto(false);
                        setQrData(null);
                        onClose();
                    }}
                    qrData={qrData}
                    monto={montoPendiente}
                    equipo={pago.equipo?.nombre || ''}
                />
            )}

            {/* Modal de abrir caja */}
            <AbrirCajaModal
                isOpen={abrirCajaModalAbierto}
                onClose={() => setAbrirCajaModalAbierto(false)}
                onSuccess={() => {
                    refetchCaja();
                    setAbrirCajaModalAbierto(false);
                }}
            />
        </>
    );
}

