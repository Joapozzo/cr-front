import { Suspense } from 'react';
import EquipoPlantelPageContent from './EquipoPlantelPageContent';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EquipoPlantelPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-4">
                            <Skeleton height={40} borderRadius={6} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} height={100} borderRadius={6} />
                                ))}
                            </div>
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <EquipoPlantelPageContent />
        </Suspense>
    );
}
