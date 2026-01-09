import { useState, useEffect, useMemo } from 'react';
import { useEdicionesConCategorias } from './useEdiciones';
import { useDreamteamCategoriaJornada, useJornadasDisponibles } from './useDreamteam';
import { FORMACIONES_DISPONIBLES } from '../utils/formacionesDT';
import { JugadorDreamTeam } from '../types/dreamteam';
import { SelectOption } from '../components/ui/Select';

export const useDreamTeamLogic = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | number>('');
    const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | null>(null);

    // Obtener categorías disponibles
    const { data: edicionesConCategorias, isLoading: loadingCategorias } = useEdicionesConCategorias();

    // Obtener jornadas disponibles con dreamteam
    const {
        data: jornadasDisponibles = [],
        isLoading: loadingJornadas
    } = useJornadasDisponibles(
        Number(categoriaSeleccionada),
        { enabled: !!categoriaSeleccionada }
    );

    // Obtener dreamteam de la categoría y jornada seleccionada
    const {
        data: dreamteam,
        isLoading: loadingDreamteam,
        error: errorDreamteam
    } = useDreamteamCategoriaJornada(
        Number(categoriaSeleccionada),
        jornadaSeleccionada || 0,
        { enabled: !!categoriaSeleccionada && !!jornadaSeleccionada && jornadaSeleccionada > 0 && jornadasDisponibles.includes(jornadaSeleccionada) }
    );

    // Configurar categoría por defecto cuando cargan los datos
    useEffect(() => {
        if (edicionesConCategorias && edicionesConCategorias.length > 0 && !categoriaSeleccionada) {
            const primeraEdicion = edicionesConCategorias[0];
            if (primeraEdicion.categorias && primeraEdicion.categorias.length > 0) {
                setCategoriaSeleccionada(primeraEdicion.categorias[0].id_categoria_edicion);
            }
        }
    }, [edicionesConCategorias, categoriaSeleccionada]);

    // Configurar jornada por defecto cuando cargan las jornadas disponibles
    useEffect(() => {
        if (jornadasDisponibles.length > 0) {
            // Asegurarse de que la primera jornada disponible sea válida (mayor a 0)
            const primeraJornada = jornadasDisponibles.find(j => j > 0) || jornadasDisponibles[0];
            
            // Si la jornada seleccionada no está disponible o no hay jornada seleccionada o es 0, usar la primera disponible
            if (!jornadaSeleccionada || jornadaSeleccionada <= 0 || !jornadasDisponibles.includes(jornadaSeleccionada)) {
                setJornadaSeleccionada(primeraJornada > 0 ? primeraJornada : null);
            }
        } else {
            setJornadaSeleccionada(null);
        }
    }, [jornadasDisponibles, jornadaSeleccionada]);

    // Resetear jornada cuando cambia la categoría
    useEffect(() => {
        setJornadaSeleccionada(null);
    }, [categoriaSeleccionada]);

    // Generar opciones del select
    const opcionesCategorias: SelectOption[] = useMemo(() => {
        if (!edicionesConCategorias) return [];

        const opciones: SelectOption[] = [];
        edicionesConCategorias.forEach(edicion => {
            edicion.categorias?.forEach(categoria => {
                opciones.push({
                    value: categoria.id_categoria_edicion,
                    label: categoria.nombre
                });
            });
        });
        return opciones;
    }, [edicionesConCategorias]);

    // Handlers
    const handleCategoriaChange = (value: string | number) => {
        setCategoriaSeleccionada(value);
    };

    const handleJornadaAnterior = () => {
        if (!jornadaSeleccionada || jornadaSeleccionada <= 0) return;
        const currentIndex = jornadasDisponibles.indexOf(jornadaSeleccionada);
        if (currentIndex > 0) {
            const nuevaJornada = jornadasDisponibles[currentIndex - 1];
            if (nuevaJornada > 0) {
                setJornadaSeleccionada(nuevaJornada);
            }
        }
    };

    const handleJornadaSiguiente = () => {
        if (!jornadaSeleccionada || jornadaSeleccionada <= 0) return;
        const currentIndex = jornadasDisponibles.indexOf(jornadaSeleccionada);
        if (currentIndex < jornadasDisponibles.length - 1) {
            const nuevaJornada = jornadasDisponibles[currentIndex + 1];
            if (nuevaJornada > 0) {
                setJornadaSeleccionada(nuevaJornada);
            }
        }
    };

    // Función para organizar jugadores por formación usando la fuente centralizada
    const organizarJugadoresPorFormacion = (jugadores: JugadorDreamTeam[], formacion: string): JugadorDreamTeam[][] => {
        // Obtener la formación desde la fuente centralizada
        const formacionArray = FORMACIONES_DISPONIBLES[formacion as keyof typeof FORMACIONES_DISPONIBLES] || FORMACIONES_DISPONIBLES['1-2-3-1'];

        // Organizar jugadores en filas según la formación
        const jugadoresPorFila: JugadorDreamTeam[][] = [];
        let startIndex = 0;

        formacionArray.forEach((cantidad) => {
            jugadoresPorFila.push(jugadores.slice(startIndex, startIndex + cantidad));
            startIndex += cantidad;
        });

        // Invertir para que el arquero quede abajo
        return jugadoresPorFila.reverse();
    };

    // Computar jugadores organizados
    const jugadoresOrganizados = useMemo(() => {
        if (!dreamteam || !dreamteam.jugadores || !dreamteam.formacion) {
            return [];
        }
        return organizarJugadoresPorFormacion(dreamteam.jugadores, dreamteam.formacion);
    }, [dreamteam]);

    return {
        // Estados
        categoriaSeleccionada,
        jornadaSeleccionada,
        jornadasDisponibles,
        
        // Datos
        dreamteam,
        opcionesCategorias,
        jugadoresOrganizados,
        
        // Estados de carga
        loadingCategorias,
        loadingJornadas,
        loadingDreamteam,
        
        // Errores
        errorDreamteam,
        
        // Handlers
        handleCategoriaChange,
        handleJornadaAnterior,
        handleJornadaSiguiente,
    };
};

