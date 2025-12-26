'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    basePath?: string;
    baseLabel?: string;
}

// Mapeo de rutas a labels
const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'caja': 'Caja',
    'historial': 'Historial',
    'ingresos': 'Ingresos',
    'precios-cancha': 'Precios de cancha',
    'pago-cancha': 'Pago de cancha',
    'pago-inscripcion': 'Pago de inscripción',
    'otro-ingreso': 'Otro ingreso',
    'validar-transferencias': 'Validar transferencias',
    'egresos': 'Egresos',
    'pagos-arbitros': 'Pagos a árbitros',
    'pagos-medicos': 'Pagos a médicos',
    'pagos-planilleros': 'Pagos a planilleros',
    'pago-predio': 'Pago de predio',
    'gasto-operativo': 'Gasto operativo',
    'otros-pendientes': 'Otros pendientes',
    'consultas': 'Consultas',
    'deudas-equipos': 'Deudas de equipos',
    'equipos-inhabilitados': 'Equipos inhabilitados',
    'partidos-dia': 'Partidos del día',
    'reportes': 'Reportes',
    'deudas-pendientes': 'Deudas pendientes',
    'movimientos-metodo': 'Movimientos por método',
    'pagos-personal-resumen': 'Resumen de pagos a personal',
    'recaudacion-categoria': 'Recaudación por categoría',
    'reporte-caja': 'Reporte de caja',
    'pagos-personal': 'Pagos a personal',
    'crear-manual': 'Crear manual',
    'editar-montos': 'Editar montos',
    'listar': 'Listar',
    'pagos-dia': 'Pagos del día',
    'utilidades': 'Utilidades',
    'calculadora': 'Calculadora',
    'comprobante': 'Comprobante',
    'contador-billetes': 'Contador de billetes',
    'deposito-bancario': 'Depósito bancario',
    'perfil': 'Perfil'
};

export default function Breadcrumb({ items, basePath = '/cajero', baseLabel = 'Cajero' }: BreadcrumbProps) {
    const pathname = usePathname();

    // Si se proporcionan items personalizados, usarlos
    if (items) {
        return (
            <div className="flex items-center space-x-2 text-sm mb-4">
                <Link
                    href={basePath}
                    className="flex items-center text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {baseLabel}
                </Link>
                {items.map((item, index) => (
                    <div key={item.href} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-[var(--gray-100)]" />
                        {index === items.length - 1 ? (
                            <span className="text-[var(--white)]">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Generar breadcrumb automáticamente desde la ruta
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Filtrar solo los segmentos del cajero
    const cajeroIndex = pathSegments.indexOf('cajero');
    if (cajeroIndex === -1) return null;
    
    const relevantSegments = pathSegments.slice(cajeroIndex + 1);
    
    // Si estamos en /cajero/dashboard o /cajero, no mostrar breadcrumb
    if (relevantSegments.length === 0 || (relevantSegments.length === 1 && relevantSegments[0] === 'dashboard')) {
        return null;
    }

    const breadcrumbItems: BreadcrumbItem[] = [];
    let currentPath = '/cajero';

    relevantSegments.forEach((segment, index) => {
        // Saltar 'dashboard' si es el primer segmento
        if (index === 0 && segment === 'dashboard') {
            return;
        }
        
        currentPath += `/${segment}`;
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        
        breadcrumbItems.push({
            label,
            href: currentPath
        });
    });

    return (
        <div className="flex items-center space-x-2 text-sm mb-4">
            <Link
                href={basePath}
                className="flex items-center text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {baseLabel}
            </Link>
            {breadcrumbItems.map((item, index) => (
                <div key={item.href} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-[var(--gray-100)]" />
                    {index === breadcrumbItems.length - 1 ? (
                        <span className="text-[var(--white)]">{item.label}</span>
                    ) : (
                        <Link
                            href={item.href}
                            className="text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}

