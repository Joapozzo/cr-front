import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TablaPosicionesContentSkeletonProps {
    rows?: number;
}

const TablaPosicionesContentSkeleton: React.FC<TablaPosicionesContentSkeletonProps> = ({
    rows = 5,
}) => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333">
            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--black-800)]">
                            {['Pos', 'Equipo', 'PJ', 'G', 'E', 'P', 'Pts'].map((col) => (
                                <th
                                    key={col}
                                    className="text-left px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider"
                                >
                                    <Skeleton width={col.length * 8} height={16} borderRadius={6} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(rows)].map((_, i) => (
                            <tr
                                key={i}
                                className="border-b border-[var(--black-800)] hover:bg-[var(--black-850)] transition-colors duration-150"
                            >
                                {/* Posición */}
                                <td className="px-4 py-3">
                                    <Skeleton width={16} height={16} borderRadius={6} />
                                </td>

                                {/* Equipo (imagen + texto) */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton circle width={24} height={24} />
                                        <Skeleton width={100} height={16} borderRadius={6} />
                                    </div>
                                </td>

                                {/* PJ */}
                                <td className="px-4 py-3 text-center">
                                    <Skeleton width={16} height={16} borderRadius={6} />
                                </td>

                                {/* G */}
                                <td className="px-4 py-3 text-center">
                                    <Skeleton width={16} height={16} borderRadius={6} />
                                </td>

                                {/* E */}
                                <td className="px-4 py-3 text-center">
                                    <Skeleton width={16} height={16} borderRadius={6} />
                                </td>

                                {/* P */}
                                <td className="px-4 py-3 text-center">
                                    <Skeleton width={16} height={16} borderRadius={6} />
                                </td>

                                {/* Pts */}
                                <td className="px-4 py-3 text-center">
                                    <Skeleton width={24} height={20} borderRadius={6} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leyenda */}
            <div className="px-6 py-4 bg-[var(--black-850)] border-t border-[var(--black-800)]">
                <div className="flex items-center gap-6 text-xs">
                    {[
                        { text: 'Clasificación directa' }, 
                        { text: 'Playoffs' }, 
                        { text: 'Descenso' }
                    ].map((_item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Skeleton width={12} height={12} borderRadius={999} />
                            <Skeleton width={100} height={14} borderRadius={6} />
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default TablaPosicionesContentSkeleton;