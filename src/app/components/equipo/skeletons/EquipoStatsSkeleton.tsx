export default function EquipoStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--gray-300)] rounded-lg animate-pulse">
                            <div className="w-5 h-5 bg-[var(--gray-200)] rounded" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-[var(--gray-300)] rounded w-24 animate-pulse" />
                            <div className="h-6 bg-[var(--gray-300)] rounded w-12 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

