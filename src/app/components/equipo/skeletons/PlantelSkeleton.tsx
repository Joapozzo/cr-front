export default function PlantelSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 bg-[var(--gray-300)] rounded w-48 animate-pulse" />
                    <div className="h-4 bg-[var(--gray-300)] rounded w-64 animate-pulse" />
                </div>
                <div className="h-10 bg-[var(--gray-300)] rounded w-40 animate-pulse" />
            </div>
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-200)]">
                            <tr>
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <th key={index} className="px-6 py-4">
                                        <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: 7 }).map((_, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4">
                                            <div className={`h-4 bg-[var(--gray-300)] rounded animate-pulse ${
                                                colIndex === 0 ? 'w-32' :
                                                colIndex === 1 ? 'w-20' :
                                                colIndex === 2 ? 'w-24' :
                                                'w-16'
                                            }`} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

