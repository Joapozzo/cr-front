'use client';

import React, { useState, useEffect } from 'react';
import Select, { SelectOption } from './ui/Select';
import Image from 'next/image';
import { imagenFallBack, URI_IMG } from './ui/utils';
import { useEdicionesConCategorias } from '../hooks/useEdiciones';
import { useTablasTodasLasZonas } from '../hooks/useTablas';
import TablaPosicionesContentSkeleton from './skeletons/TablePosicionesHomeSkeleton';
import TablaPosicionesHeaderSkeleton from './skeletons/TablaPosicionesHeaderSkeleton';

interface TablaPosicionesProps {
    className?: string;
}

export const TablaPosiciones: React.FC<TablaPosicionesProps> = ({
    className = ""
}) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | number>('');

    // Obtener categorías disponibles
    const { data: edicionesConCategorias, isLoading: loadingCategorias } = useEdicionesConCategorias();

    // Obtener tablas de la categoría seleccionada
    const {
        data: tablasData,
        isLoading: loadingTablas,
        error: errorTablas
    } = useTablasTodasLasZonas(
        Number(categoriaSeleccionada),
        { enabled: !!categoriaSeleccionada }
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

    // Generar opciones del select a partir de las categorías reales
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

    const tablaPosiciones = React.useMemo(() => {
        if (!tablasData) return [];

        // Obtener la primera zona disponible
        const primeraZona = Object.values(tablasData)[0];
        return primeraZona?.tabla || [];
    }, [tablasData]);

    if (loadingCategorias) {
        return <TablaPosicionesHeaderSkeleton className={className}/>;
    }
    const handleCategoriaChange = (value: string | number) => {
        setCategoriaSeleccionada(value);
    };

    return (
        <div className={`bg-[var(--black-900)] rounded-2xl overflow-hidden ${className}`}>
            {/* Header con select de categorías */}
            <div className="flex items-center justify-between px-6 py-4 w-full border-b border-[var(--black-800)]">
                <div className="flex items-center gap-3 flex-col justify-center w-full">
                    <span className="text-white font-bold">Tabla de Posiciones</span>
                    {opcionesCategorias.length > 0 && (
                        <Select
                            options={opcionesCategorias}
                            value={categoriaSeleccionada}
                            onChange={handleCategoriaChange}
                            className="ml-auto"
                            bgColor='bg-[var(--black-800)]'
                            placeholder="Seleccionar categoría"
                        />
                    )}
                </div>
            </div>

            {/* Contenido de la tabla */}
            {loadingTablas ? (
                <TablaPosicionesContentSkeleton />
            ) : errorTablas ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-red-400">Error al cargar la tabla de posiciones</p>
                </div>
            ) : tablaPosiciones.length === 0 ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-[var(--black-400)]">No hay datos disponibles para esta categoría</p>
                </div>
            ) : (
                <>
                    {/* Tabla */}
                    <div className="overflow-x-auto ">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--black-800)]">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        Pos
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        Equipo
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        PJ
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        G
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        E
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        P
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--black-300)] uppercase tracking-wider">
                                        Pts
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaPosiciones.slice(0, 5).map((equipo, index) => {
                                    const posicion = index + 1;
                                    return (
                                        <tr
                                            key={equipo.id_equipo}
                                            className="border-b border-[var(--black-800)] hover:bg-[var(--black-850)] transition-colors duration-150"
                                        >
                                            {/* Posición */}
                                            <td className="px-4 py-3">
                                                <span className={`font-semibold`}>
                                                    {posicion}
                                                </span>
                                            </td>

                                            {/* Equipo */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={equipo.img_equipo ? `${URI_IMG}${equipo.img_equipo}` : imagenFallBack}
                                                        alt={equipo.nombre_equipo}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full object-cover"
                                                    />
                                                    <span className="text-white font-medium text-sm">
                                                        {equipo.nombre_equipo}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Partidos Jugados */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-[var(--black-100)] font-light">
                                                    {equipo.partidos_jugados}
                                                </span>
                                            </td>

                                            {/* Ganados */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-light">
                                                    {equipo.ganados}
                                                </span>
                                            </td>

                                            {/* Empatados */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-light">
                                                    {equipo.empatados}
                                                </span>
                                            </td>

                                            {/* Perdidos */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-light">
                                                    {equipo.perdidos}
                                                </span>
                                            </td>

                                            {/* Puntos */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-white font-bold text-base">
                                                    {equipo.puntos}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Leyenda */}
                    {/* <div className="px-6 py-4 bg-[var(--black-850)] border-t border-[var(--black-800)]">
                        <div className="flex items-center gap-6 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-[var(--black-300)]">Clasificación directa</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span className="text-[var(--black-300)]">Playoffs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span className="text-[var(--black-300)]">Descenso</span>
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </div>
    );
};