'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Edit2, Trash2, Plus, ExternalLink } from 'lucide-react';
import { PredioConCanchas, CanchaConPredio } from '@/app/types/predios';
import CardCancha from './CardCancha';
import { Button } from '../ui/Button';

interface PartidoOcupado {
    id_partido: number;
    hora: string;
    dia: string | Date;
    equipoLocal?: {
        nombre: string;
        img?: string | null;
    };
    equipoVisita?: {
        nombre: string;
        img?: string | null;
    };
    estado: string;
    goles_local?: number | null;
    goles_visita?: number | null;
}

interface PredioAccordionProps {
    predio: PredioConCanchas;
    partidosPorCancha?: Map<number, PartidoOcupado[]>;
    fechaVisualizacion?: string;
    onEditPredio?: (predio: PredioConCanchas) => void;
    onDeletePredio?: (predio: PredioConCanchas) => void;
    onCreateCancha?: (predio: PredioConCanchas) => void;
    onEditCancha?: (cancha: CanchaConPredio) => void;
    onDeleteCancha?: (cancha: CanchaConPredio) => void;
}

const PredioAccordion: React.FC<PredioAccordionProps> = ({
    predio,
    partidosPorCancha = new Map(),
    fechaVisualizacion,
    onEditPredio,
    onDeletePredio,
    onCreateCancha,
    onEditCancha,
    onDeleteCancha,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const canchasActivas = predio.canchas.filter(c => c.estado === 'A');
    const canchasInactivas = predio.canchas.filter(c => c.estado === 'I');

    return (
        <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-xl overflow-hidden mb-4 transition-all duration-300">
            {/* Header del Predio */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-[var(--gray-300)] transition-colors"
            >
                <div className="flex items-center gap-4 flex-1 text-left">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isOpen ? 'bg-[var(--green)]/20' : 'bg-[var(--gray-300)]'
                    }`}>
                        {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[var(--green)]" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-[var(--gray-100)]" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-[var(--white)]">
                                {predio.nombre}
                            </h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                predio.estado === 'A'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                                {predio.estado === 'A' ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/30">
                                {canchasActivas.length} cancha{canchasActivas.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--gray-100)]">
                            {predio.direccion && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {predio.direccion.startsWith('http') ? (
                                        <a
                                            href={predio.direccion}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[var(--green)] hover:text-[var(--green)]/80 transition-colors underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span>Ver en Google Maps</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span>{predio.direccion}</span>
                                    )}
                                </div>
                            )}
                            {predio.descripcion && (
                                <p className="text-xs text-[var(--gray-200)] truncate max-w-md">
                                    {predio.descripcion}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu de acciones del predio */}
                <div className="relative flex items-center gap-2">
                    {onCreateCancha && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreateCancha(predio);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Cancha
                        </Button>
                    )}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                        >
                            <span className="text-[var(--gray-100)]">⋮</span>
                        </button>
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-40 bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg shadow-xl z-20">
                                    {onEditPredio && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditPredio(predio);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-[var(--white)] hover:bg-[var(--gray-300)] flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar Predio
                                        </button>
                                    )}
                                    {onDeletePredio && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeletePredio(predio);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[var(--gray-300)] flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar Predio
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </button>

            {/* Contenido colapsable - Grid de canchas */}
            <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                    transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out'
                }}
            >
                <div className={`p-6 border-t border-[var(--gray-300)] bg-[var(--black-900)] transform transition-transform duration-500 ${
                    isOpen ? 'translate-y-0' : '-translate-y-4'
                }`}>
                    {canchasActivas.length === 0 && canchasInactivas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--gray-100)] mb-4">
                                Este predio no tiene canchas registradas
                            </p>
                            {onCreateCancha && (
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => onCreateCancha(predio)}
                                    className="flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar primera cancha
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Canchas activas */}
                            {canchasActivas.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[var(--gray-100)] mb-4">
                                        Canchas Activas
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {canchasActivas.map((cancha) => {
                                            const partidos = partidosPorCancha.get(cancha.id_cancha) || [];

                                            return (
                                                <CardCancha
                                                    key={cancha.id_cancha}
                                                    cancha={{
                                                        ...cancha,
                                                        predio: {
                                                            id_predio: predio.id_predio,
                                                            nombre: predio.nombre,
                                                            estado: predio.estado,
                                                            direccion: predio.direccion || null,
                                                        },
                                                    }}
                                                    partidosOcupados={partidos}
                                                    fechaVisualizacion={fechaVisualizacion}
                                                    onEdit={onEditCancha}
                                                    onDelete={onDeleteCancha}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Canchas inactivas */}
                            {canchasInactivas.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--gray-200)] mb-4">
                                        Canchas Inactivas ({canchasInactivas.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                                        {canchasInactivas.map((cancha) => (
                                            <CardCancha
                                                key={cancha.id_cancha}
                                                cancha={{
                                                    ...cancha,
                                                    predio: {
                                                        id_predio: predio.id_predio,
                                                        nombre: predio.nombre,
                                                        estado: predio.estado,
                                                        direccion: predio.direccion || null,
                                                    },
                                                }}
                                                partidosOcupados={[]}
                                                isAvailable={false}
                                                onEdit={onEditCancha}
                                                onDelete={onDeleteCancha}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredioAccordion;

