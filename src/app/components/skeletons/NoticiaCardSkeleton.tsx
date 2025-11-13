import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const NoticiaCardSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                {/* Imagen skeleton */}
                <div className="relative h-48 bg-[var(--gray-300)]">
                    <Skeleton height={192} />

                    {/* Badges skeleton */}
                    <div className="absolute top-2 left-2 flex gap-2">
                        <Skeleton width={80} height={24} borderRadius={4} />
                        <Skeleton width={80} height={24} borderRadius={4} />
                    </div>
                </div>

                {/* Contenido skeleton */}
                <div className="p-4">
                    {/* Tipo y fecha */}
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton width={80} height={20} borderRadius={4} />
                        <Skeleton width={70} height={16} borderRadius={4} />
                    </div>

                    {/* Título */}
                    <Skeleton height={24} className="mb-2" />
                    <Skeleton height={24} width="80%" className="mb-2" />

                    {/* Preview */}
                    <Skeleton height={16} className="mb-1" />
                    <Skeleton height={16} width="60%" className="mb-3" />

                    {/* Visitas */}
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={80} height={14} />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                        <Skeleton height={36} className="flex-1" borderRadius={8} />
                        <Skeleton height={36} width={80} borderRadius={8} />
                        <Skeleton height={36} width={60} borderRadius={8} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const NoticiasGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <NoticiaCardSkeleton key={index} />
            ))}
        </div>
    );
};

export const NoticiaFormSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-6 p-6">
                {/* Título */}
                <div>
                    <Skeleton width={150} height={14} className="mb-2" />
                    <Skeleton height={40} borderRadius={8} />
                </div>

                {/* Imagen de portada */}
                <div>
                    <Skeleton width={150} height={14} className="mb-2" />
                    <Skeleton height={200} borderRadius={8} />
                </div>

                {/* Editor */}
                <div>
                    <Skeleton width={150} height={14} className="mb-2" />
                    <Skeleton height={400} borderRadius={8} />
                </div>

                {/* Tipo de noticia */}
                <div>
                    <Skeleton width={150} height={14} className="mb-2" />
                    <Skeleton height={40} borderRadius={8} />
                </div>

                {/* Categorías */}
                <div>
                    <Skeleton width={150} height={14} className="mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton height={48} borderRadius={8} />
                        <Skeleton height={48} borderRadius={8} />
                        <Skeleton height={48} borderRadius={8} />
                        <Skeleton height={48} borderRadius={8} />
                    </div>
                </div>

                {/* Opciones */}
                <div className="space-y-3 bg-[var(--gray-400)] p-4 rounded-lg">
                    <Skeleton width={200} height={20} borderRadius={4} />
                    <Skeleton width={220} height={20} borderRadius={4} />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                    <Skeleton width={100} height={40} borderRadius={8} />
                    <Skeleton width={150} height={40} borderRadius={8} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const NoticiasHeaderSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Skeleton width={250} height={36} className="mb-2" />
                        <Skeleton width={350} height={20} />
                    </div>
                    <Skeleton width={150} height={48} borderRadius={8} />
                </div>

                {/* Filtros */}
                <div className="bg-[var(--gray-400)] p-4 rounded-lg border border-[var(--gray-300)]">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Skeleton height={40} borderRadius={8} />
                        <Skeleton height={40} borderRadius={8} />
                        <Skeleton height={40} borderRadius={8} />
                        <Skeleton height={40} borderRadius={8} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const NoticiaCardSkeleton2: React.FC = () => {
    return (
        <div className="flex gap-4 justify-center px-2">
            {[1, 2].map((i) => (
                <div key={i} className="flex-shrink-0 w-[250px] sm:w-[380px]">
                    <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#262626] h-full flex flex-col">
                        {/* Imagen skeleton */}
                        <div className="relative h-44 bg-[#262626] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#262626] via-[#333333] to-[#262626] animate-pulse" />
                            
                            {/* Badge skeleton */}
                            <div className="absolute top-2 left-2">
                                <div className="w-16 h-5 bg-[#333333] rounded-md animate-pulse" />
                            </div>
                        </div>

                        {/* Contenido skeleton */}
                        <div className="p-4 flex-1 flex flex-col">
                            {/* Título skeleton */}
                            <div className="space-y-2 mb-3">
                                <div className="h-4 bg-[#262626] rounded w-full animate-pulse" />
                                <div className="h-4 bg-[#262626] rounded w-4/5 animate-pulse" />
                            </div>

                            {/* Descripción skeleton */}
                            <div className="space-y-2 mb-3 flex-1">
                                <div className="h-3 bg-[#262626] rounded w-full animate-pulse" />
                                <div className="h-3 bg-[#262626] rounded w-3/4 animate-pulse" />
                            </div>

                            {/* Meta info skeleton */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
                                <div className="flex items-center gap-3">
                                    <div className="h-3 bg-[#262626] rounded w-16 animate-pulse" />
                                    <div className="h-3 bg-[#262626] rounded w-12 animate-pulse" />
                                </div>
                                <div className="h-3 bg-[#262626] rounded w-16 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};