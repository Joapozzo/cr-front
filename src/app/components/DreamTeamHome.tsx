'use client';

import React, { useState, useEffect } from 'react';
import Select, { SelectOption } from './ui/Select';
import Image from 'next/image';
import { imagenFallBackUser, URI_IMG } from './ui/utils';
import { useEdicionesConCategorias } from '../hooks/useEdiciones';
import { useDreamteamCategoriaJornada } from '../hooks/useDreamteam';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DreamTeamSkeleton from './skeletons/DreamTeamSkeleton';
import { JugadorDreamTeam } from '../types/dreamteam';
import { EscudoEquipo } from './common/EscudoEquipo';

interface DreamTeamProps {
    className?: string;
}

export const DreamTeam: React.FC<DreamTeamProps> = ({
    className = ""
}) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | number>('');
    const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number>(1);
    const [jornadasDisponibles, setJornadasDisponibles] = useState<number[]>([]);

    // Obtener categorías disponibles
    const { data: edicionesConCategorias, isLoading: loadingCategorias } = useEdicionesConCategorias();

    // Obtener dreamteam de la categoría y jornada seleccionada
    const {
        data: dreamteam,
        isLoading: loadingDreamteam,
        error: errorDreamteam
    } = useDreamteamCategoriaJornada(
        Number(categoriaSeleccionada),
        jornadaSeleccionada,
        { enabled: !!categoriaSeleccionada && !!jornadaSeleccionada }
    );

    // Configurar categoría por defecto cuando cargan los datos
    useEffect(() => {
        if (edicionesConCategorias && edicionesConCategorias.length > 0 && !categoriaSeleccionada) {
            const primeraEdicion = edicionesConCategorias[0];
            if (primeraEdicion.categorias && primeraEdicion.categorias.length > 0) {
                setCategoriaSeleccionada(primeraEdicion.categorias[0].id_categoria_edicion);
            }
        }
    }, [edicionesConCategorias, categoriaSeleccionada]);

    // Generar jornadas disponibles (simulado por ahora)
    useEffect(() => {
        if (categoriaSeleccionada) {
            const jornadas = Array.from({ length: 10 }, (_, i) => i + 1);
            setJornadasDisponibles(jornadas);
            if (!jornadaSeleccionada || !jornadas.includes(jornadaSeleccionada)) {
                setJornadaSeleccionada(jornadas[0] || 1);
            }
        }
    }, [categoriaSeleccionada, jornadaSeleccionada]);

    // Generar opciones del select
    const opcionesCategorias: SelectOption[] = React.useMemo(() => {
        if (!edicionesConCategorias) return [];

        const opciones: SelectOption[] = [];
        edicionesConCategorias.forEach(edicion => {
            edicion.categorias?.forEach(categoria => {
                opciones.push({
                    value: categoria.id_categoria_edicion,
                    label: categoria.nombre
                });
            });
        });
        return opciones;
    }, [edicionesConCategorias]);

    if (loadingCategorias) {
        return <DreamTeamSkeleton />;
    }

    const handleCategoriaChange = (value: string | number) => {
        setCategoriaSeleccionada(value);
    };

    const handleJornadaAnterior = () => {
        const currentIndex = jornadasDisponibles.indexOf(jornadaSeleccionada);
        if (currentIndex > 0) {
            setJornadaSeleccionada(jornadasDisponibles[currentIndex - 1]);
        }
    };

    const handleJornadaSiguiente = () => {
        const currentIndex = jornadasDisponibles.indexOf(jornadaSeleccionada);
        if (currentIndex < jornadasDisponibles.length - 1) {
            setJornadaSeleccionada(jornadasDisponibles[currentIndex + 1]);
        }
    };

    // Función para organizar jugadores por formación como en tu sistema anterior
    const organizarJugadoresPorFormacion = (jugadores: JugadorDreamTeam[], formacion: string) => {
        let formacionArray: number[] = [];

        switch (formacion) {
            case '1-2-3-1':
                formacionArray = [1, 2, 3, 1];
                break;
            case '1-3-2-1':
                formacionArray = [1, 3, 2, 1];
                break;
            case '1-3-1-2':
                formacionArray = [1, 3, 1, 2];
                break;
            default:
                formacionArray = [1, 2, 3, 1];
        }

        // Organizar jugadores en filas según la formación
        const jugadoresPorFila: JugadorDreamTeam[][] = [];
        let startIndex = 0;

        formacionArray.forEach((cantidad) => {
            jugadoresPorFila.push(jugadores.slice(startIndex, startIndex + cantidad));
            startIndex += cantidad;
        });

        // Invertir para que el arquero quede abajo
        return jugadoresPorFila.reverse();
    };

    const renderJugador = (jugador: JugadorDreamTeam) => (
        <div key={jugador.id_jugador} className="flex flex-col items-center gap-1 text-center">
            {/* Logo Jugador con escudo del equipo */}
            <div className="relative flex">
                <Image
                    src={jugador.usuario?.img ? `${URI_IMG}${jugador.usuario.img}` : imagenFallBackUser}
                    alt={`${jugador.nombre} ${jugador.apellido}`}
                    width={33}
                    height={33}
                    className="rounded-full object-cover"
                />
                {/* Escudo del equipo */}
                {jugador.equipo?.img && (
                    <div className="absolute -bottom-2 -right-2">
                        <EscudoEquipo
                            src={jugador.equipo.img}
                            alt={jugador.equipo.nombre}
                            size={24}
                        />
                    </div>
                )}
            </div>

            {/* Nombre del jugador */}
            <span className="text-white text-xs font-medium max-w-[60px] leading-tight">
                {jugador.nombre} {jugador.apellido}
            </span>
        </div>
    );

    return (
        <div className={`bg-[var(--black-900)] rounded-2xl overflow-hidden ${className}`}>
            {/* Header con select de categorías */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--black-800)]">
                <div className="flex items-center gap-3 flex-col justify-center w-full">
                    <span className="text-white font-bold">Dream Team</span>
                    {opcionesCategorias.length > 0 && (
                        <Select
                            options={opcionesCategorias}
                            value={categoriaSeleccionada}
                            onChange={handleCategoriaChange}
                            bgColor='bg-[var(--black-800)]'
                            placeholder="Seleccionar categoría"
                        />
                    )}
                </div>
            </div>

            {/* Navegación entre jornadas */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--black-800)]">
                <button
                    onClick={handleJornadaAnterior}
                    disabled={jornadaSeleccionada === jornadasDisponibles[0]}
                    className="p-2 rounded-full hover:bg-[var(--black-800)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <div className="text-center">
                    <span className="text-white font-medium">Fecha {jornadaSeleccionada}</span>
                </div>

                <button
                    onClick={handleJornadaSiguiente}
                    disabled={jornadaSeleccionada === jornadasDisponibles[jornadasDisponibles.length - 1]}
                    className="p-2 rounded-full hover:bg-[var(--black-800)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Contenido del dreamteam */}
            {loadingDreamteam ? (
                <div className="px-6 py-8">
                    <DreamTeamSkeleton />
                </div>
            ) : errorDreamteam ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-red-400">Error al cargar el dream team</p>
                </div>
            ) : !dreamteam ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-[var(--black-400)]">No hay dream team para esta jornada</p>
                </div>
            ) : (
                /* DreamTeam Card Wrapper */
                <div className="flex flex-col items-center w-full text-white relative py-5 gap-5 min-h-[410px]">
                    {/* Formación */}
                    <div className="text-center mb-2 z-10">
                        <span className="text-[var(--green)] font-medium">{dreamteam.formacion}</span>
                    </div>

                    {/* Filas de jugadores */}
                    {organizarJugadoresPorFormacion(dreamteam.jugadores, dreamteam.formacion || '').map((fila, filaIndex) => (
                        <div key={filaIndex} className="flex w-full justify-around items-center gap-5 z-10">
                            {fila.map((jugador) => renderJugador(jugador))}
                        </div>
                    ))}

                    {/* SVG Background - Cancha de fútbol */}
                    <div className="absolute bottom-0 left-0 w-full px-[15%] overflow-hidden rotate-180 z-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 316 174" className="fill-[var(--black-700)] opacity-40">
                            <g id="Group_4486" data-name="Group 4486" transform="translate(84.168)">
                                <path
                                    id="Path_2174"
                                    d="M57 0h5.907v50.136a5.92 5.92 0 0 0 5.907 5.9H192.85a5.92 5.92 0 0 0 5.907-5.9V0h5.907v50.136a11.84 11.84 0 0 1-11.813 11.8H68.813A11.84 11.84 0 0 1 57 50.136z"
                                    data-name="Path 2174"
                                    transform="translate(-57)"
                                />
                            </g>
                            <path
                                id="Path_2175"
                                d="M11.813 150.407h90.813a76.778 76.778 0 0 0 110.748 0h90.813A11.839 11.839 0 0 0 316 138.61V0h-5.906v138.61a5.92 5.92 0 0 1-5.907 5.9H11.813a5.92 5.92 0 0 1-5.907-5.9V0H0v138.61a11.84 11.84 0 0 0 11.813 11.797zm193 0a70.761 70.761 0 0 1-93.619 0z"
                                data-name="Path 2175"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};