import { Suspense } from 'react';
import EquipoInfoPageContent from './EquipoInfoPageContent';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EquipoInfoPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-6">
                            <Skeleton height={150} borderRadius={6} />
                            <Skeleton height={200} borderRadius={6} />
                            <Skeleton height={250} borderRadius={6} />
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <EquipoInfoPageContent />
        </Suspense>
    );
}
