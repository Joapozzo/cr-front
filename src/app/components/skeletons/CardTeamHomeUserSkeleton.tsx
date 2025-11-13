export const CardTeamHomeUserSkeleton = () => {
    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="h-4 bg-[var(--black-600)] rounded w-32 animate-pulse"></div>
            </div>
            <div className="px-6 py-4">
                <div className="h-12 bg-[var(--black-700)] rounded animate-pulse"></div>
            </div>
        </div>
    );
}