'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { useAuthStore } from '@/app/stores/authStore';
import { AvatarPerfil } from '@/app/components/perfil/AvatarPerfil';

export default function PerfilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { usuario } = useAuthStore();

    
    const perfilTabs = [
        {
            id: 'mis-datos',
            label: 'Mis datos',
            icon: User,
            href: '/perfil',
        },
        // {
        //     id: 'estadisticas',
        //     label: 'Estadísticas',
        //     icon: BarChart3,
        //     href: '/perfil/estadisticas',
        // },
        {
            id: 'solicitudes',
            label: 'Solicitudes',
            icon: MessageSquare,
            href: '/perfil/solicitudes',
        },
        // {
        //     id: 'configuracion',
        //     label: 'Configuración',
        //     icon: Settings,
        //     href: '/perfil/configuracion',
        // },
    ];

    const isActiveTab = (href: string) => {
        return pathname === href;
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            {/* Header con breadcrumb */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] py-3 sm:py-4">
                <div className="flex items-center space-x-2 max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                    <Link
                        href="/"
                        className="flex items-center text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Inicio
                    </Link>
                    <span className="text-[var(--gray-100)]">/</span>
                    <span className="text-[var(--white)]">Mi perfil</span>
                </div>
            </div>

            {/* Información del usuario */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] py-4 sm:py-6">
                <div className="flex items-center space-x-3 sm:space-x-4 max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                    {/* Avatar editable */}
                    <AvatarPerfil
                        imagenUrl={usuario?.img}
                        nombre={`${usuario?.nombre} ${usuario?.apellido}`}
                        editable={true}
                        size="md"
                    />

                    {/* Información del usuario */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-semibold text-[var(--white)] truncate">
                            {usuario?.nombre} {usuario?.apellido}
                        </h1>
                        <p className="text-sm text-[var(--gray-100)] truncate">
                            {usuario?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navegación - Optimizada para mobile */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] z-10">
                <nav className="flex overflow-x-auto scrollbar-hide max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-11">
                    {perfilTabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`
                                    flex-1 min-w-0 py-2.5 sm:py-3 px-1.5 sm:px-2 flex flex-col items-center space-y-1 
                                    transition-colors border-b-2 text-xs font-medium
                                    ${isActiveTab(tab.href)
                                        ? 'border-[var(--green)] text-[var(--green)]'
                                        : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                    }
                                `}
                            >
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="truncate text-center leading-tight text-[10px] sm:text-xs">
                                    {tab.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div className="p-2 sm:p-3 md:p-4 max-w-[1400px] mx-auto">
                {children}
            </div>

            {/* Estilos para ocultar scrollbar */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}