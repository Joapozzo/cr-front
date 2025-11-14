import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CaraCaraSkeleton: React.FC = () => { 
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
          <div className="py-4 space-y-4 sm:space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
                  <Skeleton width={80} height={16} borderRadius={4} className="mb-2" />
                  <Skeleton width={48} height={32} borderRadius={4} className="mb-1" />
                  <Skeleton width={64} height={12} borderRadius={4} />
                </div>
              ))}
            </div>
            {/* Partidos skeleton */}
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
              <Skeleton width={128} height={16} borderRadius={4} className="mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={48} borderRadius={4} />
                ))}
              </div>
            </div>
          </div>
        </SkeletonTheme>
      );
}

export default CaraCaraSkeleton