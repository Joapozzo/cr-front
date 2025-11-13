"use client";
import { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';
import { Sancion } from '@/app/types/sancion';
import { formatearFechaCorta } from '@/app/utils/fechas';
import { Button } from '../ui/Button';

interface TablaSancionesProps {
    sanciones: Sancion[];
    onVerDetalles: (sancion: Sancion) => void;
    onEditar: (sancion: Sancion) => void;
    onEliminar: (sancion: Sancion) => void;
}

export default function TablaSanciones({
    sanciones,
    onVerDetalles,
    onEditar,
    onEliminar
}: TablaSancionesProps) {
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activas' | 'revocadas'>('todos');

    // Filtrar sanciones
    const sancionesFiltradas = useMemo(() => {
        return sanciones.filter(sancion => {
            // Filtro por nombre
            const nombreCompleto = `${sancion.jugador?.usuario?.nombre || ''} ${sancion.jugador?.usuario?.apellido || ''}`.toLowerCase();
            const cumpleFiltroNombre = nombreCompleto.includes(filtroNombre.toLowerCase());

            // Filtro por estado
            let cumpleFiltroEstado = true;
            if (filtroEstado === 'activas') {
                cumpleFiltroEstado = sancion.estado === 'A' && (sancion.fechas_restantes || 0) > 0;
            } else if (filtroEstado === 'revocadas') {
                cumpleFiltroEstado = sancion.estado === 'R' || (sancion.fechas_restantes || 0) === 0;
            }

            return cumpleFiltroNombre && cumpleFiltroEstado;
        });
    }, [sanciones, filtroNombre, filtroEstado]);

    const getEstadoBadge = (sancion: Sancion) => {
        if (sancion.estado === 'R') {
            return <span className="px-2 py-1 text-xs rounded bg-[var(--gray-300)] text-[var(--gray-100)]">Revocada</span>;
        }
        if ((sancion.fechas_restantes || 0) > 0) {
            return <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400">Activa</span>;
        }
        return <span className="px-2 py-1 text-xs rounded bg-[var(--green)]/20 text-[var(--green)]">Cumplida</span>;
    };

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Búsqueda por nombre */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-100)] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre del jugador..."
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:border-[var(--green)]"
                            />
                        </div>
                    </div>

                    {/* Filtro por estado */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setFiltroEstado('todos')}
                            variant={filtroEstado === 'todos' ? 'success' : 'default'}
                            size="sm"
                        >
                            Todas
                        </Button>
                        <Button
                            onClick={() => setFiltroEstado('activas')}
                            variant={filtroEstado === 'activas' ? 'success' : 'default'}
                            size="sm"
                        >
                            Activas
                        </Button>
                        <Button
                            onClick={() => setFiltroEstado('revocadas')}
                            variant={filtroEstado === 'revocadas' ? 'success' : 'default'}
                            size="sm"
                        >
                            Revocadas/Cumplidas
                        </Button>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="mt-3 text-sm text-[var(--gray-100)]">
                    Mostrando {sancionesFiltradas.length} de {sanciones.length} sanciones
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-300)] border-b border-[var(--gray-200)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Jugador
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Partido
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Fechas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Fecha Sanción
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--gray-100)] uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {sancionesFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-[var(--gray-100)]">
                                        No se encontraron sanciones
                                    </td>
                                </tr>
                            ) : (
                                sancionesFiltradas.map((sancion) => (
                                    <tr key={sancion.id_expulsion} className="hover:bg-[var(--gray-300)] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {sancion.jugador?.usuario?.img ? (
                                                    <img
                                                        src={sancion.jugador.usuario.img}
                                                        alt={`${sancion.jugador.usuario.nombre}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
                                                        <span className="text-[var(--white)] font-semibold">
                                                            {sancion.jugador?.usuario?.nombre?.[0]}{sancion.jugador?.usuario?.apellido?.[0]}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[var(--white)] font-medium">
                                                        {sancion.jugador?.usuario?.nombre} {sancion.jugador?.usuario?.apellido}
                                                    </p>
                                                    {sancion.jugador?.usuario?.dni && (
                                                        <p className="text-xs text-[var(--gray-100)]">
                                                            DNI: {sancion.jugador.usuario.dni}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="text-[var(--white)]">Jornada {sancion.partido?.jornada}</p>
                                                <p className="text-xs text-[var(--gray-100)]">
                                                    {sancion.partido?.dia ? formatearFechaCorta(sancion.partido.dia) : 'Por definir'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="text-[var(--white)]">{sancion.tipo_tarjeta || 'No especificado'}</p>
                                                {sancion.minuto && (
                                                    <p className="text-xs text-[var(--gray-100)]">Min {sancion.minuto}'</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-[var(--white)]">
                                                <span className="font-semibold">{sancion.fechas_restantes || 0}</span>
                                                <span className="text-[var(--gray-100)]"> / {sancion.fechas || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getEstadoBadge(sancion)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--gray-100)]">
                                            {sancion.fecha_creacion
                                                ? formatearFechaCorta(sancion.fecha_creacion.toString())
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onVerDetalles(sancion)}
                                                    className="p-2 rounded-lg bg-[var(--gray-300)] hover:bg-[var(--gray-200)] text-[var(--white)] transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {sancion.estado === 'A' && (sancion.fechas_restantes || 0) > 0 && (
                                                    <>
                                                        <button
                                                            onClick={() => onEditar(sancion)}
                                                            className="p-2 rounded-lg bg-[var(--gray-300)] hover:bg-[var(--gray-200)] text-[var(--white)] transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onEliminar(sancion)}
                                                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                                            title="Revocar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
