import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { LandPlot } from 'lucide-react';

const NextMatchSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333">
            <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden mb-5">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                    <div className="flex items-center gap-2 text-sm">
                        <Skeleton circle width={30} height={30} />
                        <Skeleton width={120} height={16} />
                        <span className="text-[var(--black-300)]">|</span>
                        <Skeleton width={100} height={16} />
                    </div>
                </div>

                {/* Contenido */}
                <div className="px-6 py-6">
                    {/* Info principal */}
                    <div className="flex w-full items-start gap-4 mb-6">
                        <Skeleton width={80} height={64} />

                        <div className="flex flex-col flex-1">
                            {/* Fecha y jornada */}
                            <Skeleton width={150} height={12} className="mb-1" />
                            <Skeleton width={180} height={12} className="mb-3" />

                            {/* Equipos */}
                            <div className="mt-3 flex flex-col gap-1">
                                <Skeleton width={200} height={24} />
                                <Skeleton width={180} height={24} />
                            </div>
                        </div>

                        {/* Cancha */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <LandPlot className="text-[var(--black-500)] text-3xl mb-1" />
                            <Skeleton width={60} height={12} />
                        </div>
                    </div>

                    {/* Divisor */}
                    <div className="w-full h-px bg-[var(--black-800)] mb-6"></div>

                    {/* Cuenta regresiva */}
                    <div className="flex justify-center items-center gap-8 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center">
                                    <Skeleton width={40} height={32} className="mb-1" />
                                    <Skeleton width={30} height={12} />
                                </div>
                                {i < 3 && <div className="text-xl font-semibold text-[var(--black-500)]">:</div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default NextMatchSkeleton;