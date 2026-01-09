'use client';

import { RotateCcw } from 'lucide-react';
import { FormModal } from '@/app/components/modals/ModalAdmin';

interface Equipo {
    id_equipo: number;
    nombre: string;
    expulsion?: {
        motivo?: string;
        fecha_expulsion: string;
    };
    [key: string]: unknown;
}

interface ReactivarEquipoModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipo: Equipo | null;
    onConfirm: () => Promise<void>;
}

export default function ReactivarEquipoModal({
    isOpen,
    onClose,
    equipo,
    onConfirm
}: ReactivarEquipoModalProps) {
    if (!equipo) return null;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Reactivar Equipo: ${equipo.nombre}`}
            fields={[]}
            onSubmit={onConfirm}
            submitText="Confirmar Reactivación"
            type="edit"
        >
            <div className="mb-6 p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <RotateCcw className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h4 className="text-[var(--color-primary)] font-medium">
                            Al reactivar este equipo:
                        </h4>
                        <ul className="text-[var(--color-primary)]/80 text-sm space-y-1 ml-2">
                            <li>• El equipo volverá a estar disponible para participar</li>
                            <li>• Podrá ser asignado a nuevas zonas y vacantes</li>
                            <li>• Su plantel de jugadores seguirá intacto</li>
                            <li>• Los partidos del historial se mantendrán</li>
                            <li>• Aparecerá nuevamente en la lista de equipos activos</li>
                        </ul>

                        {equipo.expulsion && (
                            <div className="mt-3 p-3 bg-[var(--gray-300)] rounded-lg">
                                <p className="text-[var(--gray-100)] text-sm">
                                    <strong>Motivo de expulsión anterior: </strong>
                                    {equipo.expulsion.motivo || 'Sin motivo especificado'}
                                </p>
                                <p className="text-[var(--gray-100)] text-xs mt-1">
                                    Expulsado el:{' '}
                                    {new Date(equipo.expulsion.fecha_expulsion).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FormModal>
    );
}

