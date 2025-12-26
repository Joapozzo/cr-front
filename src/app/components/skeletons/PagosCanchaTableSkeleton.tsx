import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PagosCanchaTableSkeleton() {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--black-950)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={80} height={14} />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={100} height={14} />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={120} height={14} />
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={80} height={14} />
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={80} height={14} />
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={70} height={14} />
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                    <Skeleton width={80} height={14} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="hover:bg-[var(--black-950)] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton width={100} height={16} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton width={150} height={16} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton width={120} height={16} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Skeleton width={80} height={16} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Skeleton width={80} height={16} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Skeleton width={70} height={24} borderRadius={12} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Skeleton width={100} height={32} borderRadius={6} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SkeletonTheme>
    );
}

