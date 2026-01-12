import { Suspense } from "react";
import PartidoPagePlanilleroContent from './PartidoPagePlanilleroContent';
import BackButton from "@/app/components/ui/BackButton";

export default function PartidoPagePlanillero() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        <BackButton />
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#262626] rounded w-3/4 mx-auto" />
            <div className="h-4 bg-[#262626] rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <PartidoPagePlanilleroContent />
    </Suspense>
  );
}