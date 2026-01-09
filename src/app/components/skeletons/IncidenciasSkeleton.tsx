import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const IncidenciasSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="flex flex-col space-y-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div 
                        key={index}
                        className="flex items-center gap-4 py-3 opacity-0 translate-y-4"
                        style={{ 
                            animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards`
                        }}
                    >
                        {/* Equipo Local - Alineado a la derecha */}
                        <div className="flex-1 flex justify-end">
                            {index % 2 === 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <Skeleton width={120} height={16} borderRadius={4} />
                                    </div>
                                    <div className="text-xs font-mono">
                                        <Skeleton width={24} height={14} borderRadius={4} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Icono centrado */}
                        <div className="flex items-center justify-center w-10 flex-shrink-0">
                            <Skeleton circle width={20} height={20} />
                        </div>

                        {/* Equipo Visita - Alineado a la izquierda */}
                        <div className="flex-1 flex justify-start">
                            {index % 2 === 1 && (
                                <div className="flex items-center gap-2">
                                    <div className="text-xs font-mono">
                                        <Skeleton width={24} height={14} borderRadius={4} />
                                    </div>
                                    <div className="text-left">
                                        <Skeleton width={120} height={16} borderRadius={4} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </SkeletonTheme>
    );
};

export default IncidenciasSkeleton;

