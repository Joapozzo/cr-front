interface TableSkeletonProps {
    columns?: number;
    rows?: number;
    className?: string;
}

export const TableSkeleton = ({ 
    columns = 6, 
    rows = 5, 
    className = "" 
}: TableSkeletonProps) => {
    return (
        <div className={`bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header Skeleton */}
                    <thead className="bg-[var(--gray-300)] border-b border-[var(--gray-200)]">
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="px-6 py-4">
                                    <div className="h-4 bg-[var(--gray-200)] rounded animate-pulse w-20"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body Skeleton */}
                    <tbody className="divide-y divide-[var(--gray-300)]">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[var(--gray-300)]">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <div className={`h-4 bg-[var(--gray-300)] rounded animate-pulse ${
                                            // Variamos el ancho para que se vea más natural
                                            colIndex === 0 ? 'w-32' :
                                            colIndex === 1 ? 'w-20' :
                                            colIndex === 2 ? 'w-24' :
                                            colIndex === 3 ? 'w-16' :
                                            colIndex === 4 ? 'w-16' :
                                            colIndex === 5 ? 'w-16' :
                                            'w-20'
                                        }`}></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};