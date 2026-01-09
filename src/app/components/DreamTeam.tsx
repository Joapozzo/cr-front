'use client';

import React from 'react';
import Select from './ui/Select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DreamTeamField } from './DreamTeamField';
import { useDreamTeamLogic } from '../hooks/useDreamTeamLogic';

interface DreamTeamProps {
    className?: string;
}

export const DreamTeam: React.FC<DreamTeamProps> = ({
    className = ""
}) => {
    const {
        // Estados
        categoriaSeleccionada,
        jornadaSeleccionada,
        jornadasDisponibles,

        // Datos
        dreamteam,
        opcionesCategorias,
        jugadoresOrganizados,

        // Errores
        errorDreamteam,

        // Handlers
        handleCategoriaChange,
        handleJornadaAnterior,
        handleJornadaSiguiente,
    } = useDreamTeamLogic();

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
            {jornadasDisponibles.length > 0 && jornadaSeleccionada && jornadaSeleccionada > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--black-800)]">
                    <button
                        onClick={handleJornadaAnterior}
                        disabled={jornadaSeleccionada === jornadasDisponibles[0] || jornadaSeleccionada <= 0}
                        className="p-2 rounded-full hover:bg-[var(--black-800)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    <div className="text-center">
                        <span className="text-white font-medium">Fecha {jornadaSeleccionada}</span>
                    </div>

                    <button
                        onClick={handleJornadaSiguiente}
                        disabled={jornadaSeleccionada === jornadasDisponibles[jornadasDisponibles.length - 1] || jornadaSeleccionada <= 0}
                        className="p-2 rounded-full hover:bg-[var(--black-800)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            )}

            {/* Contenido del dreamteam */}
            {errorDreamteam ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-red-400">Error al cargar el dream team</p>
                </div>
            ) : jornadasDisponibles.length === 0 ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-[var(--black-400)]">No hay dream teams disponibles para esta categoría</p>
                </div>
            ) : !dreamteam ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-[var(--black-400)]">No hay dream team para esta jornada</p>
                </div>
            ) : (
                <DreamTeamField
                    jugadoresOrganizados={jugadoresOrganizados}
                    formacion={dreamteam.formacion || ''}
                />
            )}
        </div>
    );
};

