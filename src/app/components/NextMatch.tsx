import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imagenFallBack, URI_IMG } from './ui/utils';
import { formatearFecha, formatearHora } from '../utils/formated';
import { LandPlot } from 'lucide-react';
import { Partido } from '../types/partido';

interface TimeLeft {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

// interface Equipo {
//     id: number;
//     nombre: string;
//     img?: string;
// }

interface NextMatchProps {
    partido?: Partido;
    miEquipo?: number;
    nombreEquipo?: string;
}

export const NextMatch: React.FC<NextMatchProps> = ({
    partido,
    miEquipo,
    nombreEquipo,
}) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
    });

    useEffect(() => {
        if (!partido?.dia || !partido?.hora) return;

        const calcularTiempoRestante = () => {
            try {
                const horaFormateada = partido.hora.includes(':') ? partido.hora : `00:${partido.hora}:00`;
                const soloFecha = partido.dia.split("T")[0];
                const fechaHoraPartido = new Date(`${soloFecha}T${horaFormateada}Z`);
                const ahora = new Date();
                const horaLocal = new Date(fechaHoraPartido.getTime() + fechaHoraPartido.getTimezoneOffset() * 60000);
                const diferencia = horaLocal.getTime() - ahora.getTime();

                if (diferencia > 0) {
                    setTimeLeft({
                        dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
                        horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
                        minutos: Math.floor((diferencia / (1000 * 60)) % 60),
                        segundos: Math.floor((diferencia / 1000) % 60),
                    });
                } else {
                    setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
                }
            } catch (error) {
                console.error("Error al calcular tiempo restante:", error);
            }
        };

        const timer = setInterval(calcularTiempoRestante, 1000);
        return () => clearInterval(timer);
    }, [partido?.dia, partido?.hora]);

    if (!partido) {
        return (
            <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-white font-bold">{nombreEquipo}</span>
                        <span className="text-[var(--black-300)]">| Próximo partido</span>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <p className="text-[var(--black-400)]">No hay próximos partidos programados</p>
                </div>
            </div>
        );
    }

    const esEquipoLocal = miEquipo === partido.id_equipolocal;
    const equipoSeleccionado = esEquipoLocal ? partido.equipoLocal : partido.equipoVisita;
    const equipoRival = esEquipoLocal ? partido.equipoVisita : partido.equipoLocal;

    const imagenEquipo = equipoSeleccionado?.img
        ? `${URI_IMG}${equipoSeleccionado.img}`
        : imagenFallBack;

    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="flex items-center gap-2 text-sm">
                    <Image
                        src={imagenEquipo}
                        width={30}
                        height={40}
                        alt={equipoSeleccionado?.nombre || "Equipo"}
                        className=""
                    />
                    <span className="text-white font-bold">{nombreEquipo}</span>
                    <span className="text-[var(--black-300)]">| Próximo partido</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="px-6 py-6">
                {/* Info principal */}
                <div className="flex w-full items-start gap-4 mb-6">
                    <Image
                        src={URI_IMG + equipoRival?.img}
                        width={80}
                        height={64}
                        alt={equipoRival?.nombre || "Equipo rival"}
                        className="object-cover"
                    />

                    <div className="flex flex-col flex-1">
                        {/* Fecha y jornada */}
                        <div className="text-[var(--black-400)] text-xs uppercase font-black">
                            {formatearFecha(partido.dia)} - {partido.hora === "00:00:00" || !partido.hora ? 'a conf.' : formatearHora(partido.hora)}
                        </div>
                        <div className="text-[var(--black-400)] text-xs uppercase">
                            Fecha {partido.jornada}
                        </div>

                        {/* Equipos */}
                        <div className="mt-3 flex flex-col uppercase">
                            <Link
                                href={`/equipo/${partido.equipoLocal.id_equipo}`}
                                className={`text-2xl font-semibold ${miEquipo === partido.id_equipolocal
                                    ? "text-[var(--green)]"
                                    : "text-white"
                                    } hover:underline hover:underline-offset-4 hover:decoration-current`}
                            >
                                {partido.equipoLocal.nombre}
                            </Link>

                            <Link
                                href={`/equipo/${partido.equipoVisita.id_equipo}`}
                                className={`text-2xl font-semibold ${miEquipo === partido.id_equipovisita
                                    ? "text-[var(--green)]"
                                    : "text-white"
                                    } hover:underline hover:underline-offset-4 hover:decoration-current`}
                            >
                                {partido.equipoVisita.nombre}
                            </Link>
                        </div>
                    </div>

                    {/* Cancha */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <LandPlot className="text-[var(--green)] text-3xl mb-1" />
                        <span className="text-xs uppercase">
                            {typeof partido.cancha === 'object' && partido.cancha !== null
                                ? (partido.cancha as any).nombre || 'a conf.'
                                : partido.cancha || 'a conf.'}
                        </span>
                    </div>
                </div>

                {/* Divisor */}
                <div className="w-full h-px bg-[var(--black-800)] mb-6"></div>

                {/* Cuenta regresiva */}
                <div className="flex justify-center items-center gap-8 md:gap-6">
                    <div className={`flex flex-col items-center ${timeLeft.dias === 0 ? 'text-[var(--black-500)]' : 'text-white'}`}>
                        <p className="text-3xl md:text-2xl font-semibold">{timeLeft.dias}</p>
                        <span className="text-xs uppercase">días</span>
                    </div>
                    <div className="text-xl font-semibold text-white">:</div>

                    <div className={`flex flex-col items-center ${timeLeft.horas === 0 && timeLeft.dias === 0 ? 'text-[var(--black-500)]' : 'text-white'
                        }`}>
                        <p className="text-3xl md:text-2xl font-semibold">{timeLeft.horas}</p>
                        <span className="text-xs uppercase">hrs</span>
                    </div>
                    <div className="text-xl font-semibold text-white">:</div>

                    <div className={`flex flex-col items-center ${timeLeft.horas === 0 && timeLeft.dias === 0 && timeLeft.minutos === 0 ? 'text-[var(--black-500)]' : 'text-white'
                        }`}>
                        <p className="text-3xl md:text-2xl font-semibold">{timeLeft.minutos}</p>
                        <span className="text-xs uppercase">mins</span>
                    </div>
                    <div className="text-xl font-semibold text-white">:</div>

                    <div className={`flex flex-col items-center ${timeLeft.horas === 0 && timeLeft.dias === 0 && timeLeft.minutos === 0 && timeLeft.segundos === 0
                        ? 'text-[var(--black-500)]' : 'text-white'
                        }`}>
                        <p className="text-3xl md:text-2xl font-semibold">{timeLeft.segundos}</p>
                        <span className="text-xs uppercase">segs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};