import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CardCanchaFutbol from '../CardCanchaFutbol';

const DreamTeamSkeleton: React.FC = () => {
    const formacionDefault = [1, 2, 3, 1]; // 1-2-3-1

    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="relative w-full max-w-full">
                {/* Campo de fútbol - Reducido */}
                <div 
                    className="relative bg-transparent border-2 border-[var(--gray-200)] rounded-xl overflow-hidden w-full"
                    style={{ aspectRatio: '1.8/1', minHeight: '350px', maxHeight: '400px' }}
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
                                    <div className="flex justify-center items-center gap-4" style={{ width: '90%' }}>
                                        {Array.from({ length: cantidad }).map((_, jugadorIndex) => (
                                            <div
                                                key={jugadorIndex}
                                                className="flex flex-col items-center relative"
                                            >
                                                <div className="relative">
                                                    {/* Avatar skeleton - Reducido */}
                                                    <Skeleton 
                                                        circle 
                                                        width={40} 
                                                        height={40} 
                                                        className="shadow-lg"
                                                    />
                                                </div>

                                                {/* Nombre skeleton - Reducido */}
                                                <div className="mt-2">
                                                    <Skeleton 
                                                        width={70} 
                                                        height={20} 
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

                </div>
            </div>
        </SkeletonTheme>
    );
};

export default DreamTeamSkeleton;