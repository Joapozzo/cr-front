import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardPartidoResultSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full overflow-hidden">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-4 bg-[var(--black-800)] rounded-t-2xl">
                    <Skeleton className="w-full max-w-[250px] sm:w-[250px]" height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 px-3 sm:px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[60px] sm:w-[60px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[80px] sm:w-[80px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[100px] sm:w-[100px]" height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-6 sm:py-8">
                    {/* Equipo Local skeleton */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                    </div>

                    {/* Resultado y estado skeleton */}
                    <div className="flex flex-col items-center gap-2 mx-2 sm:mx-8 min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                        {/* Estado skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-[60px] sm:w-[80px]" height={14} borderRadius={6} />
                        </div>
                        
                        {/* Resultado skeleton */}
                        <Skeleton className="w-[50px] sm:w-[60px]" height={32} borderRadius={8} />
                    </div>

                    {/* Equipo Visitante skeleton */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

// Skeleton para partido programado (sin goleadores)
const CardPartidoResultProgramadoSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full overflow-hidden">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-4 border-b border-[#262626]">
                    <Skeleton className="w-full max-w-[250px] sm:w-[250px]" height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 px-3 sm:px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[60px] sm:w-[60px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[80px] sm:w-[80px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[100px] sm:w-[100px]" height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-6 sm:py-8">
                    {/* Equipo Local skeleton */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                    </div>

                    {/* Hora skeleton */}
                    <div className="flex flex-col items-center gap-2 mx-2 sm:mx-8 min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                        <Skeleton className="w-[60px] sm:w-[80px]" height={14} borderRadius={6} />
                        <Skeleton className="w-[50px] sm:w-[60px]" height={32} borderRadius={8} />
                    </div>

                    {/* Equipo Visitante skeleton */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

// Skeleton para partido suspendido (con descripción)
const CardPartidoResultSuspendidoSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full overflow-hidden">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-4 border-b border-[#262626]">
                    <Skeleton className="w-full max-w-[250px] sm:w-[250px]" height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 px-3 sm:px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[60px] sm:w-[60px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[80px] sm:w-[80px]" height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton className="w-[100px] sm:w-[100px]" height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-6 sm:py-8">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                    </div>

                    <div className="flex flex-col items-center gap-2 mx-2 sm:mx-8 min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                        <Skeleton className="w-[60px] sm:w-[80px]" height={14} borderRadius={6} />
                        <Skeleton className="w-[50px] sm:w-[60px]" height={32} borderRadius={8} />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
                        <Skeleton className="w-full max-w-[120px] sm:w-[120px]" height={20} borderRadius={6} />
                    </div>
                </div>

                {/* Descripción suspendido skeleton */}
                <div className="px-3 sm:px-6 pb-6 text-center">
                    <Skeleton className="w-full max-w-[150px] sm:w-[150px] mx-auto" height={14} borderRadius={6} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export {
    CardPartidoResultSkeleton,
    CardPartidoResultProgramadoSkeleton,
    CardPartidoResultSuspendidoSkeleton
};