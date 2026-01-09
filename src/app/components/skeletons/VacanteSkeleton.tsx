export const VacanteSkeleton = () => {
    return (
        <div className="p-4 rounded-lg border border-[var(--gray-300)] space-y-2">
            <div className="h-3 bg-[var(--gray-300)] rounded animate-pulse w-20"></div>
            <div className="h-4 bg-[var(--gray-300)] rounded animate-pulse w-32"></div>
        </div>
    );
};

