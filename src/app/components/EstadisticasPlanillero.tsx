import { BaseCard, CardHeader } from "./BaseCard";
import { TrendingUp } from "lucide-react";
import CardEstadisticasSkeleton from "./skeletons/CardStatsPlanilleroSkeleton";
import { EstadisticasPlanillero } from "../types/dashboard";

interface EstadisticasProps {
    isLoading?: boolean;
    stats: EstadisticasPlanillero | null;
}

export const CardEstadisticas: React.FC<EstadisticasProps> = ({ 
    stats = { partidosPendientes: 0, partidosCompletados: 0, totalMes: 0 }, 
    isLoading = false 
}) => {
    
    if (isLoading) {
        return <CardEstadisticasSkeleton />;
    }

    const calcularPorcentajes = () => {
        const total = (stats?.pendientes || 0) + (stats?.completados || 0);
        const maxMensual = Math.max(stats?.completados_este_mes || 0, 10);
        
        return {
            pendientes: total > 0 ? Math.min((stats?.pendientes || 0) / total * 100, 100) : 0,
            completados: total > 0 ? Math.min((stats?.completados || 0) / total * 100, 100) : 0,
            mensuales: Math.min((stats?.completados_este_mes || 0) / maxMensual * 100, 100)
        };
    };

    const porcentajes = calcularPorcentajes();

    return (
        <BaseCard>
            <CardHeader
                icon={<TrendingUp className="text-green-400" size={16} />}
                title="Mi actividad"
            />
            <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                            {stats?.pendientes}
                        </div>
                        <div className="text-xs text-[#525252]">Pendientes</div>
                        <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                            <div 
                                className="h-full bg-orange-400 rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${porcentajes.pendientes}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                            {stats?.completados}
                        </div>
                        <div className="text-xs text-[#525252]">Completados</div>
                        <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                            <div 
                                className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${porcentajes.completados}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                            {stats?.completados_este_mes}
                        </div>
                        <div className="text-xs text-[#525252]">Este mes</div>
                        <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                            <div 
                                className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${porcentajes.mensuales}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseCard>
    );
};