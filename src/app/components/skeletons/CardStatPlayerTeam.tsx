import { SkeletonTheme } from "react-loading-skeleton"
import { StatsResumenCardSkeleton } from "./StatsResumenCardSkeleton"


const CardStatPlayerTeamSkeleton = () => { 
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
        <div className="space-y-3 w-full">
          <h3 className="text-white font-semibold text-sm px-1">Estadísticas temporada</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent hover:scrollbar-thumb-[#525252] pb-2 scroll-smooth w-full">
            {[...Array(1)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <StatsResumenCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    )
}

export default CardStatPlayerTeamSkeleton