import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ParticipacionCardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton width={200} height={20} borderRadius={6} />
              <Skeleton width={150} height={14} borderRadius={4} />
            </div>
            <div className="flex-shrink-0 text-right space-y-1">
              <Skeleton width={40} height={20} borderRadius={4} />
              <Skeleton width={60} height={12} borderRadius={4} />
            </div>
          </div>
        </div>

        {/* Stats generales skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton circle width={20} height={20} />
                <Skeleton width={100} height={14} borderRadius={4} />
              </div>
              <Skeleton width={40} height={24} borderRadius={4} />
            </div>
          ))}
        </div>

        {/* Tabla de posiciones skeleton */}
        <div className="space-y-3">
          <Skeleton width={150} height={18} borderRadius={6} className="px-1" />
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr>
                    {[...Array(10)].map((_, i) => (
                      <th key={i} className="py-2.5 px-3 text-left">
                        <Skeleton width={i === 0 ? 20 : 40} height={10} borderRadius={4} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-[#262626]">
                      <td className="py-3 px-3">
                        <Skeleton width={20} height={14} borderRadius={4} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Skeleton circle width={32} height={32} />
                          <Skeleton width={100} height={14} borderRadius={4} />
                        </div>
                      </td>
                      {[...Array(8)].map((_, colIndex) => (
                        <td key={colIndex} className="py-3 px-3 text-center">
                          <Skeleton width={30} height={14} borderRadius={4} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats de jugadores skeleton */}
        <div className="space-y-4">
          <Skeleton width={180} height={18} borderRadius={6} className="px-1" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 min-h-[270px]">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton width={100} height={14} borderRadius={4} />
                </div>
                {/* Jugador destacado skeleton */}
                <div className="bg-[var(--black-800)] rounded-lg p-3 sm:p-4 mb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton width={120} height={18} borderRadius={4} />
                      <Skeleton width={80} height={12} borderRadius={4} />
                      <div className="flex items-center gap-2">
                        <Skeleton width={30} height={20} borderRadius={4} />
                        <Skeleton width={50} height={12} borderRadius={4} />
                      </div>
                    </div>
                    <Skeleton circle width={64} height={64} />
                  </div>
                </div>
                {/* Otros jugadores skeleton */}
                <div className="space-y-2 sm:space-y-2.5">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2 sm:gap-2.5">
                      <Skeleton circle width={32} height={32} />
                      <div className="flex-1 min-w-0 space-y-1">
                        <Skeleton width={100} height={12} borderRadius={4} />
                        <Skeleton width={70} height={10} borderRadius={4} />
                      </div>
                      <Skeleton width={20} height={14} borderRadius={4} />
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

