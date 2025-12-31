import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CaraCaraSkeleton: React.FC = () => { 
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
          <div className="py-4 space-y-4 sm:space-y-6 w-full">
            {/* Stats skeleton - Más compacto para responsive */}
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full">
              <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
                {/* Victorias Local */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <Skeleton circle width={24} height={24} className="mb-2" />
                  <Skeleton width={24} height={24} borderRadius={4} className="mb-1" />
                  <Skeleton width={40} height={12} borderRadius={4} className="mb-0.5" />
                  <Skeleton width={50} height={10} borderRadius={4} />
                </div>
                
                {/* Empates */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <Skeleton width={24} height={24} borderRadius={4} className="mb-1 mt-[32px] sm:mt-[40px]" />
                  <Skeleton width={40} height={12} borderRadius={4} className="mb-0.5" />
                  <Skeleton width={50} height={10} borderRadius={4} />
                </div>
                
                {/* Victorias Visita */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <Skeleton circle width={24} height={24} className="mb-2" />
                  <Skeleton width={24} height={24} borderRadius={4} className="mb-1" />
                  <Skeleton width={40} height={12} borderRadius={4} className="mb-0.5" />
                  <Skeleton width={50} height={10} borderRadius={4} />
                </div>
              </div>
            </div>
            
            {/* Partidos skeleton - Solo 2 ejemplos */}
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden w-full">
              <div className="divide-y divide-[#262626]">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Skeleton circle width={24} height={24} />
                        <Skeleton width={60} height={12} borderRadius={4} />
                      </div>
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <Skeleton width={40} height={12} borderRadius={4} />
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <Skeleton width={60} height={12} borderRadius={4} />
                        <Skeleton circle width={24} height={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SkeletonTheme>
      );
}

export default CaraCaraSkeleton