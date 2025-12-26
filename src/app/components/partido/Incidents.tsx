import { IncidenciaPartido } from "@/app/types/partido";
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { getIcono } from "@/app/utils/incidentsHelpers";
import { GiSoccerKick } from "react-icons/gi";
import IncidentMinute from '../IncidentMinute';
import IncidentActions from '../IncidentsActions';

const IncidenciaRow: React.FC<{
    incidencia: IncidenciaPartido;
    equipoLocalId: number;
    index: number;
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    asistenciaRelacionada?: IncidenciaPartido;
    segundaAmarillaRelacionada?: IncidenciaPartido;
    rojaRelacionada?: IncidenciaPartido;
    esDobleAmarilla?: boolean;
    dobleAmarillaData?: {
        primeraAmarilla: IncidenciaPartido;
        segundaAmarilla: IncidenciaPartido;
        roja: IncidenciaPartido;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}> = ({
    incidencia,
    equipoLocalId,
    index,
    mode,
    permitirAcciones,
    asistenciaRelacionada,
    segundaAmarillaRelacionada,
    rojaRelacionada,
    esDobleAmarilla,
    dobleAmarillaData,
    onEdit,
    onDelete
}) => {

        // Si es un cambio, usar componente específico
        // if (incidencia.tipo === 'cambio') {
        //     return (
        //         <CambioIncidenciaRow
        //             cambio={incidencia}
        //             equipoNombre={equipoNombre || 'Equipo'}
        //             equipoLocalId={equipoLocalId}
        //             index={index}
        //             mode={mode}
        //             permitirAcciones={permitirAcciones}
        //             onEdit={onEdit}
        //             onDelete={onDelete}
        //         />
        //     );
        // }

        const esLocal = incidencia.id_equipo === equipoLocalId;
        const nombreCompleto = `${incidencia.nombre.charAt(0)}. ${incidencia.apellido.toUpperCase()}`;
        const esPlanillero = mode === 'planillero';
        const puedeEditarEliminar = esPlanillero && permitirAcciones && incidencia.tipo !== 'asistencia' && incidencia.tipo !== 'cambio';
        const esGol = incidencia.tipo === 'gol';
        const esCambio = incidencia.tipo === 'cambio';
        const esAmarilla = incidencia.tipo === 'amarilla';
        // const esRoja = incidencia.tipo === 'roja';

        // Detectar si es la segunda amarilla o la roja de una doble amarilla
        const esSegundaAmarillaDoble = esAmarilla && esDobleAmarilla && dobleAmarillaData && incidencia.id === dobleAmarillaData.segundaAmarilla.id;
        // const esRojaDobleAmarilla = esRoja && esDobleAmarilla && dobleAmarillaData && incidencia.id === dobleAmarillaData.roja.id;

        // Nombre completo de la asistencia si existe
        const nombreAsistencia = asistenciaRelacionada
            ? `${asistenciaRelacionada.nombre.charAt(0)}. ${asistenciaRelacionada.apellido.toUpperCase()}`
            : '';

        // Si es un cambio, renderizar de forma especial
        if (esCambio) {
            const tieneEntrada = !!incidencia.jugador_entra_nombre;
            const tieneSalida = !!incidencia.jugador_sale_nombre;
            const puedeEditarEliminarCambio = esPlanillero && permitirAcciones;

            return (
                <div className="opacity-0 translate-y-4" style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}>
                    {/* FILA PRINCIPAL DEL CAMBIO */}
                    <div className="flex items-center gap-4 py-1">
                        <div className="flex-1 flex justify-end">
                            {esLocal && (
                                <div className="flex items-center gap-2">
                                    {/* Botones de editar/eliminar a la IZQUIERDA para LOCAL */}
                                    {puedeEditarEliminarCambio && onEdit && onDelete && (
                                        <IncidentActions
                                            incidencia={incidencia}
                                            onEdit={() => onEdit()}
                                            onDelete={() => onDelete()}
                                            isLocal={true}
                                        />
                                    )}

                                    <div className="text-right">
                                        {/* Entra - verde, más grande, con flecha a la derecha */}
                                        {tieneEntrada && (
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-xs sm:text-sm font-medium text-green-400 whitespace-nowrap">
                                                    {incidencia.jugador_entra_nombre}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-green-400 flex-shrink-0" />
                                            </div>
                                        )}
                                        {/* Sale - rojo, más chico, con flecha a la izquierda */}
                                        {tieneSalida && (
                                            <div className="flex items-center gap-1.5 justify-end opacity-70">
                                                <ArrowLeft className="w-3 h-3 text-red-400 flex-shrink-0" />
                                                <span className="text-[10px] sm:text-xs text-red-400/70 whitespace-nowrap">
                                                    {incidencia.jugador_sale_nombre}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <IncidentMinute minuto={incidencia.minuto || 0} isLocal={true} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center w-10 flex-shrink-0">
                            <RefreshCw className="w-4 h-4 text-[#737373]" />
                        </div>

                        <div className="flex-1 flex justify-start">
                            {!esLocal && (
                                <div className="flex items-center gap-2">
                                    <IncidentMinute minuto={incidencia.minuto || 0} isLocal={false} />

                                    <div className="text-left">
                                        {/* Entra - verde, más grande, con flecha a la derecha */}
                                        {tieneEntrada && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs sm:text-sm font-medium text-green-400 whitespace-nowrap">
                                                    {incidencia.jugador_entra_nombre}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-green-400 flex-shrink-0" />
                                            </div>
                                        )}
                                        {/* Sale - rojo, más chico, con flecha a la izquierda */}
                                        {tieneSalida && (
                                            <div className="flex items-center gap-1.5 opacity-70">
                                                <ArrowLeft className="w-3 h-3 text-red-400 flex-shrink-0" />
                                                <span className="text-[10px] sm:text-xs text-red-400/70 whitespace-nowrap">
                                                    {incidencia.jugador_sale_nombre}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones de editar/eliminar a la DERECHA para VISITA */}
                                    {puedeEditarEliminarCambio && onEdit && onDelete && (
                                        <IncidentActions
                                            incidencia={incidencia}
                                            onEdit={() => onEdit()}
                                            onDelete={() => onDelete()}
                                            isLocal={false}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Renderizar doble amarilla en modo usuario (segunda amarilla + roja superpuestas)
        if (!esPlanillero && esSegundaAmarillaDoble && (segundaAmarillaRelacionada || dobleAmarillaData)) {
            const roja = segundaAmarillaRelacionada || dobleAmarillaData?.roja;
            if (!roja) return null;
            return (
                <div className="opacity-0 translate-y-4" style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}>
                    {/* FILA PRINCIPAL (SEGUNDA AMARILLA + ROJA SUPERPUESTAS) */}
                    <div className="flex items-center gap-4 py-1">
                        <div className="flex-1 flex justify-end">
                            {esLocal && (
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                            {nombreCompleto}
                                        </div>
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center w-10 flex-shrink-0 relative">
                            {/* Tarjetas superpuestas: amarilla detrás, roja delante */}
                            <div className="relative" style={{ width: '16px', height: '16px' }}>
                                {/* Tarjeta amarilla (atrás) */}
                                <div
                                    className="absolute"
                                    style={{
                                        left: '2px',
                                        top: '2px',
                                        width: '14px',
                                        height: '14px',
                                        backgroundColor: '#eab308',
                                        borderRadius: '2px',
                                        zIndex: 1,
                                    }}
                                />
                                {/* Tarjeta roja (delante) */}
                                <div
                                    className="absolute"
                                    style={{
                                        left: '0px',
                                        top: '0px',
                                        width: '14px',
                                        height: '14px',
                                        backgroundColor: '#dc2626',
                                        borderRadius: '2px',
                                        zIndex: 2,
                                    }}
                                />
                            </div>

                        </div>

                        <div className="flex-1 flex justify-start">
                            {!esLocal && (
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                            {nombreCompleto}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // En modo planillero, si es la segunda amarilla, mostrar con la roja agrupada
        if (esPlanillero && esSegundaAmarillaDoble && segundaAmarillaRelacionada) {
            const roja = segundaAmarillaRelacionada;
            return (
                <div className="opacity-0 translate-y-4" style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}>
                    {/* FILA PRINCIPAL (SEGUNDA AMARILLA + ROJA AGRUPADAS) */}
                    <div className="flex items-center gap-4 py-1">
                        <div className="flex-1 flex justify-end">
                            {esLocal && (
                                <div className="flex items-center gap-2">
                                    {/* Botones de editar/eliminar a la IZQUIERDA para LOCAL */}
                                    {puedeEditarEliminar && onEdit && onDelete && (
                                        <IncidentActions
                                            incidencia={incidencia}
                                            onEdit={() => onEdit()}
                                            onDelete={() => onDelete()}
                                            isLocal={true}
                                        />
                                    )}
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                            {nombreCompleto}
                                        </div>
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center w-10 flex-shrink-0 relative">
                            {/* Tarjetas superpuestas: amarilla detrás, roja delante */}
                            <div className="relative" style={{ width: '18px', height: '18px' }}>
                                {/* Tarjeta amarilla (atrás) */}
                                <div className="absolute" style={{
                                    left: '2px',
                                    top: '2px',
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: '#eab308',
                                    borderRadius: '2px',
                                    zIndex: 1
                                }} />
                                {/* Tarjeta roja (delante) */}
                                <div className="absolute" style={{
                                    left: '0px',
                                    top: '0px',
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: '#dc2626',
                                    borderRadius: '2px',
                                    zIndex: 2
                                }} />
                            </div>
                        </div>

                        <div className="flex-1 flex justify-start">
                            {!esLocal && (
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                            {nombreCompleto}
                                        </div>
                                    </div>
                                    {/* Botones de editar/eliminar a la DERECHA para VISITA */}
                                    {puedeEditarEliminar && onEdit && onDelete && (
                                        <IncidentActions
                                            incidencia={incidencia}
                                            onEdit={() => onEdit()}
                                            onDelete={() => onDelete()}
                                            isLocal={false}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="opacity-0 translate-y-4" style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}>
                {/* FILA PRINCIPAL (GOL/AMARILLA/ROJA) */}
                <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 flex justify-end">
                        {esLocal && (
                            <div className="flex items-center gap-2">
                                {/* Botones de editar/eliminar a la IZQUIERDA para LOCAL */}
                                {puedeEditarEliminar && onEdit && onDelete && (
                                    <IncidentActions
                                        incidencia={incidencia}
                                        onEdit={() => onEdit()}
                                        onDelete={() => onDelete()}
                                        isLocal={true}
                                    />
                                )}
                                <div className="text-right">
                                    <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                        {nombreCompleto}
                                        {incidencia.penal === 'S' && <span className="text-[#737373] ml-1">(p)</span>}
                                        {incidencia.en_contra === 'S' && <span className="text-[#737373] ml-1">(ec)</span>}
                                    </div>
                                </div>
                                <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center w-10 flex-shrink-0">
                        {getIcono(incidencia)}
                    </div>

                    <div className="flex-1 flex justify-start">
                        {!esLocal && (
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] sm:text-xs font-mono text-[#737373]">{incidencia.minuto}&apos;</div>
                                <div className="text-left">
                                    <div className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                        {nombreCompleto}
                                        {incidencia.penal === 'S' && <span className="text-yellow-500 ml-1">(P)</span>}
                                        {incidencia.en_contra === 'S' && <span className="text-red-400 ml-1">(EC)</span>}
                                    </div>
                                </div>
                                {/* Botones de editar/eliminar a la DERECHA para VISITA */}
                                {puedeEditarEliminar && onEdit && onDelete && (
                                    <IncidentActions
                                        incidencia={incidencia}
                                        onEdit={() => onEdit()}
                                        onDelete={() => onDelete()}
                                        isLocal={false}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* FILA DE ASISTENCIA (debajo del gol, más sutil) */}
                {esGol && asistenciaRelacionada && (
                    <div className="flex items-center gap-4 pb-1 opacity-40">
                        <div className="flex-1 flex justify-end">
                            {esLocal && (
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="text-[10px] sm:text-xs font-medium text-[#a3a3a3] whitespace-nowrap">
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
                                        <div className="text-[10px] sm:text-xs font-medium text-[#a3a3a3] whitespace-nowrap">
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