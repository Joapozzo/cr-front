import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CajaDetalleSkeleton() {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton width={200} height={32} borderRadius={6} className="mb-2" />
                        <Skeleton width={300} height={16} borderRadius={6} />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton width={100} height={36} borderRadius={6} />
                        <Skeleton width={100} height={36} borderRadius={6} />
                    </div>
                </div>

                {/* Cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                            <Skeleton width={100} height={14} borderRadius={6} className="mb-2" />
                            <Skeleton width={120} height={28} borderRadius={6} />
                        </div>
                    ))}
                </div>

                {/* Estado skeleton */}
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                    <Skeleton width={200} height={20} borderRadius={6} />
                </div>

                {/* Tabla skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton width={200} height={24} borderRadius={6} />
                        <Skeleton width={120} height={16} borderRadius={6} />
                    </div>
                    <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--black-950)] border-b border-[var(--gray-300)]">
                                    <tr>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <th key={index} className="px-6 py-3">
                                                <Skeleton width={80} height={14} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--gray-300)]">
                                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Array.from({ length: 6 }).map((_, colIndex) => (
                                                <td key={colIndex} className="px-6 py-4">
                                                    <Skeleton width={100} height={16} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
}

