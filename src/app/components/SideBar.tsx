'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Calendar,
    AlertTriangle,
    Newspaper,
    Users,
    Trophy,
    LogOut,
    User
} from 'lucide-react';
import { useLogout } from '../hooks/auth/useLogout';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color?: string;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/adm/dashboard',
        color: 'text-[var(--green)]'
    },
    {
        id: 'ediciones',
        label: 'Ediciones',
        icon: Calendar,
        href: '/adm/ediciones',
        color: 'text-[var(--green)]'
    },
    {
        id: 'sanciones',
        label: 'Sanciones',
        icon: AlertTriangle,
        href: '/adm/sanciones',
        color: 'text-[var(--green)]'
    },
    {
        id: 'noticias',
        label: 'Noticias',
        icon: Newspaper,
        href: '/adm/noticias',
        color: 'text-[var(--green)]'
    },
    {
        id: 'usuarios',
        label: 'Usuarios',
        icon: Users,
        href: '/adm/usuarios',
        color: 'text-[var(--green)]'
    },
    {
        id: 'legajos',
        label: 'Legajos',
        icon: Trophy,
        href: '/adm/legajos',
        color: 'text-[var(--green)]'
    }
];

export default function Sidebar() {
    const { logout, state: logoutState } = useLogout();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const isLoggingOut = logoutState === 'loading';

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const isActiveLink = (href: string) => {
        return pathname === href;
    };

    return (
        <div
            className={`bg-[var(--black)] text-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-70"
                } flex flex-col`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--black-900)]">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <Image
                            src="/logos/logotipo.png"
                            alt="Logo"
                            width={50}
                            height={40}
                            className="h-4 w-auto object-contain"
                            priority
                        />
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-lg hover:bg-[var(--black-900)] transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* User Profile */}
            {!isCollapsed && (
                <div className="p-4 border-b border-[var(--black-900)]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--green)] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium">Octavio</h3>
                            <p className="text-gray-400 text-sm">Administrador</p>
                        </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                        <button className="flex-1 bg-[var(--green)] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors flex items-center justify-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Perfil</span>
                        </button>
                        <button 
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="flex-1 border border-red-500 text-red-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{isLoggingOut ? 'Saliendo...' : 'Salir'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = isActiveLink(item.href);
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${isActive
                                            ? "bg-[var(--black-900)] text-white"
                                            : "hover:bg-[var(--black-900)]"
                                        }`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${isActive
                                                ? "text-[var(--green)]"
                                                : item.color || "text-gray-400"
                                            } group-hover:scale-110 transition-transform`}
                                    />
                                    {!isCollapsed && (
                                        <span
                                            className={`transition-colors ${isActive
                                                    ? "text-[var(--green)] font-medium"
                                                    : "text-gray-300 group-hover:text-white"
                                                }`}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout button when collapsed */}
            {isCollapsed && (
                <div className="p-4 border-t border-[var(--black-900)]">
                    <button
                        onClick={logout}
                        disabled={isLoggingOut}
                        className="w-full p-3 rounded-lg transition-colors group hover:bg-[var(--black-900)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
                    >
                        <LogOut className={`w-5 h-5 text-red-500 group-hover:text-red-400 transition-colors ${isLoggingOut ? 'opacity-50' : ''}`} />
                    </button>
                </div>
            )}
        </div>
    );
}