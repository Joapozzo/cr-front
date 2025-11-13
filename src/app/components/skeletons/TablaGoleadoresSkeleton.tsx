import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TablaGoleadoresSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                {/* Header */}


                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <Skeleton width={80} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={60} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={70} height={12} borderRadius={4} />
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <Skeleton width={80} height={12} borderRadius={4} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <tr key={index}>
                                    {/* Jugador */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton circle width={24} height={24} />
                                            <div className="flex flex-col gap-1">
                                                <Skeleton width={120} height={16} borderRadius={4} />
                                                <Skeleton width={80} height={12} borderRadius={4} />
                                            </div>
                                        </div>
                                    </td>
                                    {/* Goles */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={30} height={20} borderRadius={4} />
                                    </td>
                                    {/* Partidos */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={20} height={16} borderRadius={4} />
                                    </td>
                                    {/* Promedio */}
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={30} height={16} borderRadius={4} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default TablaGoleadoresSkeleton;