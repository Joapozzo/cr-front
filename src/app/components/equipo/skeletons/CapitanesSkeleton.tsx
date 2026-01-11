export default function CapitanesSkeleton() {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <div className="space-y-4">
                <div className="h-6 bg-[var(--gray-300)] rounded w-32 animate-pulse" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[var(--gray-300)] rounded animate-pulse">
                            <div className="w-10 h-10 bg-[var(--gray-200)] rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[var(--gray-200)] rounded w-32" />
                                <div className="h-3 bg-[var(--gray-200)] rounded w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

