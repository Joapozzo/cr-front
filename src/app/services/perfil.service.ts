import { getApiBaseUrl } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

export interface ActualizarFotoPerfilResponse {
  success: boolean;
  mensaje: string;
  img: string;
}

export interface ActualizarDatosPerfilResponse {
  success: boolean;
  mensaje: string;
  usuario: {
    uid: string;
    nombre: string;
    apellido: string;
    email: string;
    dni: string | null;
    telefono: bigint | null;
    nacimiento: Date | null;
    img: string | null;
    username: string | null;
  };
}

export interface ActualizarDatosPerfilParams {
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  nacimiento?: string | null;
}

/**
 * Actualizar foto de perfil del usuario
 */
export const actualizarFotoPerfil = async (
  fotoBase64: string
): Promise<ActualizarFotoPerfilResponse> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Token de autenticación no proporcionado');
    }

    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/user/perfil/foto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar foto de perfil');
    }

    const data: ActualizarFotoPerfilResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error al actualizar foto de perfil:', error);
    throw new Error(error.message || 'Error al actualizar foto de perfil');
  }
};

/**
 * Actualizar datos del perfil del usuario
 */
export const actualizarDatosPerfil = async (
  datos: ActualizarDatosPerfilParams
): Promise<ActualizarDatosPerfilResponse> => {
  try {
    const response = await api.put<ActualizarDatosPerfilResponse>('/user/perfil/datos', datos);
    return response;
  } catch (error: any) {
    console.error('Error al actualizar datos del perfil:', error);
    throw new Error(error.response?.data?.error || error.message || 'Error al actualizar datos del perfil');
  }
};

export const perfilService = {
  actualizarFotoPerfil,
  actualizarDatosPerfil,
};

