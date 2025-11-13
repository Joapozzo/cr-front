'use client';

import React from 'react';

interface NoticiasSkeletonProps {
    className?: string;
    itemsCount?: number;
}

const NoticiasSkeleton: React.FC<NoticiasSkeletonProps> = ({
    className = "",
    itemsCount = 3
}) => {
    return (
        <div className={`bg-transparent rounded-2xl overflow-hidden ${className}`}>
            {/* Header skeleton */}
            <div className="flex items-center justify-center px-6 py-4 border-b border-[var(--black-800)]">
                <div className="h-6 bg-[var(--gray-300)] rounded w-20 animate-pulse" />
            </div>

            {/* Contenido skeleton */}
            <div className="p-6">
                <div className="space-y-4">
                    {[...Array(itemsCount)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-[var(--gray-400)] rounded-2xl p-4 animate-pulse"
                        >
                            <div className="flex items-stretch justify-between gap-4">
                                {/* Información de la noticia skeleton */}
                                <div className="flex items-start gap-5 flex-1">
                                    {/* Imagen skeleton */}
                                    <div className="w-[120px] h-[120px] bg-[var(--gray-300)] rounded-xl animate-pulse" />

                                    {/* Contenido de texto skeleton */}
                                    <div className="flex flex-col gap-3 flex-1">
                                        {/* Fecha skeleton */}
                                        <div className="h-3 bg-[var(--gray-300)] rounded w-20 animate-pulse" />

                                        {/* Título skeleton */}
                                        <div className="space-y-2">
                                            <div className="h-5 bg-[var(--gray-300)] rounded w-3/4 animate-pulse" />
                                            <div className="h-5 bg-[var(--gray-300)] rounded w-1/2 animate-pulse" />
                                        </div>

                                        {/* Categorías skeleton */}
                                        <div className="flex items-center flex-wrap gap-2">
                                            <div className="h-6 bg-[var(--gray-300)] rounded-full w-16 animate-pulse" />
                                            <div className="h-6 bg-[var(--gray-300)] rounded-full w-20 animate-pulse" />
                                            <div className="h-6 bg-[var(--gray-300)] rounded-full w-14 animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de acción skeleton */}
                                <div className="flex items-center justify-center">
                                    <div className="h-10 bg-[var(--gray-300)] rounded-full w-24 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones de paginación skeleton */}
                <div className="flex gap-3 justify-center items-center mt-6">
                    <div className="h-10 bg-[var(--gray-300)] rounded-full w-24 animate-pulse" />
                    <div className="h-10 bg-[var(--gray-300)] rounded-full w-24 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default NoticiasSkeleton;