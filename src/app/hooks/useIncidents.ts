import { useState, useMemo } from 'react';
import { IncidenciaPartido, Partido } from '../types/partido';

interface UseIncidentsLogicProps {
    incidencias: IncidenciaPartido[];
    partido: Partido;
}

export const useIncidentsLogic = ({ incidencias, partido }: UseIncidentsLogicProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [incidenciaAEliminar, setIncidenciaAEliminar] = useState<IncidenciaPartido | null>(null);

    const incidenciasSeguras = incidencias || [];

    const incidenciasAgrupadas = useMemo(() => {
        const grupos: Array<{
            tipo: 'gol' | 'incidencia';
            gol?: IncidenciaPartido;
            asistencia?: IncidenciaPartido;
            incidencia?: IncidenciaPartido;
            id: string;
            segundaAmarillaRelacionada?: IncidenciaPartido;
            rojaRelacionada?: IncidenciaPartido;
            esDobleAmarilla?: boolean;
            dobleAmarillaData?: {
                primeraAmarilla: IncidenciaPartido;
                segundaAmarilla: IncidenciaPartido;
                roja: IncidenciaPartido;
            };
        }> = [];

        const goles = incidenciasSeguras.filter(inc => inc.tipo === 'gol');
        const asistencias = incidenciasSeguras.filter(inc => inc.tipo === 'asistencia');
        const otrasIncidencias = incidenciasSeguras.filter(inc => inc.tipo !== 'gol' && inc.tipo !== 'asistencia');

        // Detectar doble amarilla: 2 amarillas + 1 roja/doble_amarilla del mismo jugador
        const amarillasPorJugador = new Map<number, IncidenciaPartido[]>();
        const rojasPorJugador = new Map<number, IncidenciaPartido[]>();
        
        otrasIncidencias.forEach(inc => {
            if (inc.tipo === 'amarilla' && inc.id_jugador) {
                if (!amarillasPorJugador.has(inc.id_jugador)) {
                    amarillasPorJugador.set(inc.id_jugador, []);
                }
                amarillasPorJugador.get(inc.id_jugador)!.push(inc);
            }
            // Incluir tanto 'roja' como 'doble_amarilla' como roja
            if ((inc.tipo === 'roja' || inc.tipo === 'doble_amarilla') && inc.id_jugador) {
                if (!rojasPorJugador.has(inc.id_jugador)) {
                    rojasPorJugador.set(inc.id_jugador, []);
                }
                rojasPorJugador.get(inc.id_jugador)!.push(inc);
            }
        });

        // Identificar doble amarilla
        const dobleAmarillaMap = new Map<number, {
            primeraAmarilla: IncidenciaPartido;
            segundaAmarilla: IncidenciaPartido;
            roja: IncidenciaPartido;
        }>();

        amarillasPorJugador.forEach((amarillas, idJugador) => {
            if (amarillas.length === 2) {
                const rojas = rojasPorJugador.get(idJugador) || [];
                if (rojas.length > 0) {
                    const amarillasOrdenadas = [...amarillas].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));
                    const rojaRelacionada = rojas.find(r => 
                        (r.minuto || 0) >= (amarillasOrdenadas[1].minuto || 0)
                    ) || rojas[0];
                    
                    dobleAmarillaMap.set(idJugador, {
                        primeraAmarilla: amarillasOrdenadas[0],
                        segundaAmarilla: amarillasOrdenadas[1],
                        roja: rojaRelacionada
                    });
                }
            }
        });

        goles.forEach(gol => {
            const asistenciaAsociada = asistencias.find(asist => asist.id_gol === gol.id);
            grupos.push({
                tipo: 'gol',
                gol,
                asistencia: asistenciaAsociada,
                id: `gol-${gol.id}`
            });
        });

        otrasIncidencias.forEach(inc => {
            const dobleAmarilla = inc.id_jugador ? dobleAmarillaMap.get(inc.id_jugador) : null;
            const esSegundaAmarilla = dobleAmarilla && inc.id === dobleAmarilla.segundaAmarilla.id;
            const esRojaDobleAmarilla = dobleAmarilla && inc.id === dobleAmarilla.roja.id;
            
            // En vista usuario: mostrar segunda amarilla con roja/doble_amarilla, ocultar la roja/doble_amarilla individual
            if (esRojaDobleAmarilla) {
                return; // No agregar la roja/doble_amarilla individual, se mostrará con la segunda amarilla
            }
            
            grupos.push({
                tipo: 'incidencia',
                incidencia: inc,
                id: `inc-${inc.id}`,
                // Siempre pasar la roja relacionada cuando es la segunda amarilla
                segundaAmarillaRelacionada: esSegundaAmarilla ? dobleAmarilla!.roja : undefined,
                rojaRelacionada: esRojaDobleAmarilla ? dobleAmarilla!.segundaAmarilla : undefined,
                esDobleAmarilla: esSegundaAmarilla || esRojaDobleAmarilla,
                dobleAmarillaData: dobleAmarilla || undefined
            });
        });

        return grupos.sort((a, b) => {
            const minutoA = a.gol?.minuto || a.incidencia?.minuto || 0;
            const minutoB = b.gol?.minuto || b.incidencia?.minuto || 0;
            return minutoA - minutoB;
        });
    }, [incidenciasSeguras]);

    const handleOpenDeleteModal = (incidencia: IncidenciaPartido) => {
        setIncidenciaAEliminar(incidencia);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setIncidenciaAEliminar(null);
    };

    return {
        incidenciasAgrupadas,
        showDeleteModal,
        incidenciaAEliminar,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
    };
};