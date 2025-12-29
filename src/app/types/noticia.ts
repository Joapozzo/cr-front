export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface Noticia {
    id_noticia: number;
    titulo: string;
    contenido: string;
    contenido_preview?: string;
    img?: string;
    img_portada?: string;
    fecha_creacion: Date | string;
    autor_id?: string;
    slug?: string;
    visitas: number;
    ultima_actualizacion?: string;
    id_tipo_noticia?: number;
    destacada?: boolean;
    publicada?: boolean;

    // Relaciones
    autor?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
    tipoNoticia?: {
        id_tipo_noticia: number;
        nombre: string;
    };
    categorias: {
        id_categoria_edicion: number;
        nombre: string;
    }[];
}

export interface NoticiasPaginadas {
    data: Noticia[];
    pagination: Pagination;
    succes: boolean;
}

export interface NoticiaCategoriaEdicion {
    id_noticia: number;
    id_categoria_edicion: number;
}

// Tipos para formularios y creación (si los necesitas después)
export interface NoticiaCreate {
    titulo: string;
    contenido: string;
    img?: string;
    autor_id?: string;
    slug?: string;
    categorias: number[]; // IDs de categorías
}

export interface NoticiaUpdate extends Partial<NoticiaCreate> {
    id_noticia: number;
}

// Tipos para las peticiones
export interface CrearNoticiaInput {
    titulo: string;
    contenido: string;
    img_portada?: string;
    id_tipo_noticia: number;
    destacada?: boolean;
    publicada?: boolean;
    categorias?: number[];
}

export interface ActualizarNoticiaInput {
    titulo?: string;
    contenido?: string;
    img_portada?: string;
    id_tipo_noticia?: number;
    destacada?: boolean;
    publicada?: boolean;
    categorias?: number[];
}

export interface FiltrosNoticias {
    page?: number;
    limit?: number;
    publicada?: boolean;
    id_tipo_noticia?: number;
    id_categoria_edicion?: number;
    destacada?: boolean;
    busqueda?: string;
}

export interface NoticiasPublicadasResponse {
    noticias: Noticia[];
    total: number;
    limit: number | null;
    offset: number;
}