'use client';

import { useState, useEffect } from 'react';
import BaseModal from './ModalPlanillero';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAbrirCaja } from '@/app/hooks/useCaja';
import { DollarSign, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface AbrirCajaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AbrirCajaModal({ isOpen, onClose, onSuccess }: AbrirCajaModalProps) {
    const [saldoInicial, setSaldoInicial] = useState<string>('0');
    const [turno, setTurno] = useState<string>('');
    const [observaciones, setObservaciones] = useState<string>('');
    const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);

    const abrirCaja = useAbrirCaja({
        onSuccess: () => {
            toast.success('Caja abierta exitosamente');
            onSuccess?.();
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al abrir caja');
        }
    });

    useEffect(() => {
        if (isOpen) {
            // Resetear formulario al abrir
            setSaldoInicial('0');
            setTurno('');
            setObservaciones('');
            setFecha(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (abrirCaja.isPending) return;
        onClose();
    };

    const handleSubmit = () => {
        const saldo = parseFloat(saldoInicial);
        
        if (isNaN(saldo) || saldo < 0) {
            toast.error('El saldo inicial debe ser un número mayor o igual a 0');
            return;
        }

        abrirCaja.mutate({
            fecha: new Date(fecha),
            turno: turno.trim() || undefined,
            saldo_inicial: saldo,
            observaciones: observaciones.trim() || undefined
        });
    };

    const isLoading = abrirCaja.isPending;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Abrir caja"
        >
            <div className="space-y-4">
                {/* Información */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)]">
                        Para registrar pagos en efectivo, primero debes abrir una caja. 
                        El saldo inicial será el dinero físico con el que comienzas el día.
                    </p>
                </div>

                {/* Fecha */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Fecha *
                    </label>
                    <Input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        icon={<Calendar className="w-4 h-4" />}
                    />
                </div>

                {/* Saldo inicial */}
                <Input
                    label="Saldo inicial *"
                    type="number"
                    value={saldoInicial}
                    onChange={(e) => setSaldoInicial(e.target.value)}
                    min={0}
                    step={0.01}
                    icon={<DollarSign className="w-4 h-4" />}
                    placeholder="0.00"
                    error={saldoInicial && parseFloat(saldoInicial) < 0 ? 'El saldo inicial no puede ser negativo' : undefined}
                />

                {/* Turno (opcional) */}
                <Input
                    label="Turno (opcional)"
                    value={turno}
                    onChange={(e) => setTurno(e.target.value)}
                    placeholder="Ej: Mañana, Tarde, Noche"
                />

                {/* Observaciones */}
                <Textarea
                    label="Observaciones (opcional)"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                    placeholder="Notas adicionales sobre la apertura de caja..."
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
                    disabled={isLoading || !saldoInicial || parseFloat(saldoInicial) < 0}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Abriendo...
                        </>
                    ) : (
                        <>
                            <DollarSign className="w-4 h-4" />
                            Abrir caja
                        </>
                    )}
                </Button>
            </div>
        </BaseModal>
    );
}

