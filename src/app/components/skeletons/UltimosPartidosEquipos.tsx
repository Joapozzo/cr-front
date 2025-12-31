import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const UltimosPartidosEquiposSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2 sm:p-3 w-full min-w-0">
                <Skeleton width={80} height={14} borderRadius={4} className="mb-2 px-1" />
                <div className="space-y-1.5">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5 p-1.5 bg-[var(--black-800)] rounded-lg w-full min-w-0">
                            <Skeleton width={20} height={3} borderRadius={2} className="mx-auto" />
                            <div className="flex items-center gap-1.5 justify-center">
                                <Skeleton circle width={24} height={24} className="flex-shrink-0" />
                                <Skeleton width={32} height={12} borderRadius={3} className="flex-shrink-0" />
                                <Skeleton circle width={24} height={24} className="flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
}

export default UltimosPartidosEquiposSkeleton;