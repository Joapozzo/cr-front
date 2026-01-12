import { Suspense } from 'react';
import CajaDetallePageContent from './CajaDetallePageContent';
import CajaDetalleSkeleton from '@/app/components/skeletons/CajaDetalleSkeleton';

export default function CajaDetallePage() {
  return (
    <Suspense fallback={<CajaDetalleSkeleton />}>
      <CajaDetallePageContent />
    </Suspense>
  );
}
