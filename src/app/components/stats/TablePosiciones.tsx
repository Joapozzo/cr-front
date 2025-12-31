import Link from 'next/link';
import { PosicionTabla } from '@/app/types/categoria';
import { FormatoPosicion } from '@/app/types/zonas';
import { FormatoPosicionBadge, FormatoPosicionLeyenda } from '../posiciones/FormatoPosicionBadge';
import { EscudoEquipo } from '../common/EscudoEquipo';

interface TablaPosicionesProps {
    posiciones: PosicionTabla[];
    titulo?: string;
    formatosPosicion?: FormatoPosicion[];
}

const TablaPosiciones = ({  posiciones, formatosPosicion = [] }: TablaPosicionesProps) => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
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
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Aperc.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--gray-300)]">
                        {posiciones.map((equipo) => (
                            <tr key={equipo.equipo.id_equipo} className="hover:bg-[var(--gray-300)] transition-colors">
                                <td className="px-4 py-3">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        <div className="flex items-center">
                                            <FormatoPosicionBadge
                                                posicion={equipo.posicion}
                                                formatosPosicion={formatosPosicion}
                                            />
                                            <span className="text-[var(--white)] font-semibold">
                                                {equipo.posicion}
                                            </span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-3">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        <div className="flex items-center gap-3">
                                            <EscudoEquipo
                                                src={equipo.equipo.img}
                                                alt={equipo.equipo.nombre}
                                                size={24}
                                                className="flex-shrink-0"
                                            />
                                            <span className="text-[var(--white)] font-medium">
                                                {equipo.equipo.nombre}
                                            </span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.partidos_jugados}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.ganados}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.empatados}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.perdidos}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.goles_favor}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        {equipo.goles_contra}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        <span className={equipo.diferencia_goles > 0 ? 'text-[var(--green)]' : equipo.diferencia_goles < 0 ? 'text-[var(--red)]' : 'text-[var(--gray-100)]'}>
                                            {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        <span className="text-[var(--white)] font-bold text-lg">
                                            {equipo.puntos_finales !== undefined ? equipo.puntos_finales : equipo.puntos}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Link href={`/equipos/${equipo.equipo.id_equipo}`} className="block">
                                        <span className={`text-sm font-medium ${equipo.apercibimientos && equipo.apercibimientos > 0 ? 'text-[var(--yellow)]' : 'text-[var(--gray-100)]'}`}>
                                            {equipo.apercibimientos || 0}
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leyenda */}
            <FormatoPosicionLeyenda 
                formatosPosicion={formatosPosicion}
                className="bg-[var(--gray-400)] border-[var(--gray-300)]"
            />
        </div>
    );
};

export default TablaPosiciones;