import { z } from 'zod';

export const PostPartidoSchema = z.object({
    id_equipolocal: z.number().optional(),
    id_equipovisita: z.number().optional(),
    jornada: z.number().min(1),
    dia: z.coerce.date().optional(),
    hora: z.string().optional(),
    id_cancha: z.number().optional(), // Cambiado de 'cancha' a 'id_cancha'
    arbitro: z.string().optional(),
    id_planillero: z.string().optional(),
    id_zona: z.number().optional(),
    destacado: z.boolean().default(false),
    interzonal: z.boolean().default(false),
    ventaja_deportiva: z.boolean().default(false).optional(),
    ida: z.boolean().default(false).optional(),
    vuelta: z.boolean().default(false).optional(),
    descripcion: z.string().optional(),
    vacante_local: z.number().optional(),
    vacante_visita: z.number().optional(),
});

export const UpdatePartidoSchema = z.object({
    id_equipolocal: z.number().optional(),
    id_equipovisita: z.number().optional(),
    jornada: z.number().min(1).optional(),
    dia: z.coerce.date().optional(),
    hora: z.string().optional(),
    id_cancha: z.number().optional(), // Cambiado de 'cancha' a 'id_cancha'
    arbitro: z.string().optional(),
    id_planillero: z.string().optional(),
    id_zona: z.number().optional(),
    estado: z.enum(['P', 'C1', 'E', 'C2', 'T', 'F', 'S', 'A', 'I'], {
        message: 'El estado debe ser uno de: P (Programado), C1 (Primer tiempo), E (Entretiempo), C2 (Segundo tiempo), T (Terminado), F (Finalizado), S (Suspendido), A (Aplazado), I (Indefinido)'
    }).optional(),
    interzonal: z.boolean().optional(),
    destacado: z.boolean().optional(),
    ventaja_deportiva: z.boolean().optional(),
    id_equipo_ventaja_deportiva: z.number().optional(),
    descripcion: z.string().optional(),
    vacante_local: z.number().optional(),
    vacante_visita: z.number().optional(),
});

export const PartidoResponseSchema = z.object({
    id_partido: z.number(),
    id_equipolocal: z.number().optional(),
    id_equipovisita: z.number().optional(),
    jornada: z.number(),
    dia: z.coerce.date().optional(),
    hora: z.string().optional(),
    goles_local: z.number().optional(),
    goles_visita: z.number().optional(),
    pen_local: z.number().optional(),
    pen_visita: z.number().optional(),
    cancha: z.object({
        id_cancha: z.number(),
        nombre: z.string(),
        estado: z.string(),
        id_predio: z.number(),
        predio: z.object({
            id_predio: z.number(),
            nombre: z.string(),
        }).optional(),
    }).nullable().optional(),
    arbitro: z.string().optional(),
    destacado: z.boolean(),
    descripcion: z.string().optional(),
    planillero: z.object({
        nombre: z.string(),
        apellido: z.string(),
    }).optional(),
    id_jugador_destacado: z.number().optional(),
    estado: z.enum(['P', 'C1', 'E', 'C2', 'T', 'F', 'S', 'A', 'I']),
    id_categoria_edicion: z.number().optional(),
    id_zona: z.number().optional(),
    vacante_local: z.number().optional(),
    vacante_visita: z.number().optional(),
    interzonal: z.boolean(),
    ventaja_deportiva: z.boolean().optional(),
    ida: z.boolean().optional(),
    vuelta: z.boolean().optional(),
    equipoLocal: z.object({
        id_equipo: z.number(),
        nombre: z.string(),
        img: z.string().optional(),
    }).optional(),
    equipoVisita: z.object({
        id_equipo: z.number(),
        nombre: z.string(),
        img: z.string().optional(),
    }).optional(),
    categoriaEdicion: z.object({
        id_categoria_edicion: z.number(),
        categoria: z.object({
            division: z.object({
                nombre: z.string(),
            }).optional(),
            nombreCategoria: z.object({
                nombre_categoria: z.string(),
            }),
        }),
        edicion: z.object({
            id_edicion: z.number(),
            nombre: z.string().optional(),
            temporada: z.number().optional(),
        }),
    }).optional(),
    zona: z.object({
        id_zona: z.number(),
        nombre: z.string().optional(),
        tipoZona: z.object({
            nombre: z.string(),
        }).optional(),
    }).optional(),
});

export const PartidosPorJornadaResponseSchema = z.object({
    jornada: z.number(),
    partidos: z.array(PartidoResponseSchema),
    total: z.number(),
    totalJornadas: z.number(),
});

export const CrearPartidoResponseSchema = z.object({
    mensaje: z.string(),
    partido: PartidoResponseSchema,
});

export const ActualizarPartidoResponseSchema = z.object({
    mensaje: z.string(),
    partido: PartidoResponseSchema,
});

export const EliminarPartidoResponseSchema = z.object({
    mensaje: z.string(),
});

export type PostPartido = z.infer<typeof PostPartidoSchema>;
export type UpdatePartido = z.infer<typeof UpdatePartidoSchema>;
export type PartidoResponse = z.infer<typeof PartidoResponseSchema>;
export type PartidosPorJornadaResponse = z.infer<typeof PartidosPorJornadaResponseSchema>;
export type CrearPartidoResponse = z.infer<typeof CrearPartidoResponseSchema>;
export type ActualizarPartidoResponse = z.infer<typeof ActualizarPartidoResponseSchema>;
export type EliminarPartidoResponse = z.infer<typeof EliminarPartidoResponseSchema>;
export type EstadoPartido = 'P' | 'C1' | 'E' | 'C2' | 'T' | 'F' | 'S' | 'A' | 'I';