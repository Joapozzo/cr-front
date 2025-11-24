/**
 * Skeleton para card de equipo
 */
'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EquipoCardSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4">
                <div className="flex items-start gap-4">
                    {/* Logo skeleton */}
                    <Skeleton width={64} height={64} borderRadius={8} />

                    {/* Información skeleton */}
                    <div className="flex-1 space-y-2">
                        <Skeleton height={20} width="70%" borderRadius={6} />
                        <Skeleton height={24} width={100} borderRadius={9999} />
                        <Skeleton height={16} width="40%" borderRadius={6} />
                    </div>

                    {/* Botón skeleton */}
                    <Skeleton circle width={20} height={20} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

