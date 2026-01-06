'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AuthTokenListener } from '@/app/components/auth/AuthTokenListener';
import { TenantProvider } from '@/app/contexts/TenantContext';
import { TenantConfig } from '@/config/tenant.loader';

interface ProvidersProps {
  children: React.ReactNode;
  tenantConfig: TenantConfig;
}

export function Providers({ children, tenantConfig }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <TenantProvider config={tenantConfig}>
                <AuthTokenListener />
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </TenantProvider>
        </QueryClientProvider>
    );
}