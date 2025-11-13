import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CardCanchaFutbol from '../CardCanchaFutbol';

const DreamTeamSkeleton: React.FC = () => {
    const formacionDefault = [1, 2, 3, 1]; // 1-2-3-1

    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="relative w-full max-w-full">
                {/* Campo de fútbol */}
                <div 
                    className="relative bg-transparent border-2 border-[var(--gray-200)] rounded-xl overflow-hidden w-full"
                    style={{ aspectRatio: '1.4/1', minHeight: '700px' }}
                >
                    <CardCanchaFutbol />

                    {/* Jugadores skeleton */}
                    <div className="absolute inset-0 p-6 z-10 flex flex-col justify-center">
                        {formacionDefault.map((cantidad, filaIndex) => {
                            const filaInvertida = formacionDefault.length - 1 - filaIndex;
                            const espacioVertical = 0.2 + (filaInvertida / (formacionDefault.length - 1)) * 0.6;

                            return (
                                <div
                                    key={filaIndex}
                                    className="absolute flex justify-center items-center w-full"
                                    style={{
                                        top: `${espacioVertical * 100}%`,
                                        transform: 'translateY(-50%)',
                                        left: '50%',
                                        marginLeft: '-50%'
                                    }}
                                >
                                    <div className="flex justify-center items-center gap-30" style={{ width: '90%' }}>
                                        {Array.from({ length: cantidad }).map((_, jugadorIndex) => (
                                            <div
                                                key={jugadorIndex}
                                                className="flex flex-col items-center relative"
                                            >
                                                <div className="relative">
                                                    {/* Avatar skeleton */}
                                                    <Skeleton 
                                                        circle 
                                                        width={56} 
                                                        height={56} 
                                                        className="shadow-lg"
                                                    />
                                                </div>

                                                {/* Nombre skeleton */}
                                                <div className="mt-3">
                                                    <Skeleton 
                                                        width={100} 
                                                        height={28} 
                                                        borderRadius={6}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Indicador de formación skeleton */}
                    <div className="absolute top-4 left-4">
                        <Skeleton width={80} height={36} borderRadius={8} />
                    </div>

                    {/* Estadísticas skeleton */}
                    <div className="absolute top-4 right-4">
                        <Skeleton width={60} height={36} borderRadius={8} />
                    </div>
                </div>

                {/* Selector de formaciones skeleton */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton 
                            key={i} 
                            width={100} 
                            height={40} 
                            borderRadius={8}
                        />
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default DreamTeamSkeleton;