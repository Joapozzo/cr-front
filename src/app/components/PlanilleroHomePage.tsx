"use client";
import React, { useEffect, lazy, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDashboardPlanillero } from '../hooks/usePlanilleroData';
import { useAuthStore } from '../stores/authStore';
import { convertPartidoCompletoToPartido } from '../utils/partido.helper';

// Lazy load de componentes
const CardEstadisticas = lazy(() => 
    import('./EstadisticasPlanillero').then(module => ({ 
        default: module.CardEstadisticas 
    }))
);

const CardPartidosSemana = lazy(() => 
    import('./PartidosSemanaPlanillero')
);

const PartidoItem = lazy(() => 
    import('./PartidoItem')
);

const PlanilleroHomePage: React.FC = () => {
    const router = useRouter();
    const usuario = useAuthStore((state) => state.usuario);
    const { data, isLoading } = useDashboardPlanillero();

    // Mostrar toast de bienvenida si viene del registro completo
    useEffect(() => {
        const registroCompleto = sessionStorage.getItem('registro_completo');
        const usuarioNombre = sessionStorage.getItem('usuario_nombre');

        if (registroCompleto === 'true') {
            sessionStorage.removeItem('registro_completo');
            sessionStorage.removeItem('usuario_nombre');

            const nombre = usuarioNombre || usuario?.nombre || 'Usuario';
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
    }, [usuario?.nombre]);

    return (
        <div className="min-h-screen max-w-4xl mx-auto">
            <div className="mx-auto space-y-4 p-4">
                {/* Header - siempre visible */}
                <div className="text-start py-4">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Panel de planillero
                    </h1>
                    <p className="text-[#737373]">
                        Bienvenido de vuelta, {usuario?.nombre || 'Planillero'}
                    </p>
                </div>

                <Suspense fallback={null}>
                    <CardEstadisticas 
                        stats={data?.estadisticas ?? null} 
                        isLoading={isLoading} 
                    />
                </Suspense>

                {data?.proximo_partido && (
                    <Suspense fallback={null}>
                        <PartidoItem 
                            partido={data.proximo_partido} 
                            onClick={(partidoId) => router.push(`/planillero/partidos/${partidoId}`)}
                        />
                    </Suspense>
                )}

                <Suspense fallback={null}>
                    <CardPartidosSemana 
                        partidos={data?.partidos_semana} 
                        isLoading={isLoading} 
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default PlanilleroHomePage;