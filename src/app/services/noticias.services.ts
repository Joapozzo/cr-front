import { api } from "../lib/api";
import { ActualizarNoticiaInput, CrearNoticiaInput, FiltrosNoticias, Noticia, NoticiasPaginadas,  } from "../types/noticia";


export const noticiasService = {
    // ============================================
    // RUTAS PÚBLICAS (Usuario)
    // ============================================

    // Obtener noticias con filtros y paginación
    obtenerNoticiasPublicadas: async (
        filtros: FiltrosNoticias = {}
    ): Promise<NoticiasPaginadas> => {
        try {
            const params = new URLSearchParams();

            if (filtros.page) params.append('page', filtros.page.toString());
            if (filtros.limit) params.append('limit', filtros.limit.toString());
            if (filtros.publicada !== undefined) params.append('publicada', filtros.publicada.toString());
            if (filtros.id_tipo_noticia) params.append('id_tipo_noticia', filtros.id_tipo_noticia.toString());
            if (filtros.id_categoria_edicion) params.append('id_categoria_edicion', filtros.id_categoria_edicion.toString());
            if (filtros.destacada !== undefined) params.append('destacada', filtros.destacada.toString());
            if (filtros.busqueda) params.append('busqueda', filtros.busqueda);

            return await api.get<NoticiasPaginadas>(`/user/noticias?${params}`);
        } catch (error) {
            console.error("Error al obtener noticias publicadas:", error);
            throw new Error("No se pudieron cargar las noticias publicadas");
        }
    },

    // Obtener noticias destacadas
    obtenerNoticiasDestacadas: async (limit?: number): Promise<Noticia[]> => {
        try {
            const params = limit ? `?limit=${limit}` : '';
            return await api.get<Noticia[]>(`/user/noticias/destacadas${params}`);
        } catch (error) {
            console.error("Error al obtener noticias destacadas:", error);
            throw new Error("No se pudieron cargar las noticias destacadas");
        }
    },

    // Obtener noticias recientes
    obtenerNoticiasRecientes: async (limit?: number): Promise<Noticia[]> => {
        try {
            const params = limit ? `?limit=${limit}` : '';
            return await api.get<Noticia[]>(`/user/noticias/recientes${params}`);
        } catch (error) {
            console.error("Error al obtener noticias recientes:", error);
            throw new Error("No se pudieron cargar las noticias recientes");
        }
    },

    // Obtener noticia por slug
    obtenerNoticiaPorSlug: async (slug: string): Promise<Noticia> => {
        try {
            return await api.get<Noticia>(`/user/noticias/slug/${slug}`);
        } catch (error) {
            console.error("Error al obtener noticia por slug:", error);
            throw new Error("No se pudo cargar la noticia");
        }
    },

    // Obtener detalle de una noticia específica por ID
    obtenerNoticiaDetalle: async (id_noticia: number): Promise<Noticia> => {
        try {
            return await api.get<Noticia>(`/user/noticias/${id_noticia}`);
        } catch (error) {
            console.error("Error al obtener detalle de la noticia:", error);
            throw new Error("No se pudo cargar el detalle de la noticia");
        }
    },

    // ============================================
    // RUTAS ADMIN
    // ============================================

    // Listar todas las noticias (admin) con filtros
    listarNoticias: async (
        filtros: FiltrosNoticias = {}
    ): Promise<NoticiasPaginadas> => {
        try {
            const params = new URLSearchParams();

            if (filtros.page) params.append('page', filtros.page.toString());
            if (filtros.limit) params.append('limit', filtros.limit.toString());
            if (filtros.publicada !== undefined) params.append('publicada', filtros.publicada.toString());
            if (filtros.id_tipo_noticia) params.append('id_tipo_noticia', filtros.id_tipo_noticia.toString());
            if (filtros.id_categoria_edicion) params.append('id_categoria_edicion', filtros.id_categoria_edicion.toString());
            if (filtros.destacada !== undefined) params.append('destacada', filtros.destacada.toString());
            if (filtros.busqueda) params.append('busqueda', filtros.busqueda);

            return await api.get<NoticiasPaginadas>(`/user/noticias?${params}`);
        } catch (error) {
            console.error("Error al listar noticias:", error);
            throw new Error("No se pudieron cargar las noticias");
        }
    },

    // Crear noticia
    crearNoticia: async (data: CrearNoticiaInput): Promise<Noticia> => {
        try {
            return await api.post<Noticia>('/admin/noticias', data);
        } catch (error) {
            console.error("Error al crear noticia:", error);
            throw new Error("No se pudo crear la noticia");
        }
    },

    // Actualizar noticia
    actualizarNoticia: async (
        id_noticia: number,
        data: ActualizarNoticiaInput
    ): Promise<Noticia> => {
        try {
            return await api.put<Noticia>(`/admin/noticias/${id_noticia}`, data);
        } catch (error) {
            console.error("Error al actualizar noticia:", error);
            throw new Error("No se pudo actualizar la noticia");
        }
    },

    // Eliminar noticia
    eliminarNoticia: async (id_noticia: number): Promise<void> => {
        try {
            await api.delete(`/admin/noticias/${id_noticia}`);
        } catch (error) {
            console.error("Error al eliminar noticia:", error);
            throw new Error("No se pudo eliminar la noticia");
        }
    },

    // Toggle publicación (publicar/despublicar)
    togglePublicacion: async (id_noticia: number): Promise<Noticia> => {
        try {
            return await api.patch<Noticia>(`/admin/noticias/${id_noticia}/toggle-publicacion`);
        } catch (error) {
            console.error("Error al cambiar estado de publicación:", error);
            throw new Error("No se pudo cambiar el estado de publicación");
        }
    },

    // ============================================
    // TIPOS DE NOTICIA
    // ============================================

    // Obtener tipos de noticia
    obtenerTiposNoticia: async (): Promise<Array<{ id_tipo_noticia: number; nombre: string }>> => {
        try {
            return await api.get<Array<{ id_tipo_noticia: number; nombre: string }>>('/admin/noticias/tipos/lista');
        } catch (error) {
            console.error("Error al obtener tipos de noticia:", error);
            throw new Error("No se pudieron cargar los tipos de noticia");
        }
    },

    // Crear tipo de noticia
    crearTipoNoticia: async (nombre: string): Promise<{ id_tipo_noticia: number; nombre: string }> => {
        try {
            return await api.post<{ id_tipo_noticia: number; nombre: string }>('/admin/noticias/tipos', { nombre });
        } catch (error) {
            console.error("Error al crear tipo de noticia:", error);
            throw new Error("No se pudo crear el tipo de noticia");
        }
    },
};
