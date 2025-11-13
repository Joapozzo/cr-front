"use client";
import React from 'react';
import { CardEstadisticas } from './EstadisticasPlanillero';
import CardPartidosSemana from './PartidosSemanaPlanillero';
import { useDashboardPlanillero } from '../hooks/usePlanilleroData';
import PartidoItem from './PartidoItem';

const PlanilleroHomePage: React.FC = () => {
    const {data, isLoading} = useDashboardPlanillero();

    return (
        <div className="min-h-screen max-w-4xl mx-auto">
            <div className="mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="text-start py-4">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Panel de Planillero
                    </h1>
                    <p className="text-[#737373]">
                        Bienvenido de vuelta, Juan
                    </p>
                </div>
                {/* Estadísticas */}
                <CardEstadisticas stats={data?.estadisticas} isLoading={isLoading} />
                {
                    data?.proximo_partido && (
                        <PartidoItem partido={data?.proximo_partido} />
                    )
                }

                {/* Partidos de la Semana */}
                <CardPartidosSemana partidos={data?.partidos_semana} isLoading={isLoading} />

                {/* Accesos Rápidos */}
                {/* <CardAccesosRapidos /> */}
            </div>
        </div>
    );
};

export default PlanilleroHomePage;