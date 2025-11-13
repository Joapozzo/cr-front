import { PosicionTabla } from '@/app/types/categoria';
import { Shield } from 'lucide-react';

interface TablaPosicionesProps {
    posiciones: PosicionTabla[];
    titulo?: string;
}

const TablaPosiciones = ({  posiciones }: TablaPosicionesProps) => {
    const getColorByPosition = (pos: number) => {
        if (pos <= 2) return 'var(--green)';
        if (pos <= 4) return 'orange';
        return 'var(--red)';
    };

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
            {/* <div className="p-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-semibold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[var(--green)]" />
                    Tabla de Posiciones
                </h3>
            </div> */}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Pos</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Equipo</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">PJ</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">G</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">E</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">P</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">GF</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">GC</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">DG</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--gray-300)]">
                        {posiciones.map((equipo) => (
                            <tr key={equipo.equipo.id_equipo} className="hover:bg-[var(--gray-300)] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <div
                                            className="w-1 h-6 rounded-r mr-3"
                                            style={{ backgroundColor: getColorByPosition(equipo.posicion) }}
                                        ></div>
                                        <span className="text-[var(--white)] font-semibold">
                                            {equipo.posicion}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                                        </div>
                                        <span className="text-[var(--white)] font-medium">
                                            {equipo.equipo.nombre}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.partidos_jugados}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.ganados}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.empatados}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.perdidos}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.goles_favor}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">{equipo.goles_contra}</td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <span className={equipo.diferencia_goles > 0 ? 'text-[var(--green)]' : equipo.diferencia_goles < 0 ? 'text-[var(--red)]' : 'text-[var(--gray-100)]'}>
                                        {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="text-[var(--white)] font-bold text-lg">
                                        {equipo.puntos}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leyenda */}
            <div className="px-4 py-3 bg-[var(--gray-400)] border-t border-[var(--gray-300)]">
                <div className="flex items-center gap-6 text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--green)' }}></div>
                        <span className="text-[var(--gray-100)]">Clasificación directa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: 'orange' }}></div>
                        <span className="text-[var(--gray-100)]">Playoffs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--red)' }}></div>
                        <span className="text-[var(--gray-100)]">Descenso</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaPosiciones;