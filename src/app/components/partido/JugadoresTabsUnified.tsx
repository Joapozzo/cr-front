import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Star } from 'lucide-react';
import { IncidenciaPartido, JugadorPlantel, EstadoPartido, JugadorDestacado } from '@/app/types/partido';
import IncidenciaRow from './Incidents';
import JugadorRow from './JugadorRow';
import { calcularAccionesJugador, esJugadorDestacado } from '@/app/utils/formacion.helper';
import FormacionesCardSkeleton from '../skeletons/FormacionesCardSkeleton';
import CambioJugadorModal from './CambioJugadorModal';
import { useCambiosPorPartido, useCrearCambioJugador, useEditarCambioJugador, useEliminarCambioJugador } from '@/app/hooks/useCambiosJugador';
import { useFormaciones } from '@/app/hooks/useFormaciones';
import { DeleteModal, ConfirmDeleteIncidentModal } from '../modals/ModalAdmin';
import toast from 'react-hot-toast';

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
    cambios?: Array<{
        id_cambio: number;
        id_partido: number;
        tipo_cambio: 'ENTRADA' | 'SALIDA';
        minuto: number;
        tiempo: string | null;
        id_jugador_sale: number | null;
        id_jugador_entra: number | null;
        id_equipo: number | null;
        jugadorSale?: {
            id_jugador: number;
            nombre: string;
            apellido: string;
        } | null;
        jugadorEntra?: {
            id_jugador: number;
            nombre: string;
            apellido: string;
        } | null;
    }>;
}

type TabType = 'local' | 'incidencias' | 'visita';

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
    tipoFutbol = 11, // Default 11 vs 11
    cambios: cambiosProp,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('incidencias');
    const [modalCambio, setModalCambio] = useState<{
        isOpen: boolean;
        jugadorSale: JugadorPlantel | null;
        equipo: 'local' | 'visita';
    }>({
        isOpen: false,
        jugadorSale: null,
        equipo: 'local'
    });
    const [modalEditarCambio, setModalEditarCambio] = useState<{
        isOpen: boolean;
        cambioId: number | null;
        jugadorSaleId: number | null;
        minuto: number | null;
        equipo: 'local' | 'visita';
    }>({
        isOpen: false,
        cambioId: null,
        jugadorSaleId: null,
        minuto: null,
        equipo: 'local'
    });
    const [modalEliminarCambio, setModalEliminarCambio] = useState<{
        isOpen: boolean;
        cambioId: number | null;
        incidencia: IncidenciaPartido | null;
    }>({
        isOpen: false,
        cambioId: null,
        incidencia: null
    });
    const [modalEliminarIncidencia, setModalEliminarIncidencia] = useState<{
        isOpen: boolean;
        incidencia: IncidenciaPartido | null;
    }>({
        isOpen: false,
        incidencia: null
    });

    const esPlanillero = mode === 'planillero';
    const permitirAcciones = esPlanillero && ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido || '');

    // Hooks para cambios y formaciones (también en modo view para mostrar cambios)
    // Si vienen cambios como prop (modo usuario), usarlos directamente
    // Si no, obtenerlos del hook (modo planillero)
    const { data: cambiosData } = useCambiosPorPartido(idPartido || 0, {
        enabled: !!idPartido && !cambiosProp // Solo usar hook si no hay cambios como prop
    });
    
    // Normalizar cambios del backend (formato simplificado) al formato esperado
    const cambiosNormalizados = useMemo(() => {
        if (cambiosProp && cambiosProp.length > 0) {
            return cambiosProp.map(cambio => ({
                id_cambio: cambio.id_cambio,
                id_partido: cambio.id_partido,
                id_jugador_entra: cambio.id_jugador_entra,
                id_jugador_sale: cambio.id_jugador_sale,
                minuto: cambio.minuto,
                tiempo: cambio.tiempo,
                tipo_cambio: cambio.tipo_cambio,
                registrado_por: null,
                registrado_en: '',
                observaciones: null,
                jugadorEntra: cambio.jugadorEntra ? {
                    id_jugador: cambio.jugadorEntra.id_jugador,
                    usuario: {
                        nombre: cambio.jugadorEntra.nombre,
                        apellido: cambio.jugadorEntra.apellido
                    }
                } : null,
                jugadorSale: cambio.jugadorSale ? {
                    id_jugador: cambio.jugadorSale.id_jugador,
                    usuario: {
                        nombre: cambio.jugadorSale.nombre,
                        apellido: cambio.jugadorSale.apellido
                    }
                } : null,
                registrador: null
            }));
        }
        return cambiosData?.cambios || [];
    }, [cambiosProp, cambiosData?.cambios]);
    
    const cambios = cambiosNormalizados;

    const { mutateAsync: crearCambioAsync, isPending: isCreandoCambio } = useCrearCambioJugador();
    const { mutateAsync: editarCambioAsync, isPending: isEditandoCambio } = useEditarCambioJugador();
    const { mutateAsync: eliminarCambioAsync } = useEliminarCambioJugador();
    const { marcarEnCanchaAsync, desmarcarEnCanchaAsync } = useFormaciones();

    // Calcular jugadores en cancha por equipo
    const jugadoresEnCanchaLocal = useMemo(() => {
        return equipoLocal.jugadores.filter(j => j.en_cancha && j.dorsal).length;
    }, [equipoLocal.jugadores]);

    const jugadoresEnCanchaVisita = useMemo(() => {
        return equipoVisita.jugadores.filter(j => j.en_cancha && j.dorsal).length;
    }, [equipoVisita.jugadores]);

    // Convertir cambios a formato IncidenciaPartido y agrupar SALIDA + ENTRADA del mismo minuto
    const incidenciasCambios = useMemo<IncidenciaPartido[]>(() => {
        if (!cambios || cambios.length === 0) return [];

        // Agrupar cambios por minuto y equipo
        const cambiosAgrupados = new Map<string, typeof cambios>();
        
        cambios.forEach(cambio => {
            // Determinar equipo del cambio
            // Primero intentar usar id_equipo si viene del backend (modo usuario)
            let equipoId: number | null = null;
            if ((cambio as any).id_equipo) {
                equipoId = (cambio as any).id_equipo;
            } else if (cambio.id_jugador_sale) {
                const jugador = equipoLocal.jugadores.find(j => j.id_jugador === cambio.id_jugador_sale) 
                    || equipoVisita.jugadores.find(j => j.id_jugador === cambio.id_jugador_sale);
                equipoId = jugador?.id_equipo || null;
            } else if (cambio.id_jugador_entra) {
                const jugador = equipoLocal.jugadores.find(j => j.id_jugador === cambio.id_jugador_entra) 
                    || equipoVisita.jugadores.find(j => j.id_jugador === cambio.id_jugador_entra);
                equipoId = jugador?.id_equipo || null;
            }

            // Crear clave única: minuto-equipo-tiempo
            const clave = `${cambio.minuto}-${equipoId}-${cambio.tiempo || ''}`;
            
            if (!cambiosAgrupados.has(clave)) {
                cambiosAgrupados.set(clave, []);
            }
            cambiosAgrupados.get(clave)!.push(cambio);
        });

        // Convertir grupos a incidencias
        const incidencias: IncidenciaPartido[] = [];

        cambiosAgrupados.forEach((grupoCambios) => {
            // Buscar SALIDA y ENTRADA en el mismo minuto
            const salida = grupoCambios.find(c => c.tipo_cambio === 'SALIDA' && c.id_jugador_sale);
            const entrada = grupoCambios.find(c => c.tipo_cambio === 'ENTRADA' && c.id_jugador_entra);

            // Determinar equipo
            // Primero intentar usar id_equipo si viene del backend (modo usuario)
            let equipoId: number | null = null;
            const cambioConEquipo = salida || entrada || grupoCambios[0];
            if ((cambioConEquipo as any).id_equipo) {
                equipoId = (cambioConEquipo as any).id_equipo;
            } else if (salida) {
                const jugador = equipoLocal.jugadores.find(j => j.id_jugador === salida.id_jugador_sale) 
                    || equipoVisita.jugadores.find(j => j.id_jugador === salida.id_jugador_sale);
                equipoId = jugador?.id_equipo || null;
            } else if (entrada) {
                const jugador = equipoLocal.jugadores.find(j => j.id_jugador === entrada.id_jugador_entra) 
                    || equipoVisita.jugadores.find(j => j.id_jugador === entrada.id_jugador_entra);
                equipoId = jugador?.id_equipo || null;
            }

            // Si hay SALIDA y ENTRADA, crear una sola incidencia agrupada
            if (salida && entrada) {
                incidencias.push({
                    tipo: 'cambio' as const,
                    id: entrada.id_cambio, // Usar el ID de la entrada como principal
                    id_jugador: entrada.id_jugador_entra,
                    id_equipo: equipoId,
                    minuto: entrada.minuto,
                    tiempo: entrada.tiempo as '1T' | '2T' | 'ET' | 'PEN' | undefined,
                    nombre: entrada.jugadorEntra?.usuario?.nombre || '',
                    apellido: entrada.jugadorEntra?.usuario?.apellido || '',
                    jugador_sale_id: salida.id_jugador_sale,
                    jugador_sale_nombre: salida.jugadorSale?.usuario
                        ? `${salida.jugadorSale.usuario.nombre.charAt(0)}. ${salida.jugadorSale.usuario.apellido.toUpperCase()}`
                        : undefined,
                    jugador_entra_id: entrada.id_jugador_entra,
                    jugador_entra_nombre: entrada.jugadorEntra?.usuario
                        ? `${entrada.jugadorEntra.usuario.nombre.charAt(0)}. ${entrada.jugadorEntra.usuario.apellido.toUpperCase()}`
                        : undefined,
                    observaciones: entrada.observaciones || salida.observaciones || undefined,
                });
            } else {
                // Si solo hay SALIDA o solo ENTRADA, crear incidencia individual
                const cambioUnico = salida || entrada || grupoCambios[0];
                const jugadorSale = cambioUnico.jugadorSale;
                const jugadorEntra = cambioUnico.jugadorEntra;

                incidencias.push({
                    tipo: 'cambio' as const,
                    id: cambioUnico.id_cambio,
                    id_jugador: cambioUnico.id_jugador_entra || cambioUnico.id_jugador_sale || null,
                    id_equipo: equipoId,
                    minuto: cambioUnico.minuto,
                    tiempo: cambioUnico.tiempo as '1T' | '2T' | 'ET' | 'PEN' | undefined,
                    nombre: jugadorEntra?.usuario?.nombre || jugadorSale?.usuario?.nombre || '',
                    apellido: jugadorEntra?.usuario?.apellido || jugadorSale?.usuario?.apellido || '',
                    jugador_sale_id: cambioUnico.id_jugador_sale,
                    jugador_sale_nombre: jugadorSale?.usuario
                        ? `${jugadorSale.usuario.nombre.charAt(0)}. ${jugadorSale.usuario.apellido.toUpperCase()}`
                        : undefined,
                    jugador_entra_id: cambioUnico.id_jugador_entra,
                    jugador_entra_nombre: jugadorEntra?.usuario
                        ? `${jugadorEntra.usuario.nombre.charAt(0)}. ${jugadorEntra.usuario.apellido.toUpperCase()}`
                        : undefined,
                    observaciones: cambioUnico.observaciones || undefined,
                });
            }
        });

        return incidencias;
    }, [cambios, equipoLocal.jugadores, equipoVisita.jugadores]);

    // Procesar cambios para calcular minuto_entrada y minuto_salida de cada jugador
    const jugadoresConCambios = useMemo(() => {
        if (!cambios || cambios.length === 0) {
            return {
                local: equipoLocal.jugadores,
                visita: equipoVisita.jugadores
            };
        }

        // Crear mapas de cambios por jugador
        const cambiosPorJugador = new Map<number, { entrada?: number; salida?: number }>();
        
        cambios.forEach(cambio => {
            if (cambio.tipo_cambio === 'ENTRADA' && cambio.id_jugador_entra) {
                const jugadorId = cambio.id_jugador_entra;
                if (!cambiosPorJugador.has(jugadorId)) {
                    cambiosPorJugador.set(jugadorId, {});
                }
                const cambiosJugador = cambiosPorJugador.get(jugadorId)!;
                if (!cambiosJugador.entrada || cambio.minuto < cambiosJugador.entrada) {
                    cambiosJugador.entrada = cambio.minuto;
                }
            }
            
            if (cambio.tipo_cambio === 'SALIDA' && cambio.id_jugador_sale) {
                const jugadorId = cambio.id_jugador_sale;
                if (!cambiosPorJugador.has(jugadorId)) {
                    cambiosPorJugador.set(jugadorId, {});
                }
                const cambiosJugador = cambiosPorJugador.get(jugadorId)!;
                if (!cambiosJugador.salida || cambio.minuto > cambiosJugador.salida) {
                    cambiosJugador.salida = cambio.minuto;
                }
            }
        });

        // Actualizar jugadores con minuto_entrada y minuto_salida
        const actualizarJugadores = (jugadores: JugadorPlantel[]) => {
            return jugadores.map(jugador => {
                const cambiosJugador = cambiosPorJugador.get(jugador.id_jugador);
                if (cambiosJugador) {
                    const minutoEntrada = cambiosJugador.entrada ?? jugador.minuto_entrada ?? null;
                    const minutoSalida = cambiosJugador.salida ?? jugador.minuto_salida ?? null;
                    
                    // Determinar si está en cancha:
                    // - Si tiene entrada y no tiene salida, está en cancha
                    // - Si no tiene entrada ni salida, mantener el estado original (probablemente titular)
                    const enCancha = minutoEntrada !== null && minutoEntrada !== undefined
                        ? (minutoSalida === null || minutoSalida === undefined)
                        : (jugador.en_cancha ?? false);
                    
                    return {
                        ...jugador,
                        minuto_entrada: minutoEntrada,
                        minuto_salida: minutoSalida,
                        en_cancha: enCancha
                    };
                }
                return jugador;
            });
        };

        return {
            local: actualizarJugadores(equipoLocal.jugadores),
            visita: actualizarJugadores(equipoVisita.jugadores)
        };
    }, [cambios, equipoLocal.jugadores, equipoVisita.jugadores]);

    // Crear lista de incidencias con asistencias expandidas para calcular acciones
    const incidenciasParaAcciones = useMemo(() => {
        const incidenciasExpandidas: IncidenciaPartido[] = [];
        
        incidencias.forEach(inc => {
            // Agregar la incidencia original
            incidenciasExpandidas.push(inc);
            
            // Si es un gol con asistencias dentro (modo usuario), crear objetos de asistencia separados
            if (inc.tipo === 'gol') {
                // Acceder a asistencias usando any para evitar problemas de tipo
                const golConAsistencias = inc as any;
                if (golConAsistencias.asistencias && Array.isArray(golConAsistencias.asistencias) && golConAsistencias.asistencias.length > 0) {
                    golConAsistencias.asistencias.forEach((asistenciaData: { id_jugador: number; nombre: string; apellido: string; id_asistencia?: number }) => {
                        incidenciasExpandidas.push({
                            tipo: 'asistencia',
                            id: asistenciaData.id_asistencia || inc.id,
                            id_jugador: asistenciaData.id_jugador,
                            id_equipo: inc.id_equipo,
                            minuto: inc.minuto,
                            tiempo: inc.tiempo,
                            nombre: asistenciaData.nombre || '',
                            apellido: asistenciaData.apellido || '',
                            id_gol: inc.id
                        });
                    });
                }
            }
        });
        
        // Debug temporal
        if (mode === 'view') {
            const golesConAsistencias = incidencias.filter(i => i.tipo === 'gol' && (i as any).asistencias);
            if (golesConAsistencias.length > 0) {
                console.log('Goles con asistencias encontrados:', golesConAsistencias.length);
                golesConAsistencias.forEach(gol => {
                    console.log('Gol:', gol.id, 'Asistencias:', (gol as any).asistencias);
                });
            }
            const asistenciasExpandidas = incidenciasExpandidas.filter(i => i.tipo === 'asistencia');
            if (asistenciasExpandidas.length > 0) {
                console.log('Asistencias expandidas:', asistenciasExpandidas);
            }
        }
        
        return incidenciasExpandidas;
    }, [incidencias, mode]);

    // Procesar incidencias: separar asistencias, asociarlas con goles, combinar con cambios y agrupar por tiempos
    const incidenciasProcesadas = useMemo(() => {
        // Separar asistencias (objetos con tipo 'asistencia')
        const asistencias = incidencias.filter(i => i.tipo === 'asistencia');
        const incidenciasSinAsistencias = incidencias.filter(i => i.tipo !== 'asistencia');

        // Crear map de asistencias por id_gol (para asistencias que vienen como objetos separados)
        const asistenciasPorGol = new Map<number, IncidenciaPartido>();
        asistencias.forEach(asistencia => {
            if (asistencia.id_gol) {
                asistenciasPorGol.set(asistencia.id_gol, asistencia);
            }
        });

        // Procesar goles que tienen asistencias dentro del objeto (modo usuario)
        // Si un gol tiene un array 'asistencias', convertir la primera asistencia al formato esperado
        incidenciasSinAsistencias
            .filter(i => i.tipo === 'gol')
            .forEach(gol => {
                // Verificar si el gol tiene asistencias como array (formato del backend para modo usuario)
                const golConAsistencias = gol as IncidenciaPartido & { asistencias?: Array<{ id_jugador: number; nombre: string; apellido: string; id_asistencia?: number }> };
                if (golConAsistencias.asistencias && Array.isArray(golConAsistencias.asistencias) && golConAsistencias.asistencias.length > 0) {
                    // Tomar la primera asistencia (generalmente hay solo una)
                    const asistenciaData = golConAsistencias.asistencias[0];
                    const asistenciaFormateada: IncidenciaPartido = {
                        tipo: 'asistencia',
                        id: asistenciaData.id_asistencia || gol.id, // Usar id_asistencia si existe, sino el id del gol
                        id_jugador: asistenciaData.id_jugador,
                        id_equipo: gol.id_equipo,
                        minuto: gol.minuto,
                        tiempo: gol.tiempo,
                        nombre: asistenciaData.nombre || '',
                        apellido: asistenciaData.apellido || '',
                        id_gol: gol.id
                    };
                    asistenciasPorGol.set(gol.id, asistenciaFormateada);
                }
            });

        // Combinar incidencias con cambios
        const todasIncidencias = [
            ...incidenciasSinAsistencias,
            ...incidenciasCambios
        ];

        // Detectar doble amarilla: 2 amarillas + 1 roja/doble_amarilla del mismo jugador
        // Mapa para rastrear amarillas por jugador
        const amarillasPorJugador = new Map<number, IncidenciaPartido[]>();
        const rojasPorJugador = new Map<number, IncidenciaPartido[]>();
        
        todasIncidencias.forEach(inc => {
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

        // Identificar doble amarilla: jugador con 2 amarillas y 1 roja/doble_amarilla
        const dobleAmarillaMap = new Map<number, {
            primeraAmarilla: IncidenciaPartido;
            segundaAmarilla: IncidenciaPartido;
            roja: IncidenciaPartido;
        }>();

        amarillasPorJugador.forEach((amarillas, idJugador) => {
            if (amarillas.length === 2) {
                const rojas = rojasPorJugador.get(idJugador) || [];
                if (rojas.length > 0) {
                    // Ordenar amarillas por minuto
                    const amarillasOrdenadas = [...amarillas].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));
                    // Tomar la roja/doble_amarilla más cercana a la segunda amarilla
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

        // Asociar asistencias con goles y marcar doble amarilla
        const incidenciasOrdenadas = todasIncidencias
            .map(incidencia => {
                const dobleAmarilla = incidencia.id_jugador ? dobleAmarillaMap.get(incidencia.id_jugador) : null;
                const esSegundaAmarilla = dobleAmarilla && incidencia.id === dobleAmarilla.segundaAmarilla.id;
                const esRojaDobleAmarilla = dobleAmarilla && incidencia.id === dobleAmarilla.roja.id;
                
                return {
                    incidencia,
                    asistenciaRelacionada: incidencia.tipo === 'gol'
                        ? asistenciasPorGol.get(incidencia.id)
                        : undefined,
                    // Agrupar segunda amarilla con roja (tanto en planillero como en usuario)
                    segundaAmarillaRelacionada: esSegundaAmarilla ? dobleAmarilla.roja : undefined,
                    rojaRelacionada: esRojaDobleAmarilla ? dobleAmarilla.segundaAmarilla : undefined,
                    esDobleAmarilla: esSegundaAmarilla || esRojaDobleAmarilla,
                    dobleAmarillaData: dobleAmarilla
                };
            })
            .sort((a, b) => (b.incidencia.minuto || 0) - (a.incidencia.minuto || 0)); // Orden inverso

        // Función para inferir tiempo si no está disponible
        const inferirTiempo = (incidencia: IncidenciaPartido): '1T' | '2T' | 'ET' | 'PEN' => {
            if (incidencia.tiempo) {
                return incidencia.tiempo;
            }
            
            // Inferir del minuto (generalmente primer tiempo hasta 45, segundo tiempo después)
            const minuto = incidencia.minuto || 0;
            if (minuto <= 45) {
                return '1T';
            }
            return '2T';
        };

        // Agrupar por tiempos (orden inverso: más reciente arriba)
        // Estructura: PARTIDO TERMINADO -> ST incidencias -> ST TERMINADO -> ST -> PT incidencias -> PT TERMINADO -> PT
        const grupos: Array<{
            tipo: 'separador' | 'incidencia';
            tiempo?: '1T' | '2T' | 'ET' | 'PEN';
            estadoPartido?: EstadoPartido;
            esTerminado?: boolean;
            incidencia?: IncidenciaPartido;
            asistenciaRelacionada?: IncidenciaPartido;
            segundaAmarillaRelacionada?: IncidenciaPartido;
            rojaRelacionada?: IncidenciaPartido;
            esDobleAmarilla?: boolean;
            dobleAmarillaData?: {
                primeraAmarilla: IncidenciaPartido;
                segundaAmarilla: IncidenciaPartido;
                roja: IncidenciaPartido;
            };
        }> = [];

        // Determinar si los tiempos están terminados según el estado
        const primerTiempoTerminado = estadoPartido === 'E' || estadoPartido === 'C2' || estadoPartido === 'T' || estadoPartido === 'F';
        const segundoTiempoTerminado = estadoPartido === 'T' || estadoPartido === 'F';

        // Agregar "PARTIDO TERMINADO" al principio (arriba) si el partido está terminado
        if (estadoPartido === 'T' || estadoPartido === 'F') {
            grupos.push({
                tipo: 'separador',
                tiempo: undefined,
                estadoPartido,
                esTerminado: true
            });
        }

        // Separar incidencias por tiempo
        const incidencias2T: Array<{ 
            incidencia: IncidenciaPartido; 
            asistenciaRelacionada?: IncidenciaPartido;
            segundaAmarillaRelacionada?: IncidenciaPartido;
            rojaRelacionada?: IncidenciaPartido;
            esDobleAmarilla?: boolean;
            dobleAmarillaData?: {
                primeraAmarilla: IncidenciaPartido;
                segundaAmarilla: IncidenciaPartido;
                roja: IncidenciaPartido;
            };
        }> = [];
        const incidencias1T: Array<{ 
            incidencia: IncidenciaPartido; 
            asistenciaRelacionada?: IncidenciaPartido;
            segundaAmarillaRelacionada?: IncidenciaPartido;
            rojaRelacionada?: IncidenciaPartido;
            esDobleAmarilla?: boolean;
            dobleAmarillaData?: {
                primeraAmarilla: IncidenciaPartido;
                segundaAmarilla: IncidenciaPartido;
                roja: IncidenciaPartido;
            };
        }> = [];

        incidenciasOrdenadas.forEach(item => {
            const tiempo = inferirTiempo(item.incidencia);
            if (tiempo === '2T' || tiempo === 'ET' || tiempo === 'PEN') {
                incidencias2T.push({ 
                    incidencia: item.incidencia, 
                    asistenciaRelacionada: item.asistenciaRelacionada,
                    segundaAmarillaRelacionada: item.segundaAmarillaRelacionada,
                    rojaRelacionada: item.rojaRelacionada,
                    esDobleAmarilla: item.esDobleAmarilla || undefined,
                    dobleAmarillaData: item.dobleAmarillaData || undefined
                });
            } else {
                incidencias1T.push({ 
                    incidencia: item.incidencia, 
                    asistenciaRelacionada: item.asistenciaRelacionada,
                    segundaAmarillaRelacionada: item.segundaAmarillaRelacionada,
                    rojaRelacionada: item.rojaRelacionada,
                    esDobleAmarilla: item.esDobleAmarilla || undefined,
                    dobleAmarillaData: item.dobleAmarillaData || undefined
                });
            }
        });

        // SEGUNDO TIEMPO: Orden correcto
        // 1. Separador "ST TERMINADO" (si está terminado)
        if (incidencias2T.length > 0 && segundoTiempoTerminado) {
            grupos.push({
                tipo: 'separador',
                tiempo: '2T',
                estadoPartido,
                esTerminado: true
            });
        }

        // 2. Incidencias del segundo tiempo
        incidencias2T.forEach((item) => {
            // Si es la roja o doble_amarilla de doble amarilla, no agregarla (se mostrará junto con la segunda amarilla)
            if (item.esDobleAmarilla && (item.incidencia.tipo === 'roja' || item.incidencia.tipo === 'doble_amarilla')) {
                return; // Saltar la roja/doble_amarilla, se mostrará junto con la segunda amarilla
            }
            
            grupos.push({
                tipo: 'incidencia',
                incidencia: item.incidencia,
                asistenciaRelacionada: item.asistenciaRelacionada,
                segundaAmarillaRelacionada: item.segundaAmarillaRelacionada,
                rojaRelacionada: item.rojaRelacionada,
                esDobleAmarilla: item.esDobleAmarilla,
                dobleAmarillaData: item.dobleAmarillaData
            });
        });

        // 3. Separador "ST" (inicio del segundo tiempo)
        if (incidencias2T.length > 0) {
            grupos.push({
                tipo: 'separador',
                tiempo: '2T',
                estadoPartido,
                esTerminado: false
            });
        }

        // PRIMER TIEMPO: Orden correcto
        // 1. Separador "PT TERMINADO" (si está terminado)
        if (incidencias1T.length > 0 && primerTiempoTerminado) {
            grupos.push({
                tipo: 'separador',
                tiempo: '1T',
                estadoPartido,
                esTerminado: true
            });
        }

        // 2. Incidencias del primer tiempo
        incidencias1T.forEach((item) => {
            // Si es la roja o doble_amarilla de doble amarilla, no agregarla (se mostrará junto con la segunda amarilla)
            if (item.esDobleAmarilla && (item.incidencia.tipo === 'roja' || item.incidencia.tipo === 'doble_amarilla')) {
                return; // Saltar la roja/doble_amarilla, se mostrará junto con la segunda amarilla
            }
            
            grupos.push({
                tipo: 'incidencia',
                incidencia: item.incidencia,
                asistenciaRelacionada: item.asistenciaRelacionada,
                segundaAmarillaRelacionada: item.segundaAmarillaRelacionada,
                rojaRelacionada: item.rojaRelacionada,
                esDobleAmarilla: item.esDobleAmarilla,
                dobleAmarillaData: item.dobleAmarillaData
            });
        });

        // 3. Separador "PT" (inicio del primer tiempo)
        if (incidencias1T.length > 0) {
            grupos.push({
                tipo: 'separador',
                tiempo: '1T',
                estadoPartido,
                esTerminado: false
            });
        }

        return grupos;
    }, [incidencias, incidenciasCambios, estadoPartido]);

    // Estado de loading por jugador
    const [jugadoresCargando, setJugadoresCargando] = useState<Set<number>>(new Set());

    // Handler para toggle en cancha
    const handleToggleEnCancha = useCallback(async (jugadorId: number, equipoId: number) => {
        if (!idPartido || !idCategoriaEdicion) {
            toast.error('Faltan datos del partido');
            return;
        }

        const jugador = [...equipoLocal.jugadores, ...equipoVisita.jugadores].find(j => j.id_jugador === jugadorId);
        if (!jugador) return;

        const enCancha = jugador.en_cancha ?? false;
        const jugadoresEnCancha = equipoId === equipoLocal.id_equipo 
            ? jugadoresEnCanchaLocal 
            : jugadoresEnCanchaVisita;

        // Marcar como cargando solo este jugador
        setJugadoresCargando(prev => new Set(prev).add(jugadorId));

        try {
            if (!enCancha) {
                // Validar límite
                if (jugadoresEnCancha >= tipoFutbol) {
                    toast.error(`Máximo ${tipoFutbol} jugadores en cancha`);
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                    return;
                }

                // Validar que tenga dorsal
                if (!jugador.dorsal) {
                    toast.error('El jugador debe tener dorsal asignado');
                    return;
                }

                await marcarEnCanchaAsync({
                    idPartido,
                    enCanchaData: {
                        id_categoria_edicion: idCategoriaEdicion,
                        id_equipo: equipoId,
                        id_jugador: jugadorId
                    }
                });
                toast.success('Jugador marcado en cancha');
            } else {
                await desmarcarEnCanchaAsync({
                    idPartido,
                    idJugador: jugadorId,
                    desmarcarData: {
                        id_categoria_edicion: idCategoriaEdicion,
                        id_equipo: equipoId
                    }
                });
                toast.success('Jugador desmarcado de cancha');
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al cambiar estado';
            toast.error(errorMessage);
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        } finally {
            // Quitar de loading
            setJugadoresCargando(prev => {
                const nuevo = new Set(prev);
                nuevo.delete(jugadorId);
                return nuevo;
            });
        }
    }, [idPartido, idCategoriaEdicion, equipoLocal.jugadores, equipoVisita.jugadores, 
        jugadoresEnCanchaLocal, jugadoresEnCanchaVisita, tipoFutbol, 
        marcarEnCanchaAsync, desmarcarEnCanchaAsync, equipoLocal.id_equipo]);

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
        setModalCambio({
            isOpen: true,
            jugadorSale: jugador,
            equipo
        });
    }, [equipoLocal.jugadores, estadoPartido]);

    // Handler para confirmar cambio
    const handleConfirmarCambio = useCallback(async (
        jugadorEntraId: number,
        minuto: number
    ) => {
        if (!idPartido || !idCategoriaEdicion || !modalCambio.jugadorSale) return;

        // Validar estado del partido
        if (!['C1', 'E', 'C2', 'T'].includes(estadoPartido || '')) {
            toast.error('Solo se pueden realizar cambios durante el partido');
            return;
        }

        const equipoId = modalCambio.equipo === 'local' 
            ? equipoLocal.id_equipo 
            : equipoVisita.id_equipo;

        try {
            // Crear dos cambios: SALIDA del que sale y ENTRADA del que entra
            // Primero la salida
            await crearCambioAsync({
                idPartido,
                cambioData: {
                    id_categoria_edicion: idCategoriaEdicion,
                    id_equipo: equipoId,
                    tipo_cambio: 'SALIDA',
                    id_jugador: modalCambio.jugadorSale.id_jugador,
                    minuto
                }
            });

            // Luego la entrada
            await crearCambioAsync({
                idPartido,
                cambioData: {
                    id_categoria_edicion: idCategoriaEdicion,
                    id_equipo: equipoId,
                    tipo_cambio: 'ENTRADA',
                    id_jugador: jugadorEntraId,
                    minuto
                }
            });

            toast.success('Cambio registrado correctamente');
            setModalCambio({ isOpen: false, jugadorSale: null, equipo: 'local' });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al registrar cambio';
            toast.error(errorMessage);
        }
    }, [idPartido, idCategoriaEdicion, modalCambio, estadoPartido, equipoLocal.id_equipo, equipoVisita.id_equipo, crearCambioAsync]);

    // Handler para editar cambio
    const handleEditarCambio = useCallback(async (
        cambioId: number,
        jugadorSaleId: number,
        minuto: number
    ) => {
        if (!idPartido) return;

        try {
            await editarCambioAsync({
                idCambio: cambioId,
                idPartido,
                cambioData: {
                    minuto
                }
            });

            toast.success('Cambio actualizado correctamente');
            setModalEditarCambio({ isOpen: false, cambioId: null, jugadorSaleId: null, minuto: null, equipo: 'local' });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al actualizar cambio';
            toast.error(errorMessage);
        }
    }, [idPartido, editarCambioAsync]);

    // Handler para eliminar cambio
    const handleEliminarCambio = useCallback(async () => {
        if (!idPartido || !modalEliminarCambio.cambioId) return;

        try {
            await eliminarCambioAsync({
                idCambio: modalEliminarCambio.cambioId,
                idPartido
            });

            toast.success('Cambio eliminado correctamente');
            setModalEliminarCambio({ isOpen: false, cambioId: null, incidencia: null });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al eliminar cambio';
            toast.error(errorMessage);
            throw error;
        }
    }, [idPartido, modalEliminarCambio.cambioId, eliminarCambioAsync]);

    // Handler para abrir modal de edición
    const handleEditCambio = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo !== 'cambio') return;

        const equipo = incidencia.id_equipo === equipoLocal.id_equipo ? 'local' : 'visita';
        setModalEditarCambio({
            isOpen: true,
            cambioId: incidencia.id,
            jugadorSaleId: incidencia.jugador_sale_id || null,
            minuto: incidencia.minuto || null,
            equipo
        });
    }, [equipoLocal.id_equipo]);

    // Handler para abrir modal de eliminación
    const handleDeleteCambio = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo !== 'cambio') return;

        setModalEliminarCambio({
            isOpen: true,
            cambioId: incidencia.id,
            incidencia
        });
    }, []);

    // Handler para abrir modal de eliminación de incidencia
    const handleDeleteIncidencia = useCallback((incidencia: IncidenciaPartido) => {
        if (incidencia.tipo === 'cambio') {
            handleDeleteCambio(incidencia);
            return;
        }

        setModalEliminarIncidencia({
            isOpen: true,
            incidencia
        });
    }, [handleDeleteCambio]);

    // Handler para confirmar eliminación de incidencia
    const handleConfirmarEliminarIncidencia = useCallback(async () => {
        if (!modalEliminarIncidencia.incidencia || !onDeleteIncidencia) return;

        await onDeleteIncidencia(modalEliminarIncidencia.incidencia);
        // El modal se cierra automáticamente después de una eliminación exitosa
        setModalEliminarIncidencia({ isOpen: false, incidencia: null });
    }, [modalEliminarIncidencia.incidencia, onDeleteIncidencia]);

    const renderJugadores = (jugadores: JugadorPlantel[], equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' ? equipoLocal.id_equipo : equipoVisita.id_equipo;
        const jugadoresEnCancha = equipo === 'local' ? jugadoresEnCanchaLocal : jugadoresEnCanchaVisita;
        
        // Usar jugadores con cambios procesados en modo usuario
        const jugadoresAMostrar = mode === 'view' 
            ? (equipo === 'local' ? jugadoresConCambios.local : jugadoresConCambios.visita)
            : jugadores;

        if (jugadores.length === 0) {
            return (
                <div className="text-center py-12 text-[#737373]">
                    No hay jugadores registrados
                </div>
            );
        }

        // Ordenar: por número de dorsal (menor a mayor), al final los que no tienen dorsal
        const jugadoresOrdenados = [...jugadoresAMostrar].sort((a, b) => {
            const aTieneDorsal = !!a.dorsal;
            const bTieneDorsal = !!b.dorsal;

            // Jugadores con dorsal primero (ordenados por número)
            if (aTieneDorsal && !bTieneDorsal) return -1;
            if (!aTieneDorsal && bTieneDorsal) return 1;
            
            // Si ambos tienen dorsal, ordenar por número
            if (aTieneDorsal && bTieneDorsal) {
                return a.dorsal! - b.dorsal!;
            }

            // Sin dorsal al final (mantener orden original)
            return 0;
        });

        return (
            <div className="space-y-2 pb-2">
                {jugadoresOrdenados.map((jugador, index) => {
                    return (
                        <JugadorRow
                            key={`${activeTab}-${jugador.id_jugador}`}
                            jugador={jugador}
                            acciones={calcularAccionesJugador(jugador, incidenciasParaAcciones)}
                            equipo={equipo}
                            equipoId={equipoId}
                            esDestacado={esJugadorDestacado(jugador.id_jugador, equipoId, destacados)}
                            index={index}
                            mode={mode}
                            permitirAcciones={permitirAcciones}
                            estaCargando={jugadorCargando === jugador.id_jugador || jugadoresCargando.has(jugador.id_jugador)}
                            limiteEnCancha={tipoFutbol}
                            jugadoresEnCanchaActuales={jugadoresEnCancha}
                            onToggleEnCancha={permitirAcciones ? handleToggleEnCancha : undefined}
                            onSolicitarCambio={permitirAcciones ? handleSolicitarCambio : undefined}
                            onJugadorClick={() => onJugadorClick?.(jugador.id_jugador, equipo)}
                            onJugadorAction={() => onJugadorAction?.(jugador.id_jugador, equipoId)}
                            onDeleteDorsal={() => onDeleteDorsal?.(jugador.id_jugador)}
                            onToggleDestacado={() => onToggleDestacado?.(jugador.id_jugador, equipoId)}
                            estaRotando={estrellasRotando.has(jugador.id_jugador)}
                        />
                    );
                })}

                {/* Botón agregar eventual solo en modo planillero */}
                {esPlanillero && permitirAcciones && (
                    <div className="mt-6 pt-4 border-t border-[#262626]">
                        <button
                            onClick={() => onAgregarEventual?.(equipo)}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[#404040] text-[#737373] hover:border-[#525252] hover:text-white transition-all"
                        >
                            <Plus size={18} />
                            <span className="font-medium">Agregar Jugador Eventual</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <FormacionesCardSkeleton />
    }

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
                <div className="flex border-b border-[#262626] bg-[var(--black-800)] rounded-t-xl">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'local'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        {equipoLocal.nombre}
                        {/* <span className="ml-2 text-xs">({equipoLocal.jugadores.length})</span> */}
                    </button>

                    <button
                        onClick={() => setActiveTab('incidencias')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'incidencias'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        Incidencias
                        {/* <span className="ml-2 text-xs">({incidenciasProcesadas.length})</span> */}
                    </button>

                    <button
                        onClick={() => setActiveTab('visita')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'visita'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        {equipoVisita.nombre}
                        {/* <span className="ml-2 text-xs">({equipoVisita.jugadores.length})</span> */}
                    </button>
                </div>

                {/* Contenido */}
                <div className="w-full px-4 py-4">
                    {activeTab === 'local' && renderJugadores(equipoLocal.jugadores, 'local')}

                    {activeTab === 'incidencias' && (
                        <div className="flex flex-col space-y-1">
                            {incidenciasProcesadas.length > 0 ? (
                                <>
                                    {incidenciasProcesadas.map((item, index) => {
                                        if (item.tipo === 'separador') {
                                            // Renderizar separador de tiempo
                                            const getTiempoTexto = () => {
                                                if (!item.tiempo && item.esTerminado) {
                                                    return 'PARTIDO TERMINADO';
                                                }
                                                
                                                if (!item.tiempo) return '';
                                                
                                                if (item.tiempo === '1T') {
                                                    if (item.esTerminado) {
                                                        return 'PT TERMINADO';
                                                    }
                                                    return 'PT';
                                                } else if (item.tiempo === '2T') {
                                                    if (item.esTerminado) {
                                                        return 'ST TERMINADO';
                                                    }
                                                    return 'ST';
                                                } else if (item.tiempo === 'ET') {
                                                    return 'ET';
                                                } else if (item.tiempo === 'PEN') {
                                                    return 'PENALES';
                                                }
                                                return '';
                                            };

                                            const texto = getTiempoTexto();
                                            if (!texto) return null;

                                            return (
                                                <div key={`separador-${item.tiempo || 'final'}-${index}`} className="flex items-center gap-3 py-2 mt-3">
                                                    <div className="flex-1 h-px bg-[#262626]"></div>
                                                    <span className="text-xs font-medium text-[#737373] uppercase tracking-wider">
                                                        {texto}
                                                    </span>
                                                    <div className="flex-1 h-px bg-[#262626]"></div>
                                                </div>
                                            );
                                        }

                                        // Renderizar incidencia
                                        if (item.tipo !== 'incidencia' || !item.incidencia) return null;
                                        
                                        const incidencia = item.incidencia;
                                        const asistenciaRelacionada = item.asistenciaRelacionada;
                                        
                                        return (
                                            <IncidenciaRow
                                                key={`${activeTab}-${incidencia.tipo}-${incidencia.id}-${index}`}
                                                incidencia={incidencia}
                                                equipoLocalId={equipoLocal.id_equipo}
                                                index={index}
                                                mode={mode}
                                                permitirAcciones={permitirAcciones}
                                                asistenciaRelacionada={asistenciaRelacionada}
                                                segundaAmarillaRelacionada={item.segundaAmarillaRelacionada}
                                                rojaRelacionada={item.rojaRelacionada}
                                                esDobleAmarilla={item.esDobleAmarilla}
                                                dobleAmarillaData={item.dobleAmarillaData}
                                                onEdit={() => {
                                                    if (incidencia.tipo === 'cambio') {
                                                        handleEditCambio(incidencia);
                                                    } else {
                                                        onEditIncidencia?.(incidencia);
                                                    }
                                                }}
                                                onDelete={() => {
                                                    handleDeleteIncidencia(incidencia);
                                                }}
                                            />
                                        );
                                    })}

                                    {/* Mostrar MVP al final si el partido está finalizado */}
                                    {(['T', 'F'].includes(estadoPartido || '')) && jugadorDestacado?.nombre && jugadorDestacado?.apellido && (
                                        <div className="mt-2 pt-2 border-t border-[#262626]">
                                            <div className="flex items-center justify-center py-2">
                                                <div className="text-center">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <span className="text-sm font-medium text-white">
                                                            {jugadorDestacado.nombre?.charAt(0) || ''}. {jugadorDestacado.apellido?.toUpperCase() || ''}
                                                        </span>
                                                        <Star className="text-yellow-500 fill-current" size={15} />
                                                    </div>
                                                    <div className="text-xs text-[#737373] mt-0.5">Mejor Jugador</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay incidencias registradas
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'visita' && renderJugadores(equipoVisita.jugadores, 'visita')}
                </div>
            </div>

            {/* Modal de cambio de jugador (creación) */}
            {modalCambio.jugadorSale && (
                <CambioJugadorModal
                    isOpen={modalCambio.isOpen}
                    onClose={() => setModalCambio({ isOpen: false, jugadorSale: null, equipo: 'local' })}
                    jugadorSale={modalCambio.jugadorSale}
                    jugadoresSuplentes={modalCambio.equipo === 'local' 
                        ? equipoLocal.jugadores 
                        : equipoVisita.jugadores}
                    equipoId={modalCambio.equipo === 'local' 
                        ? equipoLocal.id_equipo 
                        : equipoVisita.id_equipo}
                    equipoNombre={modalCambio.equipo === 'local' 
                        ? equipoLocal.nombre 
                        : equipoVisita.nombre}
                    partidoId={idPartido || 0}
                    estadoPartido={estadoPartido}
                    onConfirmarCambio={handleConfirmarCambio}
                    isLoading={isCreandoCambio}
                />
            )}

            {/* Modal de edición de cambio */}
            {modalEditarCambio.cambioId && (
                <CambioJugadorModal
                    isOpen={modalEditarCambio.isOpen}
                    onClose={() => setModalEditarCambio({ isOpen: false, cambioId: null, jugadorSaleId: null, minuto: null, equipo: 'local' })}
                    jugadoresSuplentes={modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.jugadores 
                        : equipoVisita.jugadores}
                    equipoId={modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.id_equipo 
                        : equipoVisita.id_equipo}
                    equipoNombre={modalEditarCambio.equipo === 'local' 
                        ? equipoLocal.nombre 
                        : equipoVisita.nombre}
                    partidoId={idPartido || 0}
                    estadoPartido={estadoPartido}
                    modoEdicion={true}
                    cambioId={modalEditarCambio.cambioId}
                    minutoActual={modalEditarCambio.minuto || undefined}
                    jugadorSaleId={modalEditarCambio.jugadorSaleId || undefined}
                    onEditarCambio={handleEditarCambio}
                    onConfirmarCambio={async () => {}} // No se usa en modo edición
                    isLoading={isEditandoCambio}
                />
            )}

            {/* Modal de confirmación de eliminación de cambio */}
            <DeleteModal
                isOpen={modalEliminarCambio.isOpen}
                onClose={() => setModalEliminarCambio({ isOpen: false, cambioId: null, incidencia: null })}
                title="Eliminar Cambio"
                message={modalEliminarCambio.incidencia 
                    ? `¿Estás seguro que quieres eliminar el cambio del minuto ${modalEliminarCambio.incidencia.minuto}?`
                    : '¿Estás seguro que quieres eliminar este cambio?'}
                itemName={modalEliminarCambio.incidencia 
                    ? `${modalEliminarCambio.incidencia.jugador_sale_nombre || ''} → ${modalEliminarCambio.incidencia.jugador_entra_nombre || ''}`
                    : undefined}
                onConfirm={handleEliminarCambio}
                error={null}
            />

            {/* Modal de confirmación de eliminación de incidencia */}
            <ConfirmDeleteIncidentModal
                isOpen={modalEliminarIncidencia.isOpen}
                onClose={() => setModalEliminarIncidencia({ isOpen: false, incidencia: null })}
                tipoIncidencia={modalEliminarIncidencia.incidencia?.tipo || ''}
                onConfirm={handleConfirmarEliminarIncidencia}
                isLoading={false}
            />
        </>
    );
};

export default JugadoresTabsUnified;