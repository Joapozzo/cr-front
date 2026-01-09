'use client';

import { FileText, Ban } from 'lucide-react';

interface EquiposAlertsProps {
    totalSolicitudes: number;
    equiposInactivos: number;
}

export default function EquiposAlerts({
    totalSolicitudes,
    equiposInactivos
}: EquiposAlertsProps) {
    if (totalSolicitudes === 0 && equiposInactivos === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {totalSolicitudes > 0 && (
                <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                            <FileText className="w-5 h-5 text-[var(--yellow)]" />
                        </div>
                        <div>
                            <h3 className="text-[var(--yellow)] font-medium">
                                Solicitudes pendientes
                            </h3>
                            <p className="text-[var(--yellow)]/80 text-sm">
                                Hay {totalSolicitudes} solicitudes esperando aprobación
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {equiposInactivos > 0 && (
                <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                            <Ban className="w-5 h-5 text-[var(--red)]" />
                        </div>
                        <div>
                            <h3 className="text-[var(--red)] font-medium">
                                Equipos expulsados
                            </h3>
                            <p className="text-[var(--red)]/80 text-sm">
                                Hay {equiposInactivos} equipos expulsados de esta categoría
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

