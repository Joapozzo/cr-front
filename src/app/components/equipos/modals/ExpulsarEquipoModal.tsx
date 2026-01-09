'use client';

import { AlertTriangle } from 'lucide-react';
import { FormModal } from '@/app/components/modals/ModalAdmin';
import toast from 'react-hot-toast';

interface Equipo {
    id_equipo: number;
    nombre: string;
}

interface ExpulsarEquipoModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipo: Equipo | null;
    onConfirm: (formData: { motivo?: string }) => Promise<void>;
}

export default function ExpulsarEquipoModal({
    isOpen,
    onClose,
    equipo,
    onConfirm
}: ExpulsarEquipoModalProps) {
    if (!equipo) return null;

    const expulsionFields = [
        {
            name: 'motivo',
            label: 'Motivo de la expulsión',
            type: 'textarea' as const,
            placeholder: 'Describe el motivo de la expulsión (opcional)',
            required: false
        }
    ];

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Expulsar Equipo: ${equipo.nombre}`}
            fields={expulsionFields}
            onSubmit={onConfirm}
            submitText="Confirmar expulsión"
            type="edit"
        >
            <div className="mb-6 p-4 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-[var(--red)] flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h4 className="text-[var(--red)] font-medium">
                            Advertencia: Esta acción tendrá las siguientes consecuencias
                        </h4>
                        <ul className="text-[var(--red)]/80 text-sm space-y-1 ml-2">
                            <li>• El equipo será removido de todas las zonas del torneo</li>
                            <li>• Se liberarán las vacantes que ocupaba</li>
                            <li>• Los partidos ya jugados se mantendrán en el historial</li>
                            <li>• El plantel de jugadores se mantendrá intacto</li>
                            <li>• Podrá ser reactivado posteriormente si es necesario</li>
                        </ul>
                    </div>
                </div>
            </div>
        </FormModal>
    );
}

