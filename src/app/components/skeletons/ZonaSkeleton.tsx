export const ZonaSkeleton = () => {
    return (
        <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-[var(--gray-300)] rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-5 bg-[var(--gray-300)] rounded animate-pulse w-32"></div>
                        <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-40"></div>
                        <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-32"></div>
                    </div>
                </div>
                <div className="h-8 w-8 bg-[var(--gray-300)] rounded animate-pulse"></div>
            </div>
        </div>
    );
};

