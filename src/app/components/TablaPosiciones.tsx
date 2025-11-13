import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface IEquipoPosicion {
    posicion: number;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string | null;
    puntos: number;
    partidos_jugados: number;
    partidos_ganados: number;
    partidos_empatados: number;
    partidos_perdidos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
}

interface StandingsTableProps {
    id_categoria_edicion: number;
    id_zona?: number;
}

// Data estática de ejemplo
const posicionesEjemplo: IEquipoPosicion[] = [
    {
        posicion: 1,
        id_equipo: 1,
        nombre_equipo: 'Los Halcones FC',
        img_equipo: null,
        puntos: 38,
        partidos_jugados: 14,
        partidos_ganados: 12,
        partidos_empatados: 2,
        partidos_perdidos: 0,
        goles_favor: 45,
        goles_contra: 12,
        diferencia_goles: 33
    },
    {
        posicion: 2,
        id_equipo: 2,
        nombre_equipo: 'Deportivo Central',
        img_equipo: null,
        puntos: 32,
        partidos_jugados: 14,
        partidos_ganados: 10,
        partidos_empatados: 2,
        partidos_perdidos: 2,
        goles_favor: 38,
        goles_contra: 18,
        diferencia_goles: 20
    },
    {
        posicion: 3,
        id_equipo: 3,
        nombre_equipo: 'Racing United',
        img_equipo: null,
        puntos: 28,
        partidos_jugados: 14,
        partidos_ganados: 9,
        partidos_empatados: 1,
        partidos_perdidos: 4,
        goles_favor: 32,
        goles_contra: 22,
        diferencia_goles: 10
    },
    {
        posicion: 4,
        id_equipo: 4,
        nombre_equipo: 'Atlético Sur',
        img_equipo: null,
        puntos: 25,
        partidos_jugados: 14,
        partidos_ganados: 8,
        partidos_empatados: 1,
        partidos_perdidos: 5,
        goles_favor: 28,
        goles_contra: 25,
        diferencia_goles: 3
    },
    {
        posicion: 5,
        id_equipo: 5,
        nombre_equipo: 'Club Estrella',
        img_equipo: null,
        puntos: 22,
        partidos_jugados: 14,
        partidos_ganados: 7,
        partidos_empatados: 1,
        partidos_perdidos: 6,
        goles_favor: 25,
        goles_contra: 26,
        diferencia_goles: -1
    },
    {
        posicion: 6,
        id_equipo: 6,
        nombre_equipo: 'Sporting Villa',
        img_equipo: null,
        puntos: 18,
        partidos_jugados: 14,
        partidos_ganados: 5,
        partidos_empatados: 3,
        partidos_perdidos: 6,
        goles_favor: 22,
        goles_contra: 28,
        diferencia_goles: -6
    },
    {
        posicion: 7,
        id_equipo: 7,
        nombre_equipo: 'Unión Barrio',
        img_equipo: null,
        puntos: 15,
        partidos_jugados: 14,
        partidos_ganados: 4,
        partidos_empatados: 3,
        partidos_perdidos: 7,
        goles_favor: 18,
        goles_contra: 30,
        diferencia_goles: -12
    },
    {
        posicion: 8,
        id_equipo: 8,
        nombre_equipo: 'FC Municipal',
        img_equipo: null,
        puntos: 8,
        partidos_jugados: 14,
        partidos_ganados: 2,
        partidos_empatados: 2,
        partidos_perdidos: 10,
        goles_favor: 12,
        goles_contra: 38,
        diferencia_goles: -26
    }
];

const getPosicionColor = (posicion: number) => {
    if (posicion <= 2) return 'border-l-4 border-l-green-500';
    if (posicion >= 7) return 'border-l-4 border-l-red-500';
    return '';
};

export default function StandingsTable({ id_categoria_edicion, id_zona }: StandingsTableProps) {
    return (
        <div className="space-y-4 h-full">
            <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden h-full">
                {/* Tabla */}
                <div className="overflow-x-auto h-full">
                    <table className="w-full">
                        <thead className="bg-[#0a0a0a] border-b border-[#262626]">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    #
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    Equipo
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    Pts
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    PJ
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    PG
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    PE
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    PP
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    GF
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    GC
                                </th>
                                <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    DG
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#262626]">
                            {posicionesEjemplo.map((equipo) => (
                                <tr
                                    key={equipo.id_equipo}
                                    className={`hover:bg-[#0a0a0a] transition-colors ${getPosicionColor(equipo.posicion)}`}
                                >
                                    <td className="py-3 px-4 text-white text-sm font-bold">
                                        {equipo.posicion}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="text-[#737373]" size={16} />
                                            </div>
                                            <span className="text-white text-sm font-medium truncate">
                                                {equipo.nombre_equipo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center py-3 px-2">
                                        <span className="text-white text-sm font-bold">
                                            {equipo.puntos}
                                        </span>
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.partidos_jugados}
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.partidos_ganados}
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.partidos_empatados}
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.partidos_perdidos}
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.goles_favor}
                                    </td>
                                    <td className="text-center py-3 px-2 text-white text-sm">
                                        {equipo.goles_contra}
                                    </td>
                                    <td className="text-center py-3 px-2">
                                        <span className={`text-sm font-medium ${equipo.diferencia_goles > 0
                                                ? 'text-green-400'
                                                : equipo.diferencia_goles < 0
                                                    ? 'text-red-400'
                                                    : 'text-gray-400'
                                            }`}>
                                            {equipo.diferencia_goles > 0 ? '+' : ''}
                                            {equipo.diferencia_goles}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {posicionesEjemplo.length === 0 && (
                    <div className="py-12 text-center text-[#737373]">
                        No hay posiciones disponibles
                    </div>
                )}
            </div>

            {/* Leyenda */}
            {/* <div className="flex items-center justify-center gap-6 text-xs text-[#737373]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Clasifican</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Descienden</span>
                </div>
            </div> */}
        </div>
    );
}