import { FileCheck, FileWarning, FileX, AlertCircle } from 'lucide-react';
import { FichaMedica } from '@/app/services/fichaMedica.service';
import React from 'react';

interface BadgeEstadoProps {
    fichaMedica: FichaMedica | null;
}

type EstadoFicha = 'E' | 'A' | 'V' | 'R' | 'I';

interface EstadoConfig {
    icon: React.ReactElement;
    text: string;
    className: string;
}

export const BadgeEstado = ({ fichaMedica }: BadgeEstadoProps) => {
    if (!fichaMedica) {
        return (
            <span className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--gray-300)] text-[var(--gray-100)] flex items-center gap-2">
                <FileX className="w-4 h-4" />
                Sin ficha médica
            </span>
        );
    }

    if (fichaMedica.valida) {
        return (
            <span className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Válida
            </span>
        );
    }

    const estadoConfig: Record<EstadoFicha, EstadoConfig> = {
        E: {
            icon: <FileWarning className="w-4 h-4" />,
            text: 'En revisión',
            className: 'bg-[var(--color-warning)] text-white',
        },
        A: {
            icon: <FileCheck className="w-4 h-4" />,
            text: 'Activa',
            className: 'bg-[var(--color-primary)] text-white',
        },
        V: {
            icon: <FileWarning className="w-4 h-4" />,
            text: 'Vencida',
            className: 'bg-[var(--yellow)] text-white',
        },
        R: {
            icon: <FileX className="w-4 h-4" />,
            text: 'Rechazada',
            className: 'bg-[var(--red)] text-white',
        },
        I: {
            icon: <AlertCircle className="w-4 h-4" />,
            text: 'Inactiva',
            className: 'bg-[var(--gray-300)] text-[var(--gray-100)]',
        },
    };

    const config = estadoConfig[fichaMedica.estado as EstadoFicha] || estadoConfig.I;

    return (
        <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${config.className}`}>
            {config.icon}
            {config.text}
        </span>
    );
};

