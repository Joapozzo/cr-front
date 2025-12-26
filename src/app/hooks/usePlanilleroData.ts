import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardPlanillero } from '../types/dashboard';
import { planilleroService as dashboardPlanilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';

// Hook con invalidación manual del cache
export const useDashboardPlanilleroWithInvalidation = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    const query = useQuery<DashboardPlanillero>({
        queryKey: ['dashboard-planillero', usuario?.uid],
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return dashboardPlanilleroService.dashboardPlanillero();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 2,
        enabled: !!usuario?.uid,
    });

    // Función para invalidar el cache manualmente
    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-planillero', usuario?.uid] });
    };

    // Función para refrescar los datos
    const refetch = () => {
        return query.refetch();
    };

    return {
        ...query,
        invalidateCache,
        refetch,
    };
};

// Hook con configuración más agresiva para datos en tiempo real
export const useDashboardPlanilleroRealTime = () => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery<DashboardPlanillero>({
        queryKey: ['dashboard-planillero-realtime', usuario?.uid],
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return dashboardPlanilleroService.dashboardPlanillero();
        },
        staleTime: 1 * 60 * 1000,   // 1 minuto - más agresivo
        gcTime: 3 * 60 * 1000,      // 3 minutos en cache
        refetchInterval: 2 * 60 * 1000, // Auto-refetch cada 2 minutos
        refetchIntervalInBackground: false, // Solo cuando la ventana esté activa
        refetchOnWindowFocus: true,
        retry: 3,
        enabled: !!usuario?.uid,
    });
};

// Hook básico (recomendado para la mayoría de casos)
export const useDashboardPlanillero = () => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: ['dashboard-planillero', usuario?.uid],
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return dashboardPlanilleroService.dashboardPlanillero();
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos
        retry: 2,
        enabled: !!usuario?.uid,
    });
};