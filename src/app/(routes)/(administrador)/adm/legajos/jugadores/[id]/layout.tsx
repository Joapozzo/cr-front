'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useJugadorDetalle } from '@/app/hooks/legajos/useJugadores';
import { JugadorHeader } from '@/app/components/legajos/jugadores/JugadorHeader';
import { JugadorTabs } from '@/app/components/legajos/jugadores/JugadorTabs';
import { JugadorHeaderSkeleton } from '@/app/components/legajos/jugadores/JugadorHeaderSkeleton';

// Componente interno que necesita acceso a hooks
const JugadorLayoutContent = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const router = useRouter();

    // Memoizar y validar el ID de jugador
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    // Obtener información básica solo para el header
    const { data: jugadorInfo, isLoading: isLoadingInfo, error: errorInfo } = useJugadorDetalle(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    // Early return si no hay ID válido
    if (!idJugador) {
        return (
            <div className="space-y-6">
                <JugadorHeaderSkeleton />
            </div>
        );
    }

    if (isLoadingInfo) {
        return (
            <div className="space-y-6">
                <JugadorHeaderSkeleton />
            </div>
        );
    }

    if (errorInfo || !jugadorInfo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar el jugador</h3>
                <p className="text-[var(--red)]/80 text-sm mb-4">
                    {errorInfo?.message || 'No se pudo cargar la información del jugador'}
                </p>
                <Button variant="danger" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <JugadorHeader jugadorInfo={jugadorInfo} onBack={() => router.back()} />
            <JugadorTabs idJugador={idJugador} />
            {children}
        </div>
    );
};

// Layout principal que envuelve en Suspense
export default function JugadorLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <JugadorHeaderSkeleton />
                </div>
            }
        >
            <JugadorLayoutContent>{children}</JugadorLayoutContent>
        </Suspense>
    );
}
