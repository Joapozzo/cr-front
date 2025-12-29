import { ChevronRight } from 'lucide-react';
import MatchCard from './CardPartidoGenerico';
import { PartidoEquipo } from '../types/partido';
import MatchCardSkeleton from './skeletons/CardPartidoGenericoSkeleton';
import { useUltimoYProximoPartido } from '../hooks/usePartidosEquipo';

interface DaysMatchEquipoProps {
    id_categoria_edicion: number;
    id_equipo: number;
    isLoading?: boolean;
}

interface MatchCardProps {
    partido: PartidoEquipo | null | undefined;
    isLoading?: boolean;
}

export function ProximoPartido({ partido, isLoading }: MatchCardProps) {
    return (
        <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">

            <div className="flex items-center justify-between p-4 border-b border-[#262626]">
                <h3 className="text-white font-semibold">Próximo Partido</h3>
                <button className="flex items-center gap-1 text-[#737373] hover:text-white transition-colors text-sm">
                    Ver más
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Contenido */}
            <div className="p-2">
                {
                    isLoading ? <MatchCardSkeleton /> : partido ? <MatchCard partido={partido} /> : null
                }
            </div>
        </div>
    );
}

export function UltimoPartido({ partido, isLoading }: MatchCardProps) {
    return (
        <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#262626]">
                <h3 className="text-white font-semibold">Último Partido</h3>
                <button className="flex items-center gap-1 text-[#737373] hover:text-white transition-colors text-sm">
                    Ver más
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Contenido */}
            <div className="p-2">
                {
                    isLoading ? <MatchCardSkeleton /> : partido ? <MatchCard partido={partido} /> : null
                }
            </div>
        </div>
    );
}

export function PartidosDestacados({ id_categoria_edicion, id_equipo }: DaysMatchEquipoProps) {
    const { data: partidosData, isLoading: isLoadingProximoPartido } = useUltimoYProximoPartido(id_equipo, id_categoria_edicion);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProximoPartido partido={partidosData?.proximo} isLoading={isLoadingProximoPartido} />
            <UltimoPartido partido={partidosData?.ultimo} isLoading={isLoadingProximoPartido} />
        </div>
    );
}