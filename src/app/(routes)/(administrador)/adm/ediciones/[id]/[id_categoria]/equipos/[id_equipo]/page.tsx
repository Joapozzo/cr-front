'use client';

import { Suspense } from 'react';
import EquipoPlantelClient from '@/app/components/equipo/EquipoPlantelClient';

// Componente principal que envuelve en Suspense
export default function EquipoPlantelPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--gray-300)] rounded w-1/3" />
            <div className="h-4 bg-[var(--gray-300)] rounded w-1/2" />
          </div>
        </div>
      </div>
    }>
      <EquipoPlantelClient />
    </Suspense>
  );
}