import { IncidenciaPartido, EstadoPartido, JugadorPlantel } from '@/app/types/partido';
import { DobleAmarillaData, IncidenciaAgrupada, CambioNormalizado, EquipoData } from '../types';

/**
 * Expande asistencias que vienen dentro de objetos gol (modo usuario)
 */
export const expandirAsistencias = (incidencias: IncidenciaPartido[]): IncidenciaPartido[] => {
    const incidenciasExpandidas: IncidenciaPartido[] = [];
    
    incidencias.forEach(inc => {
        // Agregar la incidencia original
        incidenciasExpandidas.push(inc);
        
        // Si es un gol con asistencias dentro (modo usuario), crear objetos de asistencia separados
        if (inc.tipo === 'gol') {
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
    
    return incidenciasExpandidas;
};

/**
 * Detecta jugadores con doble amarilla (2 amarillas + 1 roja/doble_amarilla)
 */
export const detectarDobleAmarilla = (
    todasIncidencias: IncidenciaPartido[]
): Map<number, DobleAmarillaData> => {
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
    const dobleAmarillaMap = new Map<number, DobleAmarillaData>();

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

    return dobleAmarillaMap;
};

/**
 * Asocia asistencias con goles y procesa asistencias que vienen dentro de objetos gol
 */
export const asociarAsistenciasConGoles = (
    incidencias: IncidenciaPartido[]
): Map<number, IncidenciaPartido> => {
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
                    id: asistenciaData.id_asistencia || gol.id,
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

    return asistenciasPorGol;
};

/**
 * Infiere el tiempo de una incidencia basándose en el minuto si no está disponible
 */
export const inferirTiempo = (incidencia: IncidenciaPartido): '1T' | '2T' | 'ET' | 'PEN' => {
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

/**
 * Agrupa incidencias por tiempo con separadores
 */
export const agruparPorTiempo = (
    incidenciasOrdenadas: Array<{
        incidencia: IncidenciaPartido;
        asistenciaRelacionada?: IncidenciaPartido;
        segundaAmarillaRelacionada?: IncidenciaPartido;
        rojaRelacionada?: IncidenciaPartido;
        esDobleAmarilla?: boolean;
        dobleAmarillaData?: DobleAmarillaData;
    }>,
    estadoPartido?: EstadoPartido
): IncidenciaAgrupada[] => {
    const grupos: IncidenciaAgrupada[] = [];

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
    const incidencias2T: typeof incidenciasOrdenadas = [];
    const incidencias1T: typeof incidenciasOrdenadas = [];

    incidenciasOrdenadas.forEach(item => {
        const tiempo = inferirTiempo(item.incidencia);
        if (tiempo === '2T' || tiempo === 'ET' || tiempo === 'PEN') {
            incidencias2T.push(item);
        } else {
            incidencias1T.push(item);
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
};

/**
 * Convierte cambios a formato IncidenciaPartido y agrupa SALIDA + ENTRADA del mismo minuto
 */
export const convertirCambiosAIncidencias = (
    cambios: CambioNormalizado[],
    equipoLocal: EquipoData,
    equipoVisita: EquipoData
): IncidenciaPartido[] => {
    if (!cambios || cambios.length === 0) return [];

    // Agrupar cambios por minuto y equipo
    const cambiosAgrupados = new Map<string, CambioNormalizado[]>();
    
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
};

