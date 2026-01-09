import React, { useState, useMemo, useCallback } from 'react';
import { IncidenciaPartido, JugadorPlantel, EstadoPartido, JugadorDestacado } from '@/app/types/partido';
import CambioJugadorModal from '../CambioJugadorModal';
import { useCrearCambioCompleto } from '@/app/hooks/useCambiosJugador';
import { DeleteModal, ConfirmDeleteIncidentModal } from '../../modals/ModalAdmin';
import toast from 'react-hot-toast';

// Hooks
import { useModalState } from './hooks/useModalState';
import { useCambiosManager } from './hooks/useCambiosManager';
import { useIncidenciasProcessor } from './hooks/useIncidenciasProcessor';
import { useJugadorActions } from './hooks/useJugadorActions';

// Components
import { TabNavigation } from './components/TabNavigation';
import { EquipoTab } from './components/EquipoTab';
import { IncidenciasTab } from './components/IncidenciasTab';

// Utils
import { calcularJugadoresEnCancha } from './utils/jugadores.utils';
import { TabType, EquipoData, CambiosProp } from './types';

interface JugadoresTabsProps {
    equipoLocal: {
        id_equipo: number;
        nombre: string;
        jugadores: JugadorPlantel[]
    };
    equipoVisita: {
        id_equipo: number;
        nombre: string;
        jugadores: JugadorPlantel[]
    };
    incidencias: IncidenciaPartido[];
    destacados?: Array<{ id_jugador: number; id_equipo: number }>;

    // Modo de operación
    mode: 'view' | 'planillero';
    estadoPartido?: EstadoPartido;
    estrellasRotando?: Set<number>;
    jugadorDestacado: JugadorDestacado | null;

    // Callbacks para modo planillero
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onJugadorAction?: (jugadorId: number, equipoId: number) => void;
    onDeleteDorsal?: (jugadorId: number) => void;
    onToggleDestacado?: (jugadorId: number, equipoId: number) => void;
    onAgregarEventual?: (equipo: 'local' | 'visita') => void;

    // Callbacks para incidencias
    onEditIncidencia?: (incidencia: IncidenciaPartido) => void;
    onDeleteIncidencia?: (incidencia: IncidenciaPartido) => void;

    // Estados
    loading?: boolean;
    jugadorCargando?: number | null;

    // Configuración
    idCategoriaEdicion?: number;
    idPartido?: number;
    tipoFutbol?: number; // Para validar límite de jugadores en cancha
    
    // Cambios (opcional, si vienen del backend en modo usuario)
    cambios?: CambiosProp[];
}

const JugadoresTabsUnified: React.FC<JugadoresTabsProps> = ({
    equipoLocal,
    equipoVisita,
    incidencias,
    destacados = [],
    mode = 'view',
    estadoPartido,
    onJugadorClick,
    onJugadorAction,
    onDeleteDorsal,
    onToggleDestacado,
    onAgregarEventual,
    onEditIncidencia,
    onDeleteIncidencia,
    loading = false,
    jugadorCargando = null,
    estrellasRotando = new Set(),
    jugadorDestacado,
    idCategoriaEdicion,
    idPartido,
    tipoFutbol = 7,
    cambios: cambiosProp,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('incidencias');

    const esPlanillero = mode === 'planillero';
    const permitirAcciones = esPlanillero && ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido || '');

    // Convertir props a formato interno
    const equipoLocalData: EquipoData = useMemo(() => ({
        id_equipo: equipoLocal.id_equipo,
        nombre: equipoLocal.nombre,
        jugadores: equipoLocal.jugadores
    }), [equipoLocal]);

    const equipoVisitaData: EquipoData = useMemo(() => ({
        id_equipo: equipoVisita.id_equipo,
        nombre: equipoVisita.nombre,
        jugadores: equipoVisita.jugadores
    }), [equipoVisita]);

    // Calcular jugadores en cancha por equipo
    const jugadoresEnCanchaLocal = useMemo(() => {
        return calcularJugadoresEnCancha(equipoLocal.jugadores);
    }, [equipoLocal.jugadores]);

    const jugadoresEnCanchaVisita = useMemo(() => {
        return calcularJugadoresEnCancha(equipoVisita.jugadores);
    }, [equipoVisita.jugadores]);

    // Hooks
    const modalState = useModalState();
    
    const { cambios, incidenciasCambios, jugadoresConCambios } = useCambiosManager({
        idPartido,
        cambiosProp,
        equipoLocal: equipoLocalData,
        equipoVisita: equipoVisitaData
    });

    const { incidenciasProcesadas, incidenciasParaAcciones } = useIncidenciasProcessor({
        incidencias,
        incidenciasCambios,
        estadoPartido,
        equipoLocal: equipoLocalData,
        equipoVisita: equipoVisitaData,
        mode
    });

    const {
        handleToggleEnCancha,
        handleEditarCambio,
        handleEliminarCambio,
        jugadoresCargando,
        isEditandoCambio
    } = useJugadorActions({
        idPartido,
        idCategoriaEdicion,
        equipoLocal: equipoLocalData,
        equipoVisita: equipoVisitaData,
        tipoFutbol,
        jugadoresEnCanchaLocal,
        jugadoresEnCanchaVisita
    });

    const { mutateAsync: crearCambioCompletoAsync, isPending: isCreandoCambio } = useCrearCambioCompleto();

    // Handler para solicitar cambio
    const handleSolicitarCambio = useCallback((jugador: JugadorPlantel) => {
        // Validar estado del partido antes de abrir modal
        if (!['C1', 'E', 'C2', 'T'].includes(estadoPartido || '')) {
            toast.error('Solo se pueden realizar cambios durante el partido (primer o segundo tiempo)');
            return;
        }

        const equipo = equipoLocal.jugadores.some(j => j.id_jugador === jugador.id_jugador) 
            ? 'local' 
            : 'visita';
        modalState.abrirModalCambio(jugador, equipo);
    }, [equipoLocal.jugadores, estadoPartido, modalState]);

    // Handler para confirmar cambio
    const handleConfirmarCambio = useCallback(async (
        jugadorEntraId: number,
        minuto: number
    ) => {
        if (!idPartido || !idCategoriaEdicion || !modalState.modalCambio.jugadorSale) return;

        // Validar estado del partido
        if (!['C1', 'E', 'C2', 'T'].includes(estadoPartido || '')) {
            toast.error('Solo se pueden realizar cambios durante el partido');
            return;
        }

        const equipoId = modalState.modalCambio.equipo === 'local' 
            ? equipoLocal.id_equipo 
            : equipoVisita.id_equipo;

        try {
            // Crear cambio completo (SALIDA + ENTRADA) en una sola transacción
            await crearCambioCompletoAsync({
                idPartido,
                cambioData: {
                    id_categoria_edicion: idCategoriaEdicion,
                    id_equipo: equipoId,
                    id_jugador_sale: modalState.modalCambio.jugadorSale.id_jugador,
                    id_jugador_entra: jugadorEntraId,
                    minuto
                }
            });

            toast.success('Cambio registrado correctamente');
            modalState.cerrarModalCambio();
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al registrar cambio';
            toast.error(errorMessage);
        }
    }, [idPartido, idCategoriaEdicion, modalState, estadoPartido, equipoLocal.id_equipo, equipoVisita.id_equipo, crearCambioCompletoAsync]);

    // Handler para abrir modal de edición
    const handleEditCambio = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo !== 'cambio') return;

        const equipo = incidencia.id_equipo === equipoLocal.id_equipo ? 'local' : 'visita';
        modalState.abrirModalEditarCambio(
            incidencia.id,
            incidencia.jugador_sale_id || 0,
            incidencia.minuto || 0,
            equipo
        );
    }, [equipoLocal.id_equipo, modalState]);

    // Handler para abrir modal de eliminación
    const handleDeleteCambio = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo !== 'cambio') return;

        modalState.abrirModalEliminarCambio(incidencia.id, incidencia);
    }, [modalState]);

    // Handler para abrir modal de eliminación de incidencia
    const handleDeleteIncidencia = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo === 'cambio') {
            handleDeleteCambio(incidencia);
            return;
        }

        modalState.abrirModalEliminarIncidencia(incidencia);
    }, [handleDeleteCambio, modalState]);

    // Handler para confirmar eliminación de cambio
    const handleConfirmarEliminarCambio = useCallback(async () => {
        if (!modalState.modalEliminarCambio.cambioId) return;

        try {
            await handleEliminarCambio(modalState.modalEliminarCambio.cambioId);
            modalState.cerrarModalEliminarCambio();
        } catch (error) {
            // Error ya manejado en handleEliminarCambio
        }
    }, [modalState, handleEliminarCambio]);

    // Handler para confirmar eliminación de incidencia
    const handleConfirmarEliminarIncidencia = useCallback(async () => {
        if (!modalState.modalEliminarIncidencia.incidencia || !onDeleteIncidencia) return;

        try {
            await onDeleteIncidencia(modalState.modalEliminarIncidencia.incidencia);
            // El toast de éxito ya se muestra en useIncidenciasActions.handleDeleteAction
            modalState.cerrarModalEliminarIncidencia();
        } catch (error) {
            // El toast de error ya se muestra en useIncidenciasActions.handleDeleteAction
            // No necesitamos cerrar el modal si hay error
        }
    }, [modalState, onDeleteIncidencia]);

    // Handler para editar cambio (llamado desde el hook)
    const handleEditarCambioFromModal = useCallback(async (
        cambioId: number,
        jugadorSaleId: number,
        minuto: number
    ) => {
        await handleEditarCambio(cambioId, jugadorSaleId, minuto);
        modalState.cerrarModalEditarCambio();
    }, [handleEditarCambio, modalState]);

    // Obtener jugadores a mostrar según el modo
    const getJugadoresAMostrar = useCallback((equipo: 'local' | 'visita') => {
        if (mode === 'view') {
            return equipo === 'local' ? jugadoresConCambios.local : jugadoresConCambios.visita;
        }
        return equipo === 'local' ? equipoLocal.jugadores : equipoVisita.jugadores;
    }, [mode, jugadoresConCambios, equipoLocal.jugadores, equipoVisita.jugadores]);

    return (
        <>
            <style jsx>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div className="w-full bg-[var(--black-900)] flex flex-col rounded-xl">
                {/* Navegación */}
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    equipoLocalNombre={equipoLocal.nombre}
                    equipoVisitaNombre={equipoVisita.nombre}
                />

                {/* Contenido */}
                <div className="w-full px-4 py-4">
                    {activeTab === 'local' && (
                        <EquipoTab
                            jugadores={getJugadoresAMostrar('local')}
                            equipo="local"
                            equipoId={equipoLocal.id_equipo}
                            activeTab={activeTab}
                            mode={mode}
                            permitirAcciones={permitirAcciones}
                            incidenciasParaAcciones={incidenciasParaAcciones}
                            destacados={destacados}
                            jugadorCargando={jugadorCargando}
                            jugadoresCargando={jugadoresCargando}
                            tipoFutbol={tipoFutbol}
                            jugadoresEnCancha={jugadoresEnCanchaLocal}
                            estrellasRotando={estrellasRotando}
                            esPlanillero={esPlanillero}
                            onToggleEnCancha={permitirAcciones ? handleToggleEnCancha : undefined}
                            onSolicitarCambio={permitirAcciones ? handleSolicitarCambio : undefined}
                            onJugadorClick={onJugadorClick}
                            onJugadorAction={onJugadorAction}
                            onDeleteDorsal={onDeleteDorsal}
                            onToggleDestacado={onToggleDestacado}
                            onAgregarEventual={onAgregarEventual}
                        />
                    )}

                    {activeTab === 'incidencias' && (
                        <IncidenciasTab
                            incidenciasProcesadas={incidenciasProcesadas}
                            equipoLocalId={equipoLocal.id_equipo}
                            activeTab={activeTab}
                            mode={mode}
                            permitirAcciones={permitirAcciones}
                            estadoPartido={estadoPartido}
                            jugadorDestacado={jugadorDestacado}
                            onEditIncidencia={onEditIncidencia}
                            onDeleteIncidencia={handleDeleteIncidencia}
                            onEditCambio={handleEditCambio}
                            onDeleteCambio={handleDeleteCambio}
                            isLoading={loading}
                        />
                    )}

                    {activeTab === 'visita' && (
                        <EquipoTab
                            jugadores={getJugadoresAMostrar('visita')}
                            equipo="visita"
                            equipoId={equipoVisita.id_equipo}
                            activeTab={activeTab}
                            mode={mode}
                            permitirAcciones={permitirAcciones}
                            incidenciasParaAcciones={incidenciasParaAcciones}
                            destacados={destacados}
                            jugadorCargando={jugadorCargando}
                            jugadoresCargando={jugadoresCargando}
                            tipoFutbol={tipoFutbol}
                            jugadoresEnCancha={jugadoresEnCanchaVisita}
                            estrellasRotando={estrellasRotando}
                            esPlanillero={esPlanillero}
                            onToggleEnCancha={permitirAcciones ? handleToggleEnCancha : undefined}
                            onSolicitarCambio={permitirAcciones ? handleSolicitarCambio : undefined}
                            onJugadorClick={onJugadorClick}
                            onJugadorAction={onJugadorAction}
                            onDeleteDorsal={onDeleteDorsal}
                            onToggleDestacado={onToggleDestacado}
                            onAgregarEventual={onAgregarEventual}
                        />
                    )}
                </div>
            </div>

            {/* Modal de cambio de jugador (creación) */}
            {modalState.modalCambio.jugadorSale && (
                <CambioJugadorModal
                    isOpen={modalState.modalCambio.isOpen}
                    onClose={modalState.cerrarModalCambio}
                    jugadorSale={modalState.modalCambio.jugadorSale}
                    jugadoresSuplentes={modalState.modalCambio.equipo === 'local' 
                        ? equipoLocal.jugadores 
                        : equipoVisita.jugadores}
                    equipoId={modalState.modalCambio.equipo === 'local' 
                        ? equipoLocal.id_equipo 
                        : equipoVisita.id_equipo}
                    equipoNombre={modalState.modalCambio.equipo === 'local' 
                        ? equipoLocal.nombre 
                        : equipoVisita.nombre}
                    partidoId={idPartido || 0}
                    estadoPartido={estadoPartido}
                    onConfirmarCambio={handleConfirmarCambio}
                    isLoading={isCreandoCambio}
                />
            )}

            {/* Modal de edición de cambio */}
            {modalState.modalEditarCambio.cambioId && (
                <CambioJugadorModal
                    isOpen={modalState.modalEditarCambio.isOpen}
                    onClose={modalState.cerrarModalEditarCambio}
                    jugadoresSuplentes={modalState.modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.jugadores 
                        : equipoVisita.jugadores}
                    equipoId={modalState.modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.id_equipo 
                        : equipoVisita.id_equipo}
                    equipoNombre={modalState.modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.nombre 
                        : equipoVisita.nombre}
                    partidoId={idPartido || 0}
                    estadoPartido={estadoPartido}
                    modoEdicion={true}
                    cambioId={modalState.modalEditarCambio.cambioId}
                    minutoActual={modalState.modalEditarCambio.minuto || undefined}
                    jugadorSaleId={modalState.modalEditarCambio.jugadorSaleId || undefined}
                    onEditarCambio={handleEditarCambioFromModal}
                    onConfirmarCambio={async () => {}} // No se usa en modo edición
                    isLoading={isEditandoCambio}
                />
            )}

            {/* Modal de confirmación de eliminación de cambio */}
            <DeleteModal
                isOpen={modalState.modalEliminarCambio.isOpen}
                onClose={modalState.cerrarModalEliminarCambio}
                title="Eliminar cambio"
                message={modalState.modalEliminarCambio.incidencia 
                    ? `¿Estás seguro que quieres eliminar el cambio del minuto ${modalState.modalEliminarCambio.incidencia.minuto}?`
                    : '¿Estás seguro que quieres eliminar este cambio?'}
                itemName={modalState.modalEliminarCambio.incidencia 
                    ? `Cambio: ${modalState.modalEliminarCambio.incidencia.jugador_sale_nombre || ''} → ${modalState.modalEliminarCambio.incidencia.jugador_entra_nombre || ''}`
                    : undefined}
                onConfirm={handleConfirmarEliminarCambio}
                error={null}
            />

            {/* Modal de confirmación de eliminación de incidencia */}
            <ConfirmDeleteIncidentModal
                isOpen={modalState.modalEliminarIncidencia.isOpen}
                onClose={modalState.cerrarModalEliminarIncidencia}
                tipoIncidencia={modalState.modalEliminarIncidencia.incidencia?.tipo || ''}
                onConfirm={handleConfirmarEliminarIncidencia}
                isLoading={false}
            />
        </>
    );
};

export default JugadoresTabsUnified;

