import { useState, useEffect } from "react";
import { BaseCard } from "./BaseCard";
import TabNavigation from "./TabNavigationPlanillero";
import PartidosList from "./PartidosListPlanillero";
import { CheckCircle, PenTool } from "lucide-react";
import PartidoItemSkeleton from "./skeletons/CardPartidotemSkeleton";
import { usePartidosPlanilleroPaginados } from "../hooks/usePartidosPlanillero";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";

const ITEMS_POR_PAGINA = 5;

const PlanilleroPartidosPanel: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'pendientes' | 'planillados'>('pendientes');
    
    // Estados para controlar cuántos items mostrar (UI state)
    const [itemsMostradosPendientes, setItemsMostradosPendientes] = useState(ITEMS_POR_PAGINA);
    const [itemsMostradosPlanillados, setItemsMostradosPlanillados] = useState(ITEMS_POR_PAGINA);

    // Hooks para obtener datos (React Query maneja el cache)
    const pendientes = usePartidosPlanilleroPaginados('pendientes', ITEMS_POR_PAGINA, {
        enabled: activeTab === 'pendientes',
    });

    const planillados = usePartidosPlanilleroPaginados('planillados', ITEMS_POR_PAGINA, {
        enabled: activeTab === 'planillados',
    });

    // Seleccionar datos según la pestaña activa
    const datosActuales = activeTab === 'pendientes' ? pendientes : planillados;
    const itemsMostrados = activeTab === 'pendientes' ? itemsMostradosPendientes : itemsMostradosPlanillados;
    const setItemsMostrados = activeTab === 'pendientes' 
        ? setItemsMostradosPendientes 
        : setItemsMostradosPlanillados;

    // Resetear items mostrados cuando cambia la pestaña
    useEffect(() => {
        setItemsMostradosPendientes(ITEMS_POR_PAGINA);
        setItemsMostradosPlanillados(ITEMS_POR_PAGINA);
    }, [activeTab]);

    // Cargar automáticamente más páginas si necesitamos más items de los que tenemos cargados
    useEffect(() => {
        if (itemsMostrados > datosActuales.items.length && datosActuales.hasNextPage && !datosActuales.isFetchingNextPage) {
            datosActuales.fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsMostrados, datosActuales.items.length, datosActuales.hasNextPage, datosActuales.isFetchingNextPage]);

    // Partidos a mostrar (slicing de los items cargados)
    const partidosAMostrar = datosActuales.items.slice(0, itemsMostrados);
    
    // Calcular si hay más partidos
    const hayMasPartidosEnServidor = datosActuales.items.length < datosActuales.total;
    const hayMasPartidosEnMemoria = itemsMostrados < datosActuales.items.length;
    const hayMasPartidos = hayMasPartidosEnServidor || hayMasPartidosEnMemoria;
    // Mostrar "Ver menos" siempre que haya más de 5 items mostrados
    const mostrarVerMenos = itemsMostrados > ITEMS_POR_PAGINA;
    const isLoading = datosActuales.isLoading;

    const handlePartidoClick = (partidoId: number) => {
        router.push(`partidos/${partidoId}`);
    };

    const handleVerMas = () => {
        // Incrementar la cantidad de items a mostrar
        // El useEffect se encargará de cargar más páginas si es necesario
        setItemsMostrados(itemsMostrados + ITEMS_POR_PAGINA);
    };

    const handleVerMenos = () => {
        // Solo reducir la cantidad mostrada, no hacer fetch
        setItemsMostrados(prev => Math.max(ITEMS_POR_PAGINA, prev - ITEMS_POR_PAGINA));
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
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                    }}
                    pendientesCount={pendientes.total}
                    planilladosCount={planillados.total}
                />
            </div>

            {/* Contenido */}
            <div className="px-6 pb-6">
                {isLoading && partidosAMostrar.length === 0 ? (
                    <div className="space-y-4">
                        <PartidoItemSkeleton />
                        <PartidoItemSkeleton />
                    </div>
                ) : (
                    <>
                        {activeTab === 'pendientes' ? (
                            <PartidosList
                                partidos={partidosAMostrar}
                                isPendientes={true}
                                onPartidoClick={handlePartidoClick}
                                emptyMessage="No hay partidos pendientes"
                                emptyIcon={<PenTool className="text-[#525252]" size={32} />}
                            />
                        ) : (
                            <PartidosList
                                partidos={partidosAMostrar}
                                isPendientes={false}
                                onPartidoClick={handlePartidoClick}
                                emptyMessage="No hay partidos planillados"
                                emptyIcon={<CheckCircle className="text-[#525252]" size={32} />}
                            />
                        )}
                        
                        {/* Botones "Ver más" / "Ver menos" */}
                        {(hayMasPartidos || mostrarVerMenos) && (
                            <div className="mt-4 pt-4 border-t border-[#262626] flex flex-row gap-2">
                                {mostrarVerMenos && (
                                    <Button
                                        onClick={handleVerMenos}
                                        variant="default"
                                        size="md"
                                        fullWidth
                                    >
                                        Ver menos
                                    </Button>
                                )}
                                {hayMasPartidos && (
                                    <Button
                                        onClick={handleVerMas}
                                        variant="more"
                                        size="md"
                                        fullWidth
                                        disabled={datosActuales.isFetchingNextPage}
                                    >
                                        {datosActuales.isFetchingNextPage ? 'Cargando...' : 'Ver más'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </BaseCard>
    );
};

export default PlanilleroPartidosPanel;