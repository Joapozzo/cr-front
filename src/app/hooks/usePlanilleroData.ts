import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardPlanillero } from '../types/dashboard';
import { planilleroService as dashboardPlanilleroService } from '../services/planillero.services';

// Hook para obtener dashboard del planillero
// export const useDashboardPlanillero = () => {
//     return useQuery<DashboardPlanillero>({
//         queryKey: ['dashboard-planillero'],
//         queryFn: dashboardPlanilleroService.dashboardPlanillero,
//         staleTime: 5 * 60 * 1000, // 5 minutos - datos considerados frescos
//         gcTime: 10 * 60 * 1000,   // 10 minutos - tiempo en cache después de no usar
//         refetchOnWindowFocus: true, // Refrescar al volver a la ventana
//         refetchOnMount: true,       // Refrescar al montar el componente
//         retry: 2,                   // Intentar 2 veces si falla
//         retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
//     });
// };

// Hook con invalidación manual del cache
export const useDashboardPlanilleroWithInvalidation = () => {
    const queryClient = useQueryClient();

    const query = useQuery<DashboardPlanillero>({
        queryKey: ['dashboard-planillero'],
        queryFn: dashboardPlanilleroService.dashboardPlanillero,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 2,
    });

    // Función para invalidar el cache manualmente
    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-planillero'] });
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
    return useQuery<DashboardPlanillero>({
        queryKey: ['dashboard-planillero-realtime'],
        queryFn: dashboardPlanilleroService.dashboardPlanillero,
        staleTime: 1 * 60 * 1000,   // 1 minuto - más agresivo
        gcTime: 3 * 60 * 1000,      // 3 minutos en cache
        refetchInterval: 2 * 60 * 1000, // Auto-refetch cada 2 minutos
        refetchIntervalInBackground: false, // Solo cuando la ventana esté activa
        refetchOnWindowFocus: true,
        retry: 3,
    });
};

// Hook básico (recomendado para la mayoría de casos)
export const useDashboardPlanillero = () => {
    return useQuery({
        queryKey: ['dashboard-planillero'],
        queryFn: dashboardPlanilleroService.dashboardPlanillero,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos
        retry: 2,
    });
};