import React from 'react';
import { cn } from './utils';
import { EstadoCredencialEnum } from './types';
import { ShieldCheck, AlertCircle, Ban } from 'lucide-react';

interface EstadoCredencialProps {
    estado: EstadoCredencialEnum | 'A' | 'R' | 'V'; // Acepta ambos formatos
    className?: string;
    variant?: 'default' | 'minimal' | 'outline';
}

export const EstadoCredencial: React.FC<EstadoCredencialProps> = ({
    estado,
    className,
    variant = 'default'
}) => {
    // Normalizar estado si viene en formato del backend ('A', 'R', 'V')
    const estadoNormalizado: EstadoCredencialEnum =
        estado === 'A' ? 'ACTIVA' :
            estado === 'R' ? 'REVOCADA' :
                estado === 'V' ? 'VENCIDA' :
                    estado as EstadoCredencialEnum;

    const styles = {
        ACTIVA: {
            default: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            minimal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 backdrop-blur-md',
            outline: 'bg-transparent text-emerald-600 border-emerald-600',
            icon: ShieldCheck,
            label: 'ACTIVA',
        },
        VENCIDA: {
            default: 'bg-gray-100 text-gray-800 border-gray-200',
            minimal: 'bg-gray-500/10 text-gray-400 border-gray-500/20 backdrop-blur-md',
            outline: 'bg-transparent text-gray-500 border-gray-500',
            icon: AlertCircle,
            label: 'VENCIDA',
        },
        REVOCADA: {
            default: 'bg-red-100 text-red-800 border-red-200',
            minimal: 'bg-red-500/10 text-red-400 border-red-500/20 backdrop-blur-md',
            outline: 'bg-transparent text-red-600 border-red-600',
            icon: Ban,
            label: 'REVOCADA',
        },
    };

    const current = styles[estadoNormalizado] || styles['ACTIVA']; // Fallback safety
    const Icon = current.icon;
    const variantStyle = current[variant] || current.default;

    return (
        <div
            className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all',
                variantStyle,
                className
            )}
        >
            <Icon size={12} strokeWidth={2.5} className={variant === 'minimal' ? 'opacity-80' : ''} />
            <span>{current.label}</span>
        </div>
    );
};

