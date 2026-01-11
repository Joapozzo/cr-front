export default function EquipoHeaderSkeleton() {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-8 bg-[var(--gray-300)] rounded w-48 animate-pulse" />
                        <div className="h-4 bg-[var(--gray-300)] rounded w-64 animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 bg-[var(--gray-300)] rounded w-32 animate-pulse" />
                    <div className="h-10 bg-[var(--gray-300)] rounded w-32 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

