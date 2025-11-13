import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PartidoDetalleSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Back button skeleton */}
        <Skeleton width={80} height={32} borderRadius={8} />

        {/* Header skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 sm:gap-6 mb-4">
              {/* Equipo local */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <Skeleton width={100} height={18} borderRadius={4} className="sm:w-120" />
                <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10" />
              </div>
              {/* Resultado */}
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <Skeleton width={60} height={24} borderRadius={4} className="sm:w-80 sm:h-32" />
              </div>
              {/* Equipo visita */}
              <div className="flex items-center gap-3 flex-1">
                <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10" />
                <Skeleton width={100} height={18} borderRadius={4} className="sm:w-120" />
              </div>
            </div>
          </div>
        </div>

        {/* Incidencias/Formaciones skeleton (si está finalizado) */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
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
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2">
          <div className="flex gap-2">
            <Skeleton width="50%" height={40} borderRadius={8} />
            <Skeleton width="50%" height={40} borderRadius={8} />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Últimos partidos skeleton */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
                <Skeleton width={120} height={18} borderRadius={4} className="mb-3" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3 p-2">
                      <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10" />
                      <div className="flex-1 space-y-1">
                        <Skeleton width={50} height={14} borderRadius={4} />
                        <Skeleton width={100} height={12} borderRadius={4} />
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

