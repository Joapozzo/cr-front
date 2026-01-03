'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/app/components/ui/PageHeader';

export default function AdminDashboard() {
    // Mostrar toast de bienvenida si viene del registro completo
    useEffect(() => {
        const registroCompleto = sessionStorage.getItem('registro_completo');
        const usuarioNombre = sessionStorage.getItem('usuario_nombre');

        if (registroCompleto === 'true') {
            // Limpiar el flag
            sessionStorage.removeItem('registro_completo');
            sessionStorage.removeItem('usuario_nombre');

            // Mostrar toast de bienvenida
            const nombre = usuarioNombre || 'Usuario';
            toast.success(
                `¡Bienvenido a Copa Relámpago, ${nombre}! 🎉`,
                {
                    duration: 5000,
                    icon: '👋',
                    style: {
                        background: 'var(--gray-400)',
                        color: 'white',
                        border: '1px solid var(--green)',
                    },
                }
            );
        }
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Vista general del sistema y estadísticas principales"
            />
            <p>En desarrollo...</p>
        </div>
    );
}