import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HistorialChatSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] overflow-hidden w-full">
                {/* Header skeleton */}
                <div className="bg-[var(--black-900)] px-4 sm:px-6 py-4 border-b border-[var(--gray-300)]">
                    <Skeleton width={180} height={16} borderRadius={6} className="max-w-[180px]" />
                </div>

                {/* Chat Container skeleton */}
                <div className="p-4 sm:p-6 space-y-4 w-full overflow-hidden">
                    {/* Invitación de Equipo (Izquierda) */}
                    <div className="flex gap-2 sm:gap-3 items-start w-full min-w-0">
                        {/* Avatar skeleton */}
                        <Skeleton circle width={40} height={40} className="flex-shrink-0" />

                        {/* Mensaje skeleton */}
                        <div className="flex-1 max-w-[70%] min-w-0">
                            <div className="bg-[var(--black-800)] rounded-2xl rounded-tl-none p-2 sm:p-3 border border-[var(--gray-300)] w-full overflow-hidden">
                                {/* Nombre equipo y badge */}
                                <div className="flex items-center gap-2 mb-1 min-w-0">
                                    <Skeleton width={120} height={14} borderRadius={6} className="max-w-[120px] sm:max-w-[150px]" />
                                    <Skeleton circle width={12} height={12} className="flex-shrink-0" />
                                </div>

                                {/* Categoría y edición */}
                                <Skeleton width={160} height={12} borderRadius={6} className="mb-2 max-w-[160px] sm:max-w-[200px]" />

                                {/* Mensaje */}
                                <Skeleton width="100%" height={12} borderRadius={6} className="mb-1" />
                                <Skeleton width="80%" height={12} borderRadius={6} className="mb-2" />

                                {/* Footer con estado y fecha */}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--gray-300)] gap-2">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <Skeleton circle width={14} height={14} className="flex-shrink-0" />
                                        <Skeleton width={60} height={12} borderRadius={6} className="max-w-[60px]" />
                                    </div>
                                    <Skeleton width={70} height={12} borderRadius={6} className="max-w-[70px] flex-shrink-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solicitud del Jugador (Derecha) */}
                    <div className="flex gap-2 sm:gap-3 items-start justify-end w-full min-w-0">
                        {/* Mensaje skeleton */}
                        <div className="flex-1 max-w-[70%] min-w-0 flex flex-col items-end">
                            <div className="bg-[var(--black-900)] rounded-2xl rounded-tr-none p-2 sm:p-3 w-full overflow-hidden">
                                {/* Nombre equipo y badge */}
                                <div className="flex items-center gap-2 mb-1 justify-end min-w-0">
                                    <Skeleton circle width={12} height={12} className="flex-shrink-0" />
                                    <Skeleton width={100} height={14} borderRadius={6} className="max-w-[100px] sm:max-w-[120px]" />
                                </div>

                                {/* Categoría y edición */}
                                <div className="flex justify-end mb-2 w-full">
                                    <Skeleton width={140} height={12} borderRadius={6} className="max-w-[140px] sm:max-w-[180px]" />
                                </div>

                                {/* Footer con fecha y estado */}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--black-700)]/30 gap-2">
                                    <Skeleton width={60} height={12} borderRadius={6} className="max-w-[60px]" />
                                    <div className="flex items-center gap-1 min-w-0">
                                        <Skeleton circle width={14} height={14} className="flex-shrink-0" />
                                        <Skeleton width={70} height={12} borderRadius={6} className="max-w-[70px]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar skeleton */}
                        <Skeleton circle width={40} height={40} className="flex-shrink-0" />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default HistorialChatSkeleton;