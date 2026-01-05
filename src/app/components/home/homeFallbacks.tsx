import { BaseCard, CardHeader } from "@/app/components/BaseCard";
import { BaseCardTableSkeleton } from "@/app/components/skeletons/BaseCardTableSkeleton";
import MatchCardSkeleton from "@/app/components/skeletons/CardPartidoGenericoSkeleton";
import { NoticiaCardSkeleton2 } from "@/app/components/skeletons/NoticiaCardSkeleton";
import { Calendar, Shield, AlertTriangle, Newspaper, Trophy } from "lucide-react";

export const PartidosEquipoCardFallback = () => (
  <BaseCard>
    <CardHeader
      icon={<Calendar size={18} className="text-[var(--green)]" />}
      title="Mis partidos"
      subtitle="Cargando..."
    />
    <MatchCardSkeleton />
    <MatchCardSkeleton />
  </BaseCard>
);

export const TablaPosicionesHomeFallback = () => (
  <BaseCard>
    <CardHeader
      icon={<Trophy size={18} className="text-[var(--green)]" />}
      title="Tabla de posiciones"
      subtitle="Cargando..."
    />
    <div className="p-4">
      <BaseCardTableSkeleton
        columns={4}
        rows={6}
        hasAvatar={false}
      />
    </div>
  </BaseCard>
);

export const SancionesHomeFallback = () => (
  <BaseCard>
    <CardHeader
      icon={<AlertTriangle size={18} className="text-yellow-500" />}
      title="Sanciones activas"
      subtitle="Cargando..."
    />
    <div className="p-4">
      <BaseCardTableSkeleton
        columns={4}
        rows={5}
        hasAvatar={true}
      />
    </div>
  </BaseCard>
);

export const NoticiasHomeFallback = () => (
  <BaseCard>
    <CardHeader
      icon={<Newspaper size={18} className="text-[var(--green)]" />}
      title="Noticias"
      subtitle="Cargando..."
    />
    <div className="px-4 py-4">
      <NoticiaCardSkeleton2 />
    </div>
  </BaseCard>
);

export const UnirseEquipoCardFallback = () => (
  <div className="relative bg-gradient-to-br from-[var(--gray-500)] via-[var(--gray-400)] to-[var(--gray-500)] rounded-2xl overflow-hidden border border-[var(--gray-400)] p-6 md:p-8">
    <div className="flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 bg-[#262626] rounded-full animate-pulse" />
      <div className="space-y-2 w-full max-w-md">
        <div className="h-6 bg-[#262626] rounded w-3/4 mx-auto animate-pulse" />
        <div className="h-4 bg-[#262626] rounded w-full animate-pulse" />
      </div>
      <div className="h-12 bg-[#262626] rounded-lg w-full max-w-xs animate-pulse" />
    </div>
  </div>
);

