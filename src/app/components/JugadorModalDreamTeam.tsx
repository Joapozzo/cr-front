'use client';

import { Shield, Star } from "lucide-react";
import { JugadorDestacadoDt } from "../types/jugador";
import { ImagenPublica } from "./common/ImagenPublica";

interface JugadorModalDreamTeamProps {
    jugador: JugadorDestacadoDt;
    jugadorSeleccionado: number | null;
    handleSeleccionarJugador: (jugador: JugadorDestacadoDt) => void;
}

const JugadorModalDreamTeam = ({ jugador, jugadorSeleccionado, handleSeleccionarJugador }: JugadorModalDreamTeamProps) => {
    return (
        <button
            key={jugador.id_jugador}
            onClick={() => handleSeleccionarJugador(jugador)}
            className={`relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${jugadorSeleccionado === jugador.id_jugador
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--gray-300)] bg-[var(--gray-300)] hover:border-[var(--gray-200)]'
                }`}
        >
            {/* Badge de seleccionado */}
            {jugadorSeleccionado === jugador.id_jugador && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                </div>
            )}

            {/* Header de la card */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full border-2 border-[var(--gray-200)] overflow-hidden bg-[var(--gray-400)] flex-shrink-0">
                    <ImagenPublica src={jugador.img} alt={`${jugador.nombre} ${jugador.apellido}`} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                {/* Info del jugador */}
                <div className="flex-1 text-left">
                    <h3 className="text-[var(--white)] font-semibold text-base leading-tight">
                        {jugador.nombre}
                    </h3>
                    <p className="text-[var(--white)] font-bold text-lg leading-tight">
                        {jugador.apellido}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full font-medium">
                            #{jugador.dorsal}
                        </span>
                        <span className="text-xs text-[var(--gray-100)]">
                            {jugador.posicion?.codigo}
                        </span>
                    </div>
                </div>
            </div>

            {/* Equipo */}
            <div className="flex items-center gap-2 mb-3 p-2 bg-[var(--gray-400)] rounded-lg">
                <div className="w-6 h-6 rounded bg-[var(--gray-300)] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                </div>
                <span className="text-sm text-[var(--gray-100)] truncate">
                    {jugador.equipo.nombre}
                </span>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-[var(--gray-400)] rounded-lg">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                        {jugador.estadisticas.goles}
                    </p>
                    <p className="text-xs text-[var(--gray-100)]">Goles</p>
                </div>
                <div className="text-center p-2 bg-[var(--gray-400)] rounded-lg">
                    <p className="text-2xl font-bold text-[var(--import)]">
                        {jugador.estadisticas.asistencias}
                    </p>
                    <p className="text-xs text-[var(--gray-100)]">Asist.</p>
                </div>
                <div className="text-center p-2 bg-[var(--gray-400)] rounded-lg">
                    <p className="text-2xl font-bold text-[var(--white)]">
                        {jugador.estadisticas.minutos_jugados}&apos;
                    </p>
                    <p className="text-xs text-[var(--gray-100)]">Min.</p>
                </div>
            </div>

            {/* Badges */}
            {/* <div className="flex items-center gap-2 mt-3 flex-wrap">
                {jugador.estadisticas.titular && (
                    <span className="text-xs px-2 py-0.5 bg-[var(--blue)]/20 text-[var(--blue)] rounded-full">
                        Titular
                    </span>
                )}
            </div> */}
        </button>
    )
}

export default JugadorModalDreamTeam;