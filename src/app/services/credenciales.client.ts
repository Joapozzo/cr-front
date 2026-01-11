import { api } from '../lib/api';

// ============================================
// Interfaces TypeScript
// ============================================

export interface Credencial {
  id_credencial: string;
  id_jugador: number;
  id_equipo: number;
  id_categoria_edicion: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: 'A' | 'R' | 'V';
  qr_data: string;
  firma_digital: string;
  valida: boolean;
  jugador: {
    id_jugador: number;
    nombre: string;
    apellido: string;
    dni: string | null;
    fecha_nacimiento: string | null;
    img: string | null;
    usuario: {
      uid: string;
      nombre: string;
      apellido: string;
      email: string;
      img: string | null;
    };
  };
  equipo: {
    id_equipo: number;
    nombre: string;
    img: string | null;
  };
  categoriaEdicion: {
    id_categoria_edicion: number;
    categoria: {
      id_categoria: number;
      nombre?: string;
    };
    edicion: {
      id_edicion: number;
      nombre: string | null;
      temporada: number | null;
    };
  };
}

export interface ValidacionResponse {
  valida: boolean;
  motivo?: string;
  credencial?: Credencial;
  datos_jugador?: {
    nombre: string;
    apellido: string;
    dni: string | null;
    img: string | null;
  };
  datos_equipo?: {
    nombre: string;
    img: string | null;
  };
}

export interface GenerarCredencialParams {
  id_jugador: number;
  id_equipo: number;
  id_categoria_edicion: number;
}

export interface GenerarCredencialesMasivasParams {
  id_categoria_edicion: number;
}

export interface GeneracionMasivaResult {
  creadas: number;
  existentes: number;
  errores: Array<{
    id_jugador: number;
    error: string;
  }>;
}

export interface RevocarCredencialParams {
  motivo?: string;
}

export interface EstadisticasCredenciales {
  total_activas: number;
  total_revocadas: number;
  total_vencidas: number;
  validaciones_hoy: number;
  validaciones_ultima_semana: number;
  validaciones_por_estado: {
    validas: number;
    invalidas: number;
    expiradas: number;
    revocadas: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// ============================================
// Servicio de Credenciales
// ============================================

export const credencialesService = {
  /**
   * Obtener mis credenciales (usuario autenticado)
   */
  obtenerMisCredenciales: async (): Promise<Credencial[]> => {
    try {
      const response = await api.get<ApiResponse<Credencial[]>>('/credenciales/mis-credenciales');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener mis credenciales:', error);
      throw new Error(error.message || 'No se pudieron cargar las credenciales');
    }
  },

  /**
   * Obtener una credencial por ID
   */
  obtenerCredencial: async (id_credencial: string): Promise<Credencial> => {
    try {
      const response = await api.get<ApiResponse<Credencial>>(`/credenciales/${id_credencial}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener credencial:', error);
      throw new Error(error.message || 'No se pudo cargar la credencial');
    }
  },

  /**
   * Validar una credencial (público)
   */
  validarCredencial: async (id_credencial: string, firma?: string): Promise<ValidacionResponse> => {
    try {
      const params = firma ? `?sig=${encodeURIComponent(firma)}` : '';
      const response = await api.get<ApiResponse<ValidacionResponse>>(
        `/credenciales/validar/${id_credencial}${params}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al validar credencial:', error);
      throw new Error(error.message || 'No se pudo validar la credencial');
    }
  },

  /**
   * Generar una credencial individual (admin/capitán)
   */
  generarCredencial: async (params: GenerarCredencialParams): Promise<Credencial> => {
    try {
      const response = await api.post<ApiResponse<Credencial>>('/credenciales/generar', params);
      return response.data;
    } catch (error: any) {
      console.error('Error al generar credencial:', error);
      throw new Error(error.message || 'No se pudo generar la credencial');
    }
  },

  /**
   * Generar credenciales masivas para una categoría (admin)
   */
  generarCredencialesMasivas: async (
    params: GenerarCredencialesMasivasParams
  ): Promise<GeneracionMasivaResult> => {
    try {
      const response = await api.post<ApiResponse<GeneracionMasivaResult>>(
        '/credenciales/generar-masivas',
        params
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al generar credenciales masivas:', error);
      throw new Error(error.message || 'No se pudieron generar las credenciales masivas');
    }
  },

  /**
   * Revocar una credencial (admin)
   */
  revocarCredencial: async (
    id_credencial: string,
    params?: RevocarCredencialParams
  ): Promise<Credencial> => {
    try {
      const response = await api.patch<ApiResponse<Credencial>>(
        `/credenciales/${id_credencial}/revocar`,
        params || {}
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al revocar credencial:', error);
      throw new Error(error.message || 'No se pudo revocar la credencial');
    }
  },

  /**
   * Reactivar una credencial (admin)
   */
  reactivarCredencial: async (id_credencial: string): Promise<Credencial> => {
    try {
      const response = await api.patch<ApiResponse<Credencial>>(
        `/credenciales/${id_credencial}/reactivar`,
        {}
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al reactivar credencial:', error);
      throw new Error(error.message || 'No se pudo reactivar la credencial');
    }
  },

  /**
   * Obtener credenciales de un jugador (admin)
   */
  obtenerCredencialesJugador: async (id_jugador: number): Promise<Credencial[]> => {
    try {
      const response = await api.get<ApiResponse<Credencial[]>>(
        `/credenciales/jugador/${id_jugador}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener credenciales del jugador:', error);
      throw new Error(error.message || 'No se pudieron cargar las credenciales del jugador');
    }
  },

  /**
   * Obtener credenciales de un equipo (capitán/admin)
   */
  obtenerCredencialesEquipo: async (
    id_equipo: number,
    id_categoria_edicion: number
  ): Promise<Credencial[]> => {
    try {
      const response = await api.get<ApiResponse<Credencial[]>>(
        `/credenciales/equipo/${id_equipo}/${id_categoria_edicion}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener credenciales del equipo:', error);
      throw new Error(error.message || 'No se pudieron cargar las credenciales del equipo');
    }
  },

  /**
   * Obtener estadísticas de credenciales (admin)
   */
  obtenerEstadisticas: async (
    id_categoria_edicion: number
  ): Promise<EstadisticasCredenciales> => {
    try {
      const response = await api.get<ApiResponse<EstadisticasCredenciales>>(
        `/credenciales/estadisticas/${id_categoria_edicion}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(error.message || 'No se pudieron cargar las estadísticas');
    }
  }
};

