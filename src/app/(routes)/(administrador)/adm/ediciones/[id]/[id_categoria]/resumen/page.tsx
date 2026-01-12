import { Suspense } from 'react';
import CategoriaResumenPageContent from './CategoriaResumenPageContent';
import { CategoriaResumenHeader } from "@/app/components/categoria/CategoriaResumenHeader";
import { CategoriaResumenSkeleton } from "@/app/components/skeletons/CategoriaResumenSkeleton";

export default function CategoriaResumenPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <CategoriaResumenHeader
          nombreCategoria="Cargando..."
          isPublicada={false}
          onTogglePublicada={() => {}}
          isUpdating={false}
        />
        <CategoriaResumenSkeleton />
      </div>
    }>
      <CategoriaResumenPageContent />
    </Suspense>
  );
}