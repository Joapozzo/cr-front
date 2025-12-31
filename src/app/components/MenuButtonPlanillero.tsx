"use client";

import React from 'react';
import Link from 'next/link';
import { Home, User, Swords } from 'lucide-react';
import { usePathname } from 'next/navigation';

const BottomNavigationPlanillero: React.FC = () => {
    const pathname = usePathname();

    const sideItems = [
        {
            label: 'Partidos',
            href: '/planillero/partidos',
            icon: Swords,
            position: 'left'
        },
        {
            label: 'Perfil',
            href: '/planillero/perfil',
            icon: User,
            position: 'right'
        },
    ];

    const isActive = (href: string) => {
        return pathname === href;
    };

    const isHomeActive = pathname === '/planillero/home';

    return (
        <div className="fixed bottom-8 left-0 right-0 z-[50] md:hidden pointer-events-none">
            <div className="flex items-end justify-center px-6">
                <div className="relative flex items-center justify-center pointer-events-auto z-[50]">

                    {/* Fondo redondeado */}
                    <div className="absolute inset-0 bg-[var(--black-800)]/95 backdrop-blur-lg rounded-full shadow-2xl border border-[var(--black-700)]/50 -mx-6 -my-2"></div>

                    {/* Contenido sobre el fondo */}
                    <div className="relative flex items-center justify-center">

                        {/* Items izquierda */}
                        <div className="flex items-center gap-3 mr-6">
                            {sideItems.filter(item => item.position === 'left').map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group"
                                    >
                                        <div className={`p-2 rounded-full transition-all duration-300 ${active
                                            ? 'text-[var(--green)] text-white shadow-lg transform scale-110'
                                            : 'text-[var(--black-400)] hover:text-[var(--green)] hover:scale-105'
                                            }`}>
                                            <Icon size={20} className={`${active ? 'text-[var(--green)]' : ''}`} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Botón Home central - Sobresale */}
                        <Link href="/planillero/home" className="relative z-[1] pointer-events-auto">
                            <div className={`p-3 rounded-full transition-all duration-300 shadow-2xl transform -translate-y-5 ${isHomeActive
                                ? 'bg-[var(--green)] text-white scale-110 shadow-[var(--green)]/40'
                                : 'bg-[var(--green)] text-white hover:scale-105 hover:shadow-[var(--green)]/30'
                                }`}>
                                <Home size={30} />

                                {isHomeActive && (
                                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                )}
                            </div>
                        </Link>

                        {/* Items derecha */}
                        <div className="flex items-center gap-3 ml-6">
                            {sideItems.filter(item => item.position === 'right').map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group"
                                    >
                                        <div className={`p-2 rounded-full transition-all duration-300 ${active
                                            ? 'text-white shadow-lg transform scale-110'
                                            : 'text-[var(--black-400)] hover:text-[var(--green)] hover:scale-105'
                                            }`}>
                                            <Icon size={20} className={`${active ? 'text-[var(--green)]' : ''}`} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomNavigationPlanillero;