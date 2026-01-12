import { Suspense } from 'react';
import EquipoPageContent from './EquipoPageContent';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';

export default function EquipoPage() {
  return (
    <Suspense fallback={
      <UserPageWrapper>
        <div className="space-y-6">
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--black-800)] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-[var(--black-800)] rounded animate-pulse w-48" />
                <div className="h-4 bg-[var(--black-800)] rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
          <BaseCardTableSkeleton columns={3} rows={4} hasAvatar={false} />
        </div>
      </UserPageWrapper>
    }>
      <EquipoPageContent />
    </Suspense>
  );
}

