import { IncidenciaPartido } from "@/app/types/partido";
import { Trash2, Edit2 } from 'lucide-react';
import { getIcono } from "@/app/utils/incidentsHelpers";
import { GiSoccerKick } from "react-icons/gi";

const IncidenciaRow: React.FC<{
    incidencia: IncidenciaPartido;
    equipoLocalId: number;
    index: number;
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    asistenciaRelacionada?: IncidenciaPartido;
    onEdit?: () => void;
    onDelete?: () => void;
}> = ({ incidencia, equipoLocalId, index, mode, permitirAcciones, asistenciaRelacionada, onEdit, onDelete }) => {

    const esLocal = incidencia.id_equipo === equipoLocalId;
    const nombreCompleto = `${incidencia.nombre.charAt(0)}. ${incidencia.apellido.toUpperCase()}`;
    const esPlanillero = mode === 'planillero';
    const puedeEditarEliminar = esPlanillero && permitirAcciones && incidencia.tipo !== 'asistencia';
    const esGol = incidencia.tipo === 'gol';

    // Nombre completo de la asistencia si existe
    const nombreAsistencia = asistenciaRelacionada 
        ? `${asistenciaRelacionada.nombre.charAt(0)}. ${asistenciaRelacionada.apellido.toUpperCase()}`
        : '';

    return (
        <div className="opacity-0 translate-y-4" style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}>
            {/* FILA PRINCIPAL (GOL/AMARILLA/ROJA) */}
            <div className="flex items-center gap-4 py-3">
                <div className="flex-1 flex justify-end">
                    {esLocal && (
                        <div className="flex items-center gap-2">
                            {/* Botones de editar/eliminar a la IZQUIERDA para LOCAL */}
                            {puedeEditarEliminar && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={onEdit}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#262626] rounded transition-colors"
                                    >
                                        <Edit2 size={14} className="text-[#737373]" />
                                    </button>
                                    <button
                                        onClick={onDelete}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#262626] rounded transition-colors"
                                    >
                                        <Trash2 size={14} className="text-[var(--red)]" />
                                    </button>
                                </div>
                            )}
                            <div className="text-right">
                                <div className="text-xs sm:text-sm font-medium text-white">
                                    {nombreCompleto}
                                    {incidencia.penal === 'S' && <span className="text-[#737373] ml-1">(p)</span>}
                                    {incidencia.en_contra === 'S' && <span className="text-[#737373] ml-1">(ec)</span>}
                                </div>
                            </div>
                            <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}'</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center w-10 flex-shrink-0">
                    {getIcono(incidencia)}
                </div>

                <div className="flex-1 flex justify-start">
                    {!esLocal && (
                        <div className="flex items-center gap-2">
                            <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}'</div>
                            <div className="text-left">
                                <div className="text-xs sm:text-sm font-medium text-white">
                                    {nombreCompleto}
                                    {incidencia.penal === 'S' && <span className="text-yellow-500 ml-1">(P)</span>}
                                    {incidencia.en_contra === 'S' && <span className="text-red-400 ml-1">(EC)</span>}
                                </div>
                            </div>
                            {/* Botones de editar/eliminar a la DERECHA para VISITA */}
                            {puedeEditarEliminar && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={onEdit}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#262626] rounded transition-colors"
                                    >
                                        <Edit2 size={14} className="text-[#737373]" />
                                    </button>
                                    <button
                                        onClick={onDelete}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#262626] rounded transition-colors"
                                    >
                                        <Trash2 size={14} className="text-[var(--red)]" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* FILA DE ASISTENCIA (debajo del gol, más sutil) */}
            {esGol && asistenciaRelacionada && (
                <div className="flex items-center gap-4 pb-2 opacity-40">
                    <div className="flex-1 flex justify-end">
                        {esLocal && (
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="text-[10px] sm:text-xs font-medium text-[#a3a3a3]">
                                        {nombreAsistencia}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center w-10 flex-shrink-0">
                        <GiSoccerKick className="w-3.5 h-3.5 text-[#737373]" />
                    </div>

                    <div className="flex-1 flex justify-start">
                        {!esLocal && (
                            <div className="flex items-center gap-2">
                                <div className="text-left">
                                    <div className="text-[10px] sm:text-xs font-medium text-[#a3a3a3]">
                                        {nombreAsistencia}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidenciaRow;