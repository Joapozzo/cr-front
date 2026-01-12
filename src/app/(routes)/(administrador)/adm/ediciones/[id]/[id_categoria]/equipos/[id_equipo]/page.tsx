import { Suspense } from 'react';
import EquipoPlantelContent from './EquipoPlantelContent';
import EquipoHeaderSkeleton from '@/app/components/equipo/skeletons/EquipoHeaderSkeleton';
import EquipoStatsSkeleton from '@/app/components/equipo/skeletons/EquipoStatsSkeleton';
import CapitanesSkeleton from '@/app/components/equipo/skeletons/CapitanesSkeleton';
import SolicitudesSkeleton from '@/app/components/equipo/skeletons/SolicitudesSkeleton';
import PlantelSkeleton from '@/app/components/equipo/skeletons/PlantelSkeleton';

export default function EquipoPlantelPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <EquipoHeaderSkeleton />
                    <EquipoStatsSkeleton />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CapitanesSkeleton />
                        <SolicitudesSkeleton />
                    </div>
                    <PlantelSkeleton />
                </div>
            }
        >
            <EquipoPlantelContent />
        </Suspense>
    );
}