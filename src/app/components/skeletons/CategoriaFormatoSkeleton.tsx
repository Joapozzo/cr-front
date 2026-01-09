export const CategoriaFormatoSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 bg-[var(--gray-300)] rounded animate-pulse w-64"></div>
                    <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-96"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-8 bg-[var(--gray-300)] rounded-full animate-pulse w-24"></div>
                    <div className="h-9 bg-[var(--gray-300)] rounded animate-pulse w-28"></div>
                </div>
            </div>

            {/* Fases Skeleton */}
            <div className="space-y-8">
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="space-y-4">
                        {/* Fase Header */}
                        <div className="flex items-center justify-between">
                            <div className="h-6 bg-[var(--gray-300)] rounded animate-pulse w-32"></div>
                            <div className="h-9 bg-[var(--gray-300)] rounded animate-pulse w-36"></div>
                        </div>

                        {/* Zonas Skeleton */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {[...Array(2)].map((_, zoneIndex) => (
                                <div key={zoneIndex} className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-5 bg-[var(--gray-300)] rounded animate-pulse w-24"></div>
                                        <div className="h-8 bg-[var(--gray-300)] rounded animate-pulse w-8"></div>
                                    </div>
                                    <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-40"></div>
                                    <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-center pt-6">
                <div className="h-10 bg-[var(--gray-300)] rounded animate-pulse w-48"></div>
            </div>
        </div>
    );
};

