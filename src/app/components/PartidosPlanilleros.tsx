import { useState } from "react";
import { Partido } from "../types/partido";
import { BaseCard } from "./BaseCard";
import TabNavigation from "./TabNavigationPlanillero";
import PartidosList from "./PartidosListPlanillero";
import { CheckCircle, PenTool } from "lucide-react";
import PartidoItemSkeleton from "./skeletons/CardPartidotemSkeleton";
import { usePartidosPendientesPlanillero, usePartidosPlanilladosPlanillero } from "../hooks/usePartidosPlanillero";
import { useRouter } from "next/navigation";


const PlanilleroPartidosPanel: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'pendientes' | 'planillados'>('pendientes');

    const { 
        data: dataPendientes, 
        isLoading: isLoadingPendientes 
    } = usePartidosPendientesPlanillero({
        enabled: activeTab === 'pendientes'
    });

    const { 
        data: dataPlanillados, 
        isLoading: isLoadingPlanillados 
    } = usePartidosPlanilladosPlanillero({
        enabled: activeTab === 'planillados'
    });

    // Extraer los partidos y totales de las respuestas
    const partidosPendientes = dataPendientes?.partidos || [];
    const partidosPlanillados = dataPlanillados?.partidos || [];
    const totalPendientes = dataPendientes?.total || 0;
    const totalPlanillados = dataPlanillados?.total || 0;
    
    const isLoading = activeTab === 'pendientes' ? isLoadingPendientes : isLoadingPlanillados;

    const handlePartidoClick = (partidoId: number) => {
        router.push(`partidos/${partidoId}`);
    };

    return (
        <BaseCard className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#262626]">
                <h2 className="text-white text-lg font-semibold text-center">Tus partidos</h2>
            </div>

            {/* Navegación por pestañas */}
            <div className="px-6 pt-4">
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    pendientesCount={totalPendientes}
                    planilladosCount={totalPlanillados}
                />
            </div>

            {/* Contenido */}
            <div className="px-6 pb-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <PartidoItemSkeleton />
                        <PartidoItemSkeleton />
                    </div>
                ) : (
                    <>
                        {activeTab === 'pendientes' ? (
                            <PartidosList
                                partidos={partidosPendientes}
                                isPendientes={true}
                                onPartidoClick={handlePartidoClick}
                                emptyMessage="No hay partidos pendientes"
                                emptyIcon={<PenTool className="text-[#525252]" size={32} />}
                            />
                        ) : (
                            <PartidosList
                                partidos={partidosPlanillados}
                                isPendientes={false}
                                onPartidoClick={handlePartidoClick}
                                emptyMessage="No hay partidos planillados"
                                emptyIcon={<CheckCircle className="text-[#525252]" size={32} />}
                            />
                        )}
                    </>
                )}
            </div>
        </BaseCard>
    );
};

export default PlanilleroPartidosPanel;