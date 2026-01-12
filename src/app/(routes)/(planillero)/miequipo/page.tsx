import { Suspense } from 'react';
import MiEquipoPageContent from './MiEquipoPageContent';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';

export default function MiEquipoPage() {
  return (
    <Suspense fallback={<BaseCardTableSkeleton columns={3} rows={4} hasAvatar={false} />}>
      <MiEquipoPageContent />
    </Suspense>
  );
}
