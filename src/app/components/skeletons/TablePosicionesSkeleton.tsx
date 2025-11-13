import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TablaPosicionesSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                {/* Header skeleton */}
                <div className="p-4 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={20} height={20} />
                        <Skeleton width={180} height={24} borderRadius={6} />
                    </div>
                </div>

                {/* Table skeleton */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Table header skeleton */}
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <Skeleton width={40} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <Skeleton width={80} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={30} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={20} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={20} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={20} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={30} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={30} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={30} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={40} height={12} borderRadius={4} />
                                </th>
                            </tr>
                        </thead>

                        {/* Table body skeleton - 8 filas */}
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {[...Array(8)].map((_, index) => (
                                <tr key={index}>
                                    {/* Posición */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Skeleton width={4} height={24} borderRadius={2} className="mr-3" />
                                            <Skeleton width={20} height={20} borderRadius={4} />
                                        </div>
                                    </td>
                                    {/* Equipo */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton circle width={24} height={24} />
                                            <Skeleton width={150} height={16} borderRadius={4} />
                                        </div>
                                    </td>
                                    {/* PJ */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={20} height={16} borderRadius={4} />
                                    </td>
                                    {/* G */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={20} height={16} borderRadius={4} />
                                    </td>
                                    {/* E */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={20} height={16} borderRadius={4} />
                                    </td>
                                    {/* P */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={20} height={16} borderRadius={4} />
                                    </td>
                                    {/* GF */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={24} height={16} borderRadius={4} />
                                    </td>
                                    {/* GC */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={24} height={16} borderRadius={4} />
                                    </td>
                                    {/* DG */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={30} height={16} borderRadius={4} />
                                    </td>
                                    {/* Pts */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={30} height={22} borderRadius={4} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Leyenda skeleton */}
                <div className="px-4 py-3 bg-[var(--gray-400)] border-t border-[var(--gray-300)]">
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Skeleton width={12} height={12} borderRadius={2} />
                            <Skeleton width={140} height={12} borderRadius={4} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton width={12} height={12} borderRadius={2} />
                            <Skeleton width={80} height={12} borderRadius={4} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton width={12} height={12} borderRadius={2} />
                            <Skeleton width={90} height={12} borderRadius={4} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default TablaPosicionesSkeleton;