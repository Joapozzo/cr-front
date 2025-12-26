import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { dashboardService, DashboardData, DashboardFilters } from '../services/dashboard.service';

// ============================================
// QUERY KEYS
// ============================================

export const dashboardKeys = {
    all: ['dashboard'] as const,
    dashboard: (filtros?: DashboardFilters) => 
        ['dashboard', 'data', filtros] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Hook para obtener datos del dashboard
 */
export const useDashboard = (
    filtros?: DashboardFilters,
    options?: Omit<UseQueryOptions<DashboardData, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<DashboardData, Error>({
        queryKey: dashboardKeys.dashboard(filtros),
        queryFn: () => dashboardService.obtenerDashboard(filtros),
        staleTime: 1 * 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: true,
        refetchInterval: 2 * 60 * 1000, // Auto-refresh cada 2 minutos
        retry: 2,
        ...options,
    });
};

