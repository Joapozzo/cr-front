import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SquadTableSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-4">
                {/* Tabla Principal */}
                <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">
                    {/* Header de la tabla */}
                    <div className="bg-[#0a0a0a] border-b border-[#262626] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <Skeleton width={80} height={12} borderRadius={4} />
                            <div className="flex items-center gap-8">
                                <Skeleton width={30} height={12} borderRadius={4} />
                                <Skeleton width={30} height={12} borderRadius={4} />
                                <Skeleton width={30} height={12} borderRadius={4} />
                                <Skeleton width={30} height={12} borderRadius={4} />
                                <Skeleton width={30} height={12} borderRadius={4} />
                            </div>
                        </div>
                    </div>

                    {/* Filas de jugadores */}
                    <div className="divide-y divide-[#262626]">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="px-4 py-3">
                                <div className="flex items-center justify-between">
                                    {/* Jugador info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <Skeleton circle width={40} height={40} />
                                        <div className="space-y-1">
                                            <Skeleton width={150} height={14} borderRadius={4} />
                                            <Skeleton width={80} height={12} borderRadius={4} />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-8">
                                        <Skeleton width={20} height={14} borderRadius={4} />
                                        <Skeleton width={20} height={14} borderRadius={4} />
                                        <Skeleton width={20} height={14} borderRadius={4} />
                                        <Skeleton width={20} height={14} borderRadius={4} />
                                        <Skeleton width={20} height={14} borderRadius={4} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default SquadTableSkeleton;