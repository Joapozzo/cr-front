import { EstadisticasCategoriaEdicion } from "@/app/types/categoria";

interface ResumenCategoriaProps { 
    estadisticas: EstadisticasCategoriaEdicion;
}

const ResumenCategoria = ({ estadisticas }: ResumenCategoriaProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vacantes */}
            <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--white)]">VACANTES</h3>
                    <div className="w-3 h-3 bg-[var(--green)] rounded-full"></div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-2xl font-bold text-[var(--white)]">{estadisticas.vacantes?.total}</span>
                        <span className="text-sm text-[var(--gray-100)]">Total</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xl text-[var(--green)]">{estadisticas.vacantes?.ocupadas}</span>
                        <span className="text-sm text-[var(--gray-100)]">Ocupadas</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xl text-[var(--orange)]">{estadisticas.vacantes?.sin_ocupar}</span>
                        <span className="text-sm text-[var(--gray-100)]">Sin ocupar</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--gray-300)]">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--gray-100)]">Ocupación</span>
                            <span className="text-lg font-bold text-[var(--green)]">{estadisticas.vacantes?.porcentaje_ocupado}%</span>
                        </div>
                        <div className="w-full bg-[var(--gray-300)] rounded-full h-2 mt-2">
                            <div
                                className="bg-[var(--green)] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${estadisticas.vacantes?.porcentaje_ocupado}%` }}
                            ></div>
                        </div>
                    </div>
                    {estadisticas.vacantes?.sin_ocupar > 0 && (
                        <div className="flex items-center text-[var(--orange)] mt-3 pt-3 border-t border-[var(--gray-300)]">
                            <span className="text-2xl font-bold mr-2">!</span>
                            <span className="text-sm">{estadisticas.mensaje.replace('⚠️ ', '')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Equipos */}
            <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--white)]">EQUIPOS</h3>
                    <div className="w-3 h-3 bg-[var(--green)] rounded-full"></div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-2xl font-bold text-[var(--white)]">{estadisticas.equipos.total}</span>
                        <span className="text-sm text-[var(--gray-100)]">Total</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xl text-[var(--white)]">{estadisticas.equipos.sin_vacante}</span>
                        <span className="text-sm text-[var(--gray-100)]">Sin vacante</span>
                    </div>
                    <div className="mt-4">
                        <a href="#" className="text-[var(--green)] text-sm hover:text-[var(--green-win)] transition-colors">
                            Ir a equipos
                        </a>
                    </div>
                </div>
            </div>

            {/* Jugadores */}
            <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--white)]">JUGADORES</h3>
                    <div className="w-3 h-3 bg-[var(--green)] rounded-full"></div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-2xl font-bold text-[var(--white)]">{estadisticas.jugadores.total}</span>
                        <span className="text-sm text-[var(--gray-100)]">Total</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumenCategoria;