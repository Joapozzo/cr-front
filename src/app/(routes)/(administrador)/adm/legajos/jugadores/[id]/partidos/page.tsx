import { Suspense } from 'react';
import JugadorPartidosPageContent from './JugadorPartidosPageContent';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function JugadorPartidosPage() {
    return (
        <Suspense
            fallback={
                <>
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4 mb-4">
                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                            <Skeleton height={40} borderRadius={6} />
                        </SkeletonTheme>
                    </div>
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                            <div className="space-y-4">
                                <Skeleton height={200} borderRadius={6} />
                                <Skeleton height={200} borderRadius={6} />
                            </div>
                        </SkeletonTheme>
                    </div>
                </>
            }
        >
            <JugadorPartidosPageContent />
        </Suspense>
    );
}
