import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton para el componente Incidents
const IncidentsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)] rounded-t-2xl">
                    <Skeleton width={120} height={24} borderRadius={6} />
                </div>

                <div className="p-6">
                    {/* Header con nombres de equipos skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Skeleton circle width={16} height={16} />
                            <Skeleton width={80} height={14} borderRadius={6} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton width={80} height={14} borderRadius={6} />
                            <Skeleton circle width={16} height={16} />
                        </div>
                    </div>

                    {/* Lista de incidencias skeleton */}
                    <div className="space-y-3">
                        {/* Incidencia equipo local */}
                        <div className="flex items-center w-full py-3 px-3 rounded-lg justify-start">
                            <Skeleton width={32} height={16} borderRadius={4} />
                            <div className="mx-3">
                                <Skeleton circle width={16} height={16} />
                            </div>
                            <div className="flex-1">
                                <Skeleton width={140} height={14} borderRadius={6} />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        </div>

                        {/* Incidencia equipo visitante */}
                        <div className="flex items-center w-full py-3 px-3 rounded-lg justify-end bg-[#171717]">
                            <div className="flex items-center gap-1">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                            <div className="flex-1 text-right mr-3">
                                <Skeleton width={140} height={14} borderRadius={6} />
                            </div>
                            <div className="mx-3">
                                <Skeleton circle width={16} height={16} />
                            </div>
                            <Skeleton width={32} height={16} borderRadius={4} />
                        </div>

                        {/* Más incidencias alternando */}
                        <div className="flex items-center w-full py-3 px-3 rounded-lg justify-start">
                            <Skeleton width={32} height={16} borderRadius={4} />
                            <div className="mx-3">
                                <Skeleton circle width={16} height={16} />
                            </div>
                            <div className="flex-1">
                                <Skeleton width={120} height={14} borderRadius={6} />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        </div>

                        <div className="flex items-center w-full py-3 px-3 rounded-lg justify-end bg-[#171717]">
                            <div className="flex items-center gap-1">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                            <div className="flex-1 text-right mr-3">
                                <Skeleton width={130} height={14} borderRadius={6} />
                            </div>
                            <div className="mx-3">
                                <Skeleton circle width={16} height={16} />
                            </div>
                            <Skeleton width={32} height={16} borderRadius={4} />
                        </div>

                        <div className="flex items-center w-full py-3 px-3 rounded-lg justify-start">
                            <Skeleton width={32} height={16} borderRadius={4} />
                            <div className="mx-3">
                                <Skeleton circle width={16} height={16} />
                            </div>
                            <div className="flex-1">
                                <Skeleton width={160} height={14} borderRadius={6} />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default IncidentsSkeleton;