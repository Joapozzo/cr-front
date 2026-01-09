'use client';

import { Suspense } from 'react';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import EstadisticasRapidasBlock from './EstadisticasRapidasBlock';
import ZonasPlayoffBlock from './ZonasPlayoffBlock';
import GoleadoresBlock from './GoleadoresBlock';
import ExpulsadosBlock from './ExpulsadosBlock';
import EstadisticasRapidasSkeleton from '@/app/components/skeletons/EstadisticasRapidasSkeleton';
import TablaGoleadoresSkeleton from '@/app/components/skeletons/TablaGoleadoresSkeleton';

export default function EstadisticasClient() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const enabled = !!categoriaSeleccionada;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Estadísticas - Serie A Libre
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Posiciones, goleadores y jugadores sancionados de la categoría
                    </p>
                </div>
            </div>

            {/* Estadísticas Rápidas */}
            <Suspense fallback={<EstadisticasRapidasSkeleton />}>
                <EstadisticasRapidasBlock enabled={enabled} />
            </Suspense>

            {/* Zonas Playoff */}
            <Suspense fallback={<div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-8"><div className="animate-pulse">Cargando posiciones...</div></div>}>
                <ZonasPlayoffBlock enabled={enabled} />
            </Suspense>

            {/* Goleadores y Expulsados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<TablaGoleadoresSkeleton />}>
                    <GoleadoresBlock enabled={enabled} />
                </Suspense>
                <Suspense fallback={<TablaGoleadoresSkeleton />}>
                    <ExpulsadosBlock enabled={enabled} />
                </Suspense>
            </div>
        </div>
    );
}

