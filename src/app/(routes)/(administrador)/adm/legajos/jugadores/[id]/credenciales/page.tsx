import { Suspense } from 'react';
import JugadorCredencialesPageContent from './JugadorCredencialesPageContent';
import { CredencialesListSkeleton } from '@/app/components/skeletons/CredencialSkeleton';

export default function JugadorCredencialesPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <CredencialesListSkeleton count={1} />
                </div>
            }
        >
            <JugadorCredencialesPageContent />
        </Suspense>
    );
}
