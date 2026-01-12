import { Suspense } from 'react';
import CategoriaFormatoPageContent from './CategoriaFormatoPageContent';
import { CategoriaFormatoSkeleton } from '@/app/components/skeletons/CategoriaFormatoSkeleton';

export default function CategoriaFormatoPage() {
  return (
    <Suspense fallback={<CategoriaFormatoSkeleton />}>
      <CategoriaFormatoPageContent />
    </Suspense>
  );
}
