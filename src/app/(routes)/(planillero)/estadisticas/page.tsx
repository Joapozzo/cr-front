import { Suspense } from 'react';
import EstadisticasPageContent from '../../../components/estadisticas/EstadisticasPageContent';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';

export default function EstadisticasPage() {
  return (
    <Suspense fallback={<BaseCardTableSkeleton columns={5} rows={6} hasAvatar={false} />}>
      <EstadisticasPageContent />
    </Suspense>
  );
}
