import { Shield, Volleyball } from 'lucide-react';
import { Goleador } from '@/app/types/jugador';

interface GoleadoresProps {
    goleadores: Goleador[];
}

const TablaGoleadores = ({ goleadores }: GoleadoresProps) => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
            <div className="p-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-semibold text-lg flex items-center gap-2">
                    <Volleyball className="w-5 h-5 text-[var(--green)]" />
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
                            {goleadores.map((jugador) => (
                                <tr key={jugador.jugador.id_jugador} className="hover:bg-[var(--gray-300)] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[var(--white)] font-medium">
                                                    {jugador.jugador.nombre} {jugador.jugador.apellido}
                                                </span>
                                                <span className="text-xs text-[var(--gray-100)]">
                                                    {jugador.equipo.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-[var(--green)] font-bold text-lg">
                                            {jugador.stats.goles}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                        {jugador.stats.partidos}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--gray-100)]">
                                        {jugador.stats.promedio}
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