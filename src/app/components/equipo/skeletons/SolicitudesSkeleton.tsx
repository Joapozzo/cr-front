export default function SolicitudesSkeleton() {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <div className="space-y-4">
                <div className="h-6 bg-[var(--gray-300)] rounded w-40 animate-pulse" />
                <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="p-4 bg-[var(--gray-300)] rounded animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[var(--gray-200)] rounded-full" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-[var(--gray-200)] rounded w-32" />
                                        <div className="h-3 bg-[var(--gray-200)] rounded w-24" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 bg-[var(--gray-200)] rounded w-20" />
                                    <div className="h-8 bg-[var(--gray-200)] rounded w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

