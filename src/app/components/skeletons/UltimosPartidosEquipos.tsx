import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const UltimosPartidosEquiposSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
                <Skeleton width={120} height={20} borderRadius={6} className="mb-3" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2 p-2 bg-[var(--black-800)] rounded-lg">
                            <Skeleton width={24} height={4} borderRadius={4} className="mx-auto" />
                            <div className="flex items-center gap-2">
                                <Skeleton circle width={40} height={40} />
                                <Skeleton width={50} height={16} borderRadius={4} />
                                <Skeleton circle width={40} height={40} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
}

export default UltimosPartidosEquiposSkeleton;