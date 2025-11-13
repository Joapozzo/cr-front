import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HistorialChatSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] overflow-hidden">
                {/* Header skeleton */}
                <div className="bg-[var(--black-900)] px-6 py-4 border-b border-[var(--gray-300)]">
                    <Skeleton width={180} height={16} borderRadius={6} />
                </div>

                {/* Chat Container skeleton */}
                <div className="p-6 space-y-4">
                    {/* Invitación de Equipo (Izquierda) */}
                    <div className="flex gap-3 items-start">
                        {/* Avatar skeleton */}
                        <Skeleton circle width={40} height={40} />

                        {/* Mensaje skeleton */}
                        <div className="flex-1 max-w-[70%]">
                            <div className="bg-[var(--black-800)] rounded-2xl rounded-tl-none p-3 border border-[var(--gray-300)]">
                                {/* Nombre equipo y badge */}
                                <div className="flex items-center gap-2 mb-1">
                                    <Skeleton width={120} height={14} borderRadius={6} />
                                    <Skeleton circle width={12} height={12} />
                                </div>

                                {/* Categoría y edición */}
                                <Skeleton width={160} height={12} borderRadius={6} className="mb-2" />

                                {/* Mensaje */}
                                <Skeleton width="100%" height={12} borderRadius={6} className="mb-1" />
                                <Skeleton width="80%" height={12} borderRadius={6} className="mb-2" />

                                {/* Footer con estado y fecha */}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--gray-300)]">
                                    <div className="flex items-center gap-1">
                                        <Skeleton circle width={14} height={14} />
                                        <Skeleton width={60} height={12} borderRadius={6} />
                                    </div>
                                    <Skeleton width={70} height={12} borderRadius={6} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solicitud del Jugador (Derecha) */}
                    <div className="flex gap-3 items-start justify-end">
                        {/* Mensaje skeleton */}
                        <div className="flex-1 max-w-[70%] flex flex-col items-end">
                            <div className="bg-[var(--black-900)] rounded-2xl rounded-tr-none p-3 w-full">
                                {/* Nombre equipo y badge */}
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    <Skeleton circle width={12} height={12} />
                                    <Skeleton width={100} height={14} borderRadius={6} />
                                </div>

                                {/* Categoría y edición */}
                                <div className="flex justify-end mb-2">
                                    <Skeleton width={140} height={12} borderRadius={6} />
                                </div>

                                {/* Mensaje */}
                                {/* <div className="flex flex-col items-end gap-1 mb-2">
                                    <Skeleton width="100%" height={12} borderRadius={6} />
                                    <Skeleton width="90%" height={12} borderRadius={6} />
                                </div> */}

                                {/* Footer con fecha y estado */}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--black-700)]/30">
                                    <Skeleton width={60} height={12} borderRadius={6} />
                                    <div className="flex items-center gap-1">
                                        <Skeleton circle width={14} height={14} />
                                        <Skeleton width={70} height={12} borderRadius={6} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar skeleton */}
                        <Skeleton circle width={40} height={40} />
                    </div>
                </div>

                {/* Ver más button skeleton */}
                {/* <div className="px-6 py-4 border-t border-[var(--gray-300)]">
                    <Skeleton width="100%" height={32} borderRadius={8} />
                </div> */}
            </div>
        </SkeletonTheme>
    );
};

export default HistorialChatSkeleton;