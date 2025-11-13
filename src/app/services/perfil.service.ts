import { API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export interface ActualizarFotoPerfilResponse {
  success: boolean;
  mensaje: string;
  img: string;
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

    const response = await fetch(`${API_BASE_URL}/user/perfil/foto`, {
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

export const perfilService = {
  actualizarFotoPerfil,
};

