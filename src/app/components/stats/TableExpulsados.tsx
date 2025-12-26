import { Expulsado } from '@/app/types/jugador';
import { Shield, UserX, AlertTriangle } from 'lucide-react';

export const EXPULSADOS_MOCK = [
    {
        id_expulsion: 1,
        nombre_jugador: "Pedro Gonzalez",
        id_equipo: 1,
        nombre_equipo: "Club Atlético Belgrano",
        img_equipo: "belgrano.png",
        fechas_sancion: 3,
        fechas_restantes: 1,
        motivo: "Doble amarilla"
    },
    {
        id_expulsion: 2,
        nombre_jugador: "Andres Lopez",
        id_equipo: 2,
        nombre_equipo: "Talleres de Córdoba",
        img_equipo: "talleres.png",
        fechas_sancion: 2,
        fechas_restantes: 0,
        motivo: "Conducta antideportiva"
    },
    {
        id_expulsion: 3,
        nombre_jugador: "Roberto Morales",
        id_equipo: 3,
        nombre_equipo: "Instituto ACC",
        img_equipo: "instituto.png",
        fechas_sancion: 4,
        fechas_restantes: 2,
        motivo: "Agresión al rival"
    },
];

interface TablaExpulsadosProps {
    expulsados: Expulsado[];
}

const TablaExpulsados = ({ expulsados }: TablaExpulsadosProps) => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
            <div className="p-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-semibold text-lg flex items-center gap-2">
                    <UserX className="w-5 h-5 text-[var(--red)]" />
                    Jugadores sancionados
                </h3>
            </div>

            {expulsados.length === 0 ? (
                <div className="p-8 text-center">
                    <UserX className="w-12 h-12 text-[var(--gray-200)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--gray-200)] text-sm">
                        No hay jugadores sancionados
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Jugador</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Fechas / Restantes</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-200)] uppercase tracking-wider">Motivo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {expulsados.map((expulsado) => (
                                <tr key={expulsado.id_expulsion} className="hover:bg-[var(--gray-300)] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[var(--white)] font-medium">
                                                    {expulsado.jugador.nombre} {expulsado.jugador.apellido}
                                                </span>
                                                <span className="text-xs text-[var(--gray-100)]">
                                                    {expulsado.equipo.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-[var(--white)] font-bold">
                                                {expulsado.sancion.fechas}
                                            </span>
                                            <span className="text-[var(--gray-100)]">/</span>
                                            <span className={`font-bold ${expulsado.sancion.fechas_restantes > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'
                                                }`}>
                                                {expulsado.sancion.fechas_restantes}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-[var(--red)]" />
                                            <span className="text-[var(--gray-100)] text-sm">
                                                {expulsado.sancion.motivo}
                                            </span>
                                        </div>
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

export default TablaExpulsados;