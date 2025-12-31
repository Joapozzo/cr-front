import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PartidoDetalleSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Back button skeleton */}
        <Skeleton width={80} height={32} borderRadius={8} />

        {/* Header skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden w-full">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 mb-4">
              {/* Equipo local */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                <Skeleton width={80} height={16} borderRadius={4} className="sm:w-[100px] md:w-[120px]" />
                <Skeleton circle width={28} height={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
              </div>
              {/* Resultado */}
              <div className="flex flex-col items-center gap-2 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] flex-shrink-0">
                <Skeleton width={50} height={20} borderRadius={4} className="sm:w-[60px] sm:h-[24px] md:w-[80px] md:h-[32px]" />
              </div>
              {/* Equipo visita */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Skeleton circle width={28} height={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
                <Skeleton width={80} height={16} borderRadius={4} className="sm:w-[100px] md:w-[120px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Incidencias/Formaciones skeleton (si está finalizado) */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full overflow-hidden">
          <div className="flex border-b border-[#262626] mb-4">
            <Skeleton width="33%" height={40} borderRadius={0} />
            <Skeleton width="34%" height={40} borderRadius={0} />
            <Skeleton width="33%" height={40} borderRadius={0} />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="100%" height={40} borderRadius={4} />
            ))}
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2 w-full overflow-hidden">
          <div className="flex gap-2 justify-center">
            <Skeleton width="50%" height={40} borderRadius={8} />
            <Skeleton width="50%" height={40} borderRadius={8} />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Últimos partidos skeleton */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full overflow-hidden">
                <Skeleton width={100} height={18} borderRadius={4} className="mb-3 sm:w-[120px]" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2 sm:gap-3 p-2">
                      <Skeleton circle width={28} height={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
                      <div className="flex-1 space-y-1 min-w-0">
                        <Skeleton width={50} height={14} borderRadius={4} className="sm:w-[60px]" />
                        <Skeleton width={80} height={12} borderRadius={4} className="sm:w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

