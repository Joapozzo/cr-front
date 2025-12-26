import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FileText } from "lucide-react";
import { BaseCard, CardHeader } from "../BaseCard";

const CardPartidosSemanaSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <BaseCard>
                <CardHeader
                    icon={<FileText className="text-green-400" size={16} />}
                    title="Esta semana"
                />
                <div className="px-6 py-4">
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-[#171717] rounded-lg border border-[#262626] p-4">
                                {/* Header con estado skeleton */}
                                <div className="flex items-center justify-between mb-3">
                                    <Skeleton width={80} height={24} borderRadius={12} />
                                    <Skeleton width={64} height={16} borderRadius={6} />
                                </div>

                                {/* Equipos y resultado skeleton */}
                                <div className="flex items-center justify-between">
                                    {/* Equipo Local skeleton */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <Skeleton circle width={32} height={32} />
                                        <Skeleton width={96} height={16} borderRadius={6} />
                                    </div>

                                    {/* Resultado o Hora skeleton */}
                                    <div className="flex items-center gap-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton circle width={16} height={16} />
                                            {/* <Skeleton width={48} height={20} borderRadius={6} /> */}
                                        </div>
                                    </div>

                                    {/* Equipo Visita skeleton */}
                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                        <Skeleton width={96} height={16} borderRadius={6} />
                                        <Skeleton circle width={32} height={32} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </BaseCard>
        </SkeletonTheme>
    );
};

export default CardPartidosSemanaSkeleton;