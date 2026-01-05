import { motion } from 'framer-motion';
import { AlertCircle, Flag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ZonaSinTerminar } from '@/app/types/admin.types';
import { DataCard } from '@/app/components/admin/dashboard/base/DataCard';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';

interface ZonasSinTerminarSectionProps {
    data: ZonaSinTerminar[] | null;
    loading: boolean;
    error: Error | null;
}

export const ZonasSinTerminarSection: React.FC<ZonasSinTerminarSectionProps> = ({ data, loading, error }) => {
    return (
        <DataCard
            title="Zonas sin terminar"
            icon={Flag}
            loading={loading}
            error={error}
            emptyMessage="Todas las zonas están al día"
            className="h-full"
        >
            <div className="space-y-3 p-4">
                {data?.map((zona) => {
                    const params = {
                        percent: zona.partidos_totales > 0
                            ? Math.round((zona.partidos_finalizados / zona.partidos_totales) * 100)
                            : 0
                    };

                    return (
                        <Link
                            key={zona.id_zona}
                            href={`/adm/ediciones/${zona.id_edicion}/${zona.id_categoria_edicion}/formato`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                transition={{ duration: 0.3 }}
                                className="bg-[var(--black-800)]/40 rounded-lg p-3 border border-transparent hover:border-[var(--green)]/30 transition-all cursor-pointer"
                            >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-white">{zona.nombre_zona || 'Zona General'}</h4>
                                    <p className="text-xs text-[#737373] mt-0.5">{zona.nombre_categoria_completo}</p>
                                </div>
                                <Badge variant={params.percent > 90 ? 'success' : params.percent > 50 ? 'warning' : 'neutral'}>
                                    {params.percent}%
                                </Badge>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-[#a3a3a3]">
                                    <span>Progreso</span>
                                    <span>{zona.partidos_finalizados} / {zona.partidos_totales} partidos</span>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--black-600)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${params.percent}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${params.percent > 90 ? 'bg-[var(--green)]' :
                                                params.percent > 50 ? 'bg-[var(--yellow-500)]' : 'bg-[var(--blue-500)]'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs text-[#666]">
                                <div className="flex items-center gap-2">
                                    <span>Fase {zona.fase}</span>
                                    <span>•</span>
                                    <span>{zona.etapa}</span>
                                </div>
                                <div>{zona.cantidad_equipos} Equipos</div>
                            </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </DataCard>
    );
};
