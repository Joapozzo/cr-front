import { Volleyball } from 'lucide-react';
import { Goleador } from '@/app/types/jugador';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';

interface GoleadoresProps {
    goleadores: Goleador[];
}

const TablaGoleadores = ({ goleadores }: GoleadoresProps) => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
            <div className="p-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-semibold text-lg flex items-center gap-2">
                    <Volleyball className="w-5 h-5 text-[var(--color-primary)]" />
                    Tabla de goleadores
                </h3>
            </div>

            {goleadores.length === 0 ? (
                <div className="p-8 text-center">
                    <Volleyball className="w-12 h-12 text-[var(--gray-200)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--gray-200)] text-sm">
                        No hay goleadores registrados
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Jugador</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Goles</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Partidos</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Promedio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {goleadores.map((goleador) => (
                                <tr key={goleador.jugador.id_jugador} className="hover:bg-[var(--gray-300)] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                <ImagenPublica
                                                    src={goleador.jugador.img}
                                                    alt={`${goleador.jugador.nombre} ${goleador.jugador.apellido}`}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[var(--white)] font-medium">
                                                    {goleador.jugador.nombre} {goleador.jugador.apellido}
                                                </span>
                                                <span className="text-xs text-[var(--gray-100)]">
                                                    {goleador.equipo.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-[var(--color-primary)] font-bold text-lg">
                                            {goleador.stats.goles}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                        {goleador.stats.partidos}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                        {goleador.stats.promedio}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TablaGoleadores;