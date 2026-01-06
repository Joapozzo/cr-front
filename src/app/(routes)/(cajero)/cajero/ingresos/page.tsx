'use client';

import { PageHeader } from '@/app/components/ui/PageHeader';
import Link from 'next/link';
import { 
    CreditCard, 
    ClipboardList, 
    CheckCircle, 
    DollarSign,
    QrCode,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

interface IngresoCard {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color: string;
    badge?: number;
    badgeColor?: string;
}

interface IngresoCardWithDisabled extends IngresoCard {
    disabled?: boolean;
}

const ingresosCards: IngresoCardWithDisabled[] = [
    {
        title: 'Pago de Inscripción',
        description: 'Registrar pagos de inscripción de equipos',
        icon: ClipboardList,
        href: '/cajero/ingresos/pago-inscripcion',
        color: 'text-blue-400',
        disabled: true // Deshabilitado para futuras features
    },
    {
        title: 'Pago de Cancha',
        description: 'Registrar pagos de cancha por partido',
        icon: CreditCard,
        href: '/cajero/ingresos/pago-cancha',
        color: 'text-green-400'
    },
    {
        title: 'Validar Transferencias',
        description: 'Validar transferencias pendientes',
        icon: CheckCircle,
        href: '/cajero/ingresos/validar-transferencias',
        color: 'text-yellow-400',
        disabled: true // Deshabilitado para futuras features
    },
    {
        title: 'Otro Ingreso',
        description: 'Registrar ingresos manuales de caja',
        icon: DollarSign,
        href: '/cajero/ingresos/otro-ingreso',
        color: 'text-purple-400',
        disabled: true // Deshabilitado para futuras features
    },
    {
        title: 'Configuración de Precios',
        description: 'Gestionar precios globales y por categoría',
        icon: QrCode,
        href: '/cajero/ingresos/precios-cancha',
        color: 'text-orange-400'
    }
];

// Hook para obtener cantidad de transferencias pendientes
const useTransferenciasPendientes = () => {
    return useQuery({
        queryKey: ['transferencias', 'pendientes', 'count'],
        queryFn: async () => {
            try {
                const response = await api.get<{ success: boolean; data: any[] }>(
                    '/cajero/inscripciones/transferencias-pendientes?limit=1'
                );
                return response.data?.length || 0;
            } catch {
                return 0;
            }
        },
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true
    });
};

export default function IngresosPage() {
    const { data: transferenciasPendientes } = useTransferenciasPendientes();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Ingresos"
                description="Registrar y gestionar todos los ingresos del sistema"
            />

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ingresosCards.map((card) => {
                    const Icon = card.icon;
                    const badgeCount = card.href === '/cajero/ingresos/validar-transferencias' 
                        ? transferenciasPendientes 
                        : undefined;
                    const isDisabled = card.disabled;

                    return (
                        <div
                            key={card.href}
                            className={`group bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 transition-all duration-200 ${
                                isDisabled 
                                    ? 'opacity-50 cursor-not-allowed relative' 
                                    : 'hover:border-[var(--color-primary)] hover:shadow-lg'
                            }`}
                            title={isDisabled ? 'Funcionalidad en desarrollo' : undefined}
                        >
                            {isDisabled ? (
                                <>
                                    <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                                        Próximamente
                                    </div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-[var(--black-950)] ${card.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {badgeCount !== undefined && badgeCount > 0 && (
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {badgeCount}
                                            </span>
                                        )}
                                        <ArrowRight className={`w-5 h-5 text-[var(--gray-300)]`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-[var(--gray-100)]">
                                        {card.description}
                                    </p>
                                </>
                            ) : (
                                <Link
                                    href={card.href}
                                    className="block"
                                >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-[var(--black-950)] ${card.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {badgeCount !== undefined && badgeCount > 0 && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {badgeCount}
                                    </span>
                                )}
                                <ArrowRight className={`w-5 h-5 text-[var(--gray-300)] group-hover:text-[var(--color-primary)] transition-colors`} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                {card.title}
                            </h3>
                                    <p className="text-sm text-[var(--gray-100)]">
                                        {card.description}
                                    </p>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--gray-100)]">Transferencias Pendientes</span>
                        <CheckCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {transferenciasPendientes !== undefined ? transferenciasPendientes : '-'}
                    </p>
                    <Link 
                        href="/cajero/ingresos/validar-transferencias"
                        className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block"
                    >
                        Ver todas →
                    </Link>
                </div>
            </div>
        </div>
    );
}
