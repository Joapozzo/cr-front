import { Suspense } from 'react';
import PartidoPageUsuarioContent from './PartidoPageUsuarioContent';
import BackButton from '@/app/components/ui/BackButton';
import {
  CardPartidoHeaderFallback,
  JugadoresTabsUnifiedFallback,
} from '@/app/components/partido/partidoFallbacks';

export default function PartidoPageUsuario() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-3 sm:p-4 flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full overflow-x-hidden">
        <BackButton />
        <CardPartidoHeaderFallback />
        <JugadoresTabsUnifiedFallback />
      </div>
    }>
      <PartidoPageUsuarioContent />
    </Suspense>
  );
}

