import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardPartidoResultSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)] rounded-t-2xl">
                    <Skeleton width={250} height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center gap-6 px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={60} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={80} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={100} height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between px-6 py-8">
                    {/* Equipo Local skeleton */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <Skeleton width={120} height={20} borderRadius={6} />
                        <Skeleton circle width={40} height={40} />
                    </div>

                    {/* Resultado y estado skeleton */}
                    <div className="flex flex-col items-center gap-2 mx-8">
                        {/* Estado skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton width={80} height={14} borderRadius={6} />
                        </div>
                        
                        {/* Resultado skeleton */}
                        <Skeleton width={60} height={40} borderRadius={8} />
                    </div>

                    {/* Equipo Visitante skeleton */}
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={120} height={20} borderRadius={6} />
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
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                    <Skeleton width={250} height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center gap-6 px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={60} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={80} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={100} height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between px-6 py-8">
                    {/* Equipo Local skeleton */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <Skeleton width={120} height={20} borderRadius={6} />
                        <Skeleton circle width={40} height={40} />
                    </div>

                    {/* Hora skeleton */}
                    <div className="flex flex-col items-center gap-2 mx-8">
                        <Skeleton width={80} height={14} borderRadius={6} />
                        <Skeleton width={60} height={40} borderRadius={8} />
                    </div>

                    {/* Equipo Visitante skeleton */}
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={120} height={20} borderRadius={6} />
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
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                    <Skeleton width={250} height={24} borderRadius={6} />
                </div>

                {/* Detalles del partido skeleton */}
                <div className="flex items-center justify-center gap-6 px-6 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={60} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={80} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={100} height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between px-6 py-8">
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <Skeleton width={120} height={20} borderRadius={6} />
                        <Skeleton circle width={40} height={40} />
                    </div>

                    <div className="flex flex-col items-center gap-2 mx-8">
                        <Skeleton width={80} height={14} borderRadius={6} />
                        <Skeleton width={60} height={40} borderRadius={8} />
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={120} height={20} borderRadius={6} />
                    </div>
                </div>

                {/* Descripción suspendido skeleton */}
                <div className="px-6 pb-6 text-center">
                    <Skeleton width={150} height={14} borderRadius={6} />
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