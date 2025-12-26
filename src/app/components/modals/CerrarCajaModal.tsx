'use client';

import { useState, useEffect } from 'react';
import BaseModal from './ModalPlanillero';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCerrarCaja, useCajaActual } from '@/app/hooks/useCaja';
import { DollarSign, Loader2, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

interface CerrarCajaModalProps {
    isOpen: boolean;
    onClose: () => void;
    id_caja: number;
    saldoEsperado: number;
    onSuccess?: () => void;
}

export default function CerrarCajaModal({ 
    isOpen, 
    onClose, 
    id_caja, 
    saldoEsperado,
    onSuccess 
}: CerrarCajaModalProps) {
    const [saldoFisico, setSaldoFisico] = useState<string>('');
    const [observaciones, setObservaciones] = useState<string>('');

    const cerrarCaja = useCerrarCaja({
        onSuccess: () => {
            toast.success('Caja cerrada exitosamente');
            onSuccess?.();
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al cerrar caja');
        }
    });

    useEffect(() => {
        if (isOpen) {
            // Prellenar con el saldo esperado
            setSaldoFisico(saldoEsperado.toFixed(2));
            setObservaciones('');
        }
    }, [isOpen, saldoEsperado]);

    const handleClose = () => {
        if (cerrarCaja.isPending) return;
        onClose();
    };

    const handleSubmit = () => {
        const saldo = parseFloat(saldoFisico);
        
        if (isNaN(saldo) || saldo < 0) {
            toast.error('El saldo físico debe ser un número mayor o igual a 0');
            return;
        }

        cerrarCaja.mutate({
            id_caja,
            data: {
                saldo_fisico: saldo,
                observaciones: observaciones.trim() || undefined
            }
        });
    };

    const diferencia = parseFloat(saldoFisico) - saldoEsperado;
    const hayDiferencia = Math.abs(diferencia) > 0.01; // Tolerancia de centavos

    const isLoading = cerrarCaja.isPending;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Cerrar caja"
        >
            <div className="space-y-4">
                {/* Información */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-[var(--gray-100)] mb-1">Saldo esperado (físico)</p>
                                <p className="text-lg font-semibold text-white">
                                    ${saldoEsperado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            {hayDiferencia && (
                                <div>
                                    <p className="text-xs text-[var(--gray-100)] mb-1">Diferencia</p>
                                    <p className={`text-lg font-semibold ${diferencia > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {diferencia > 0 ? '+' : ''}${diferencia.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-[var(--gray-100)]">
                            <strong>Importante:</strong> Solo debes contar el dinero físico (efectivo) que tienes en caja. 
                            Las transferencias y pagos de MercadoPago no se cuentan en el saldo físico.
                        </p>
                    </div>
                </div>

                {/* Saldo físico */}
                <Input
                    label="Saldo físico *"
                    type="number"
                    value={saldoFisico}
                    onChange={(e) => setSaldoFisico(e.target.value)}
                    min={0}
                    step={0.01}
                    icon={<DollarSign className="w-4 h-4" />}
                    placeholder="0.00"
                    error={saldoFisico && parseFloat(saldoFisico) < 0 ? 'El saldo físico no puede ser negativo' : undefined}
                />

                {/* Advertencia de diferencia */}
                {hayDiferencia && (
                    <div className={`p-4 rounded-lg border ${
                        diferencia > 0 
                            ? 'bg-green-500/10 border-green-500/50' 
                            : 'bg-red-500/10 border-red-500/50'
                    }`}>
                        <p className={`text-sm font-medium ${
                            diferencia > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {diferencia > 0 
                                ? `⚠️ Hay un sobrante de $${Math.abs(diferencia).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : `⚠️ Hay una falta de $${Math.abs(diferencia).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                        </p>
                    </div>
                )}

                {/* Observaciones */}
                <Textarea
                    label="Observaciones (opcional)"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                    placeholder="Notas sobre el cierre de caja, diferencias, etc..."
                />
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    variant="default"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    variant="footer"
                    onClick={handleSubmit}
                    className="flex-1 flex items-center gap-2 justify-center"
                    disabled={isLoading || !saldoFisico || parseFloat(saldoFisico) < 0}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cerrando...
                        </>
                    ) : (
                        <>
                            <Calculator className="w-4 h-4" />
                            Cerrar caja
                        </>
                    )}
                </Button>
            </div>
        </BaseModal>
    );
}

