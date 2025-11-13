import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const StatsResumenCardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full min-w-[240px] sm:min-w-[280px] flex-shrink-0">
        {/* Header skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton circle width={16} height={16} />
          <Skeleton width={90} height={14} borderRadius={4} />
        </div>
        
        {/* Jugador destacado skeleton */}
        <div className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4 mb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Izquierda: nombre, equipo, stats */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton width={120} height={18} borderRadius={4} />
              <Skeleton width={80} height={12} borderRadius={4} />
              <div className="flex items-center gap-2">
                <Skeleton width={30} height={20} borderRadius={4} />
                <Skeleton width={50} height={12} borderRadius={4} />
              </div>
            </div>
            {/* Derecha: foto */}
            <Skeleton circle width={64} height={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
        
        {/* Otros jugadores skeleton */}
        <div className="space-y-2 sm:space-y-2.5 mb-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-2.5">
              {/* Foto skeleton */}
              <Skeleton circle width={32} height={32} />
              {/* Nombre y equipo skeleton */}
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton width={100} height={12} borderRadius={4} />
                <Skeleton width={70} height={10} borderRadius={4} />
              </div>
              {/* Valor skeleton */}
              <Skeleton width={20} height={14} borderRadius={4} />
            </div>
          ))}
        </div>
        
        {/* Ver todos skeleton */}
        <div className="flex justify-center">
          <Skeleton width={60} height={16} borderRadius={4} />
        </div>
      </div>
    </SkeletonTheme>
  );
};
