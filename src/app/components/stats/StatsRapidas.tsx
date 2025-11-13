import React from 'react';
import { Users, Swords, Check, CircleAlert, Ban } from 'lucide-react';

interface StatsData {
    cantidad_equipos: number;
    total_partidos: number;
    partidos_finalizados: number;
    partidos_pendientes: number;
    jugadores_sancionados: number;
}

interface EstadisticasRapidasProps {
    stats?: StatsData;
}

const EstadisticasRapidas: React.FC<EstadisticasRapidasProps> = ({ stats }) => {
    if (!stats) return null;

    const estadisticas = [
        {
            icon: Users,
            label: 'Equipos',
            value: stats.cantidad_equipos,
            bgColor: 'bg-[var(--green)]/20',
            iconColor: 'text-[var(--green)]',
        },
        {
            icon: Swords,
            label: 'Total partidos',
            value: stats.total_partidos,
            bgColor: 'bg-[var(--green)]/20',
            iconColor: 'text-[var(--green)]',
        },
        {
            icon: Check,
            label: 'Partidos finalizados',
            value: stats.partidos_finalizados,
            bgColor: 'bg-[var(--green)]/20',
            iconColor: 'text-[var(--green)]',
        },
        {
            icon: CircleAlert,
            label: 'Partidos pendientes',
            value: stats.partidos_pendientes,
            bgColor: 'bg-[var(--red)]/20',
            iconColor: 'text-[var(--red)]',
        },
        {
            icon: Ban,
            label: 'Jugadores sancionados',
            value: stats.jugadores_sancionados,
            bgColor: 'bg-[var(--red)]/20',
            iconColor: 'text-[var(--red)]',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {estadisticas.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-[var(--gray-100)] text-sm">{stat.label}</p>
                                <p className="text-[var(--white)] text-xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EstadisticasRapidas;