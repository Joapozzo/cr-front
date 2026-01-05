"use client";

import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    RefreshCcw,
    Trophy,
    PlayCircle,
    AlertTriangle,
    Users,
    Flag
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useAdmin } from '@/app/hooks/useAdmin';

// Components
import { StatCard } from '@/app/components/admin/dashboard/base/StatCard';
import { CategoriasActivasSection } from '@/app/components/admin/dashboard/sections/CategoriasActivasSection';
import { PartidosEnVivoSection } from '@/app/components/admin/dashboard/sections/PartidosEnVivoSection';
import { ZonasSinTerminarSection } from '@/app/components/admin/dashboard/sections/ZonasSinTerminarSection';
import { SancionesActivasSection } from '@/app/components/admin/dashboard/sections/SancionesActivasSection';
import { JugadoresEventualesSection } from '@/app/components/admin/dashboard/sections/JugadoresEventualesSection';
import { LoadingSkeleton } from '@/app/components/admin/dashboard/base/LoadingSkeleton';

// Lazy load charts section to reduce initial bundle size
const EstadisticasChartsSection = React.lazy(async () => {
    // Artificial delay to demonstrate skeleton if needed, or just direct import
    const importedModule = await import('@/app/components/admin/dashboard/sections/EstadisticasChartsSection');
    return { default: importedModule.EstadisticasChartsSection };
});

export default function DashboardPage() {
    const {
        categoriasActivas,
        zonasSinTerminar,
        sancionesActivas,
        partidosEnVivo,
        jugadoresEventuales,
        estadisticas,

        loadingCategorias,
        loadingZonas,
        loadingSanciones,
        loadingPartidos,
        loadingJugadores,
        loadingEstadisticas,

        errorCategorias,
        errorZonas,
        errorSanciones,
        errorPartidos,
        errorJugadores,
        errorEstadisticas,

        refresh
    } = useAdmin(true); // Initial fetch

    // Auto-refresh every 2 minutes (120000ms)
    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 120000);
        return () => clearInterval(interval);
    }, [refresh]);

    // Calculate Summary Stats
    const stats = {
        activeCategories: categoriasActivas?.length || 0,
        liveMatches: partidosEnVivo?.length || 0,
        pendingZones: zonasSinTerminar?.length || 0,
        activeSanctions: sancionesActivas?.length || 0,
        eventualPlayers: jugadoresEventuales?.length || 0
    };

    const isLoadingAll = loadingCategorias && loadingZonas && loadingSanciones;

    return (
        <div className="min-h-screen bg-[var(--black)] text-white p-4 md:p-8 space-y-8 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <LayoutDashboard className="text-[var(--green)]" />
                        Dashboard
                    </h1>
                    <p className="text-[#737373] mt-1">Visión general del estado del torneo</p>
                </div>

                <button
                    onClick={() => refresh()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--black-900)] border border-[#262626] hover:bg-[var(--black-800)] hover:text-[var(--green)] transition-all text-sm font-medium"
                >
                    <RefreshCcw size={16} className={isLoadingAll ? "animate-spin" : ""} />
                    Actualizar
                </button>
            </header>

            {/* Top Stats - Quick Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Categorías Activas"
                    value={stats.activeCategories}
                    icon={Trophy}
                    color="var(--yellow-500)"
                    trend={{ value: 100, label: 'Activas', positive: true }}
                />
                <StatCard
                    title="Partidos en Vivo"
                    value={stats.liveMatches}
                    icon={PlayCircle}
                    color="var(--red-500)"
                    subtitle="Jugándose ahora"
                    className={stats.liveMatches > 0 ? "border-[var(--red-500)]/50" : ""}
                />
                <StatCard
                    title="Sanciones activas"
                    value={stats.activeSanctions}
                    icon={AlertTriangle}
                    color="var(--orange-500)"
                    subtitle="Jugadores suspendidos"
                />
                <StatCard
                    title="Zonas por Terminar"
                    value={stats.pendingZones}
                    icon={Flag}
                    color="var(--blue-500)"
                    subtitle="Requieren atención"
                />
            </div>

            {/* Categorías Grid Section */}
            <section className="w-full">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Categorías en curso</h2>
                </div>
                <CategoriasActivasSection
                    data={categoriasActivas}
                    loading={loadingCategorias}
                    error={errorCategorias}
                />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Wide) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Partidos en Vivo Section (Highlighted) */}
                    <section>
                        <PartidosEnVivoSection
                            data={partidosEnVivo}
                            loading={loadingPartidos}
                            error={errorPartidos}
                        />
                    </section>

                    {/* Charts Section */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-1">Estadísticas generales</h2>
                            <p className="text-sm text-[#737373]">Métricas de rendimiento del torneo</p>
                        </div>
                        <React.Suspense fallback={
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <LoadingSkeleton type="chart" count={4} />
                            </div>
                        }>
                            <EstadisticasChartsSection
                                data={estadisticas}
                                loading={loadingEstadisticas}
                                error={errorEstadisticas}
                            />
                        </React.Suspense>
                    </section>
                </div>

                {/* Right Column (Narrow) */}
                <div className="space-y-8">
                    {/* Zonas sin terminar */}
                    <section className="h-[400px]">
                        <ZonasSinTerminarSection
                            data={zonasSinTerminar}
                            loading={loadingZonas}
                            error={errorZonas}
                        />
                    </section>

                    {/* Sanciones */}
                    <section>
                        <SancionesActivasSection
                            data={sancionesActivas}
                            loading={loadingSanciones}
                            error={errorSanciones}
                        />
                    </section>

                    {/* Jugadores eventuales */}
                    <section>
                        <JugadoresEventualesSection
                            data={jugadoresEventuales}
                            loading={loadingJugadores}
                            error={errorJugadores}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}