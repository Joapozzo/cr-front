import { useState, useCallback } from 'react';
import { IncidenciaPartido } from '@/app/types/partido';
import { JugadorPlantel } from '@/app/types/partido';
import { ModalCambioState, ModalEditarCambioState, ModalEliminarCambioState, ModalEliminarIncidenciaState } from '../types';

export const useModalState = () => {
    const [modalCambio, setModalCambio] = useState<ModalCambioState>({
        isOpen: false,
        jugadorSale: null,
        equipo: 'local'
    });

    const [modalEditarCambio, setModalEditarCambio] = useState<ModalEditarCambioState>({
        isOpen: false,
        cambioId: null,
        jugadorSaleId: null,
        minuto: null,
        equipo: 'local'
    });

    const [modalEliminarCambio, setModalEliminarCambio] = useState<ModalEliminarCambioState>({
        isOpen: false,
        cambioId: null,
        incidencia: null
    });

    const [modalEliminarIncidencia, setModalEliminarIncidencia] = useState<ModalEliminarIncidenciaState>({
        isOpen: false,
        incidencia: null
    });

    const abrirModalCambio = useCallback((jugador: JugadorPlantel, equipo: 'local' | 'visita') => {
        setModalCambio({
            isOpen: true,
            jugadorSale: jugador,
            equipo
        });
    }, []);

    const cerrarModalCambio = useCallback(() => {
        setModalCambio({ isOpen: false, jugadorSale: null, equipo: 'local' });
    }, []);

    const abrirModalEditarCambio = useCallback((
        cambioId: number,
        jugadorSaleId: number,
        minuto: number,
        equipo: 'local' | 'visita'
    ) => {
        setModalEditarCambio({
            isOpen: true,
            cambioId,
            jugadorSaleId,
            minuto,
            equipo
        });
    }, []);

    const cerrarModalEditarCambio = useCallback(() => {
        setModalEditarCambio({ isOpen: false, cambioId: null, jugadorSaleId: null, minuto: null, equipo: 'local' });
    }, []);

    const abrirModalEliminarCambio = useCallback((cambioId: number, incidencia: IncidenciaPartido) => {
        setModalEliminarCambio({
            isOpen: true,
            cambioId,
            incidencia
        });
    }, []);

    const cerrarModalEliminarCambio = useCallback(() => {
        setModalEliminarCambio({ isOpen: false, cambioId: null, incidencia: null });
    }, []);

    const abrirModalEliminarIncidencia = useCallback((incidencia: IncidenciaPartido) => {
        setModalEliminarIncidencia({
            isOpen: true,
            incidencia
        });
    }, []);

    const cerrarModalEliminarIncidencia = useCallback(() => {
        setModalEliminarIncidencia({ isOpen: false, incidencia: null });
    }, []);

    return {
        modalCambio,
        modalEditarCambio,
        modalEliminarCambio,
        modalEliminarIncidencia,
        abrirModalCambio,
        cerrarModalCambio,
        abrirModalEditarCambio,
        cerrarModalEditarCambio,
        abrirModalEliminarCambio,
        cerrarModalEliminarCambio,
        abrirModalEliminarIncidencia,
        cerrarModalEliminarIncidencia,
        setModalCambio,
        setModalEditarCambio,
        setModalEliminarCambio,
        setModalEliminarIncidencia
    };
};

