import React from 'react';
import { IncidenciaPartido, EstadoPartido } from '@/app/types/partido';
import IncidenciaRow from '../../Incidents';
import { IncidenciaAgrupada } from '../types';
import { SeparadorTiempo } from './SeparadorTiempo';
import { JugadorDestacadoFooter } from './JugadorDestacadoFooter';
import { JugadorDestacado } from '@/app/types/partido';

interface IncidenciasTabProps {
    incidenciasProcesadas: IncidenciaAgrupada[];
    equipoLocalId: number;
    activeTab: 'local' | 'incidencias' | 'visita';
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    estadoPartido?: EstadoPartido;
    jugadorDestacado: JugadorDestacado | null;
    onEditIncidencia?: (incidencia: IncidenciaPartido) => void;
    onDeleteIncidencia?: (incidencia: IncidenciaPartido) => void;
    onEditCambio: (incidencia: IncidenciaPartido) => void;
    onDeleteCambio: (incidencia: IncidenciaPartido) => void;
}

export const IncidenciasTab: React.FC<IncidenciasTabProps> = ({
    incidenciasProcesadas,
    equipoLocalId,
    activeTab,
    mode,
    permitirAcciones,
    estadoPartido,
    jugadorDestacado,
    onEditIncidencia,
    onDeleteIncidencia,
    onEditCambio,
    onDeleteCambio
}) => {
    if (incidenciasProcesadas.length === 0) {
        return (
            <div className="text-center py-12 text-[#737373]">
                No hay incidencias registradas
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-1">
            {incidenciasProcesadas.map((item, index) => {
                if (item.tipo === 'separador') {
                    return (
                        <SeparadorTiempo
                            key={`separador-${item.tiempo || 'final'}-${index}`}
                            tiempo={item.tiempo}
                            esTerminado={item.esTerminado}
                            estadoPartido={item.estadoPartido}
                            index={index}
                        />
                    );
                }

                // Renderizar incidencia
                if (item.tipo !== 'incidencia' || !item.incidencia) return null;
                
                const incidencia = item.incidencia;
                
                return (
                    <IncidenciaRow
                        key={`${activeTab}-${incidencia.tipo}-${incidencia.id}-${index}`}
                        incidencia={incidencia}
                        equipoLocalId={equipoLocalId}
                        index={index}
                        mode={mode}
                        permitirAcciones={permitirAcciones}
                        asistenciaRelacionada={item.asistenciaRelacionada}
                        segundaAmarillaRelacionada={item.segundaAmarillaRelacionada}
                        rojaRelacionada={item.rojaRelacionada}
                        esDobleAmarilla={item.esDobleAmarilla}
                        dobleAmarillaData={item.dobleAmarillaData}
                        onEdit={() => {
                            if (incidencia.tipo === 'cambio') {
                                onEditCambio(incidencia);
                            } else {
                                onEditIncidencia?.(incidencia);
                            }
                        }}
                        onDelete={() => {
                            if (incidencia.tipo === 'cambio') {
                                onDeleteCambio(incidencia);
                            } else {
                                onDeleteIncidencia?.(incidencia);
                            }
                        }}
                    />
                );
            })}

            {/* Mostrar MVP al final si el partido está finalizado */}
            <JugadorDestacadoFooter
                jugadorDestacado={jugadorDestacado}
                estadoPartido={estadoPartido}
            />
        </div>
    );
};

