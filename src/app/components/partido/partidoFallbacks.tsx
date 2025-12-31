import { CardPartidoResultSkeleton } from '../skeletons/CardPartidoSkeleton';
import FormacionesCardSkeleton from '../skeletons/FormacionesCardSkeleton';
import CaraCaraSkeleton from '../skeletons/CaraCaraSkeleton';
import UltimosPartidosEquiposSkeleton from '../skeletons/UltimosPartidosEquipos';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CardPartidoHeaderFallback = () => (
  <CardPartidoResultSkeleton />
);

export const JugadoresTabsUnifiedFallback = () => (
  <FormacionesCardSkeleton />
);

export const CaraACaraTabFallback = () => (
  <CaraCaraSkeleton />
);

export const PreviaTabFallback = () => (
  <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
    <div className="py-4 space-y-4 sm:space-y-6">
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 flex w-full items-center justify-between gap-4">
        <UltimosPartidosEquiposSkeleton />
        <UltimosPartidosEquiposSkeleton />
      </div>
    </div>
  </SkeletonTheme>
);

