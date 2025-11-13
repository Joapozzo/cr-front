// src/services/auth.service.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase.config';
import { api, API_BASE_URL } from '../lib/api';

// Tipos
export interface UsuarioAuth {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  username: string;
  telefono?: string | null;
  nacimiento?: Date | string | null;
  id_rol: number;
  rol: 'ADMIN' | 'PLANILLERO' | 'USER';
  estado: string;
  cuenta_activada: boolean;
  img: string;
  ultimo_login: Date | null;
}

export interface LoginResponse {
  success: boolean;
  usuario: UsuarioAuth;
  proximo_paso: 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
}

export interface ValidarDniYDatosInput {
  uid: string;
  dniFrenteUrl: string;
  dniDorsoUrl: string;
  username: string;
  telefono?: string;
  direccion?: string;
}

export interface SubirSelfieInput {
  uid: string;
  selfieUrl: string;
}

export interface VerificarDisponibilidadResponse {
  disponible: boolean;
  mensaje: string;
}

/**
 * Obtener token de Firebase del usuario actual
 */
export const obtenerToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

export const authService = {
  // ==================== FIREBASE AUTH ====================

  /**
   * Registrarse con email y contraseña
   */
  registrarseConEmail: async (email: string, password: string) => {
    try {
      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Obtener token de Firebase para el nuevo usuario
      const token = await userCredential.user.getIdToken();

      // 3. Enviar email de verificación
      await sendEmailVerification(userCredential.user);

      // 4. Crear usuario básico en backend (con token explícito)
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ uid: userCredential.user.uid }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear usuario en backend');
        }
      } catch (backendError: any) {
        console.error('Error al crear usuario en backend:', backendError);
        throw new Error('Error al completar el registro. Por favor, intenta nuevamente.');
      }

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Error al registrarse con email:', error);

      let mensaje = 'Error al registrarse';
      if (error.code === 'auth/email-already-in-use') {
        mensaje = 'El email ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        mensaje = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message) {
        mensaje = error.message;
      }

      return { success: false, error: mensaje };
    }
  },

  /**
   * Recargar estado del usuario (para verificar emailVerified actualizado)
   */
  recargarUsuario: async (): Promise<boolean> => {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      await user.reload();
      return user.emailVerified;
    } catch (error) {
      console.error('Error al recargar usuario:', error);
      return false;
    }
  },

  /**
   * Verificar si el email está verificado (Firebase + Backend)
   */
  verificarEmailVerificado: async (): Promise<{
    verificado: boolean;
    sincronizado: boolean;
    token?: string;
  }> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { verificado: false, sincronizado: false };
      }

      // 🔄 Recargar usuario para obtener el estado actualizado desde Firebase
      await user.reload();

      // 📡 Llamar al backend para sincronizar estado
      const response = await api.post<{
        verificado: boolean;
        sincronizado: boolean;
        token?: string;
      }>('/auth/verificar-email', { uid: user.uid });

      return {
        verificado: response.verificado,
        sincronizado: response.sincronizado,
        token: response.token,
      };
    } catch (error) {
      console.error('Error al verificar email:', error);
      return { verificado: false, sincronizado: false };
    }
  },


  /**
   * Reenviar email de verificación
   */
  reenviarEmailVerificacion: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      await sendEmailVerification(user);
      return { success: true };
    } catch (error: any) {
      console.error('Error al reenviar email:', error);
      return { success: false, error: 'Error al reenviar email de verificación' };
    }
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  loginConEmail: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);

      let mensaje = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Email inválido';
      } else if (error.code === 'auth/user-disabled') {
        mensaje = 'Usuario deshabilitado';
      } else if (error.code === 'auth/too-many-requests') {
        mensaje = 'Demasiados intentos. Intente más tarde';
      }

      return { success: false, error: mensaje };
    }
  },

  /**
   * Iniciar sesión con Google
   */
  loginConGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);

      let mensaje = 'Error al iniciar sesión con Google';
      if (error.code === 'auth/popup-closed-by-user') {
        mensaje = 'Ventana cerrada por el usuario';
      } else if (error.code === 'auth/cancelled-popup-request') {
        mensaje = 'Operación cancelada';
      }

      return { success: false, error: mensaje };
    }
  },

  /**
   * Cerrar sesión
   */
  cerrarSesion: async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  },

  /**
   * Recuperar contraseña
   */
  recuperarPassword: async (email: string) => {
    try {
      // Configurar URL de acción personalizada
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      return { success: true };
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);

      let mensaje = 'Error al enviar email de recuperación';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'Usuario no encontrado';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Email inválido';
      }

      return { success: false, error: mensaje };
    }
  },

  /**
   * Obtener usuario actual
   */
  obtenerUsuarioActual: (): User | null => {
    return auth.currentUser;
  },

  /**
   * Verificar si hay sesión activa
   */
  verificarSesion: (): boolean => {
    return !!auth.currentUser;
  },

  // ==================== BACKEND API ====================

  /**
   * Procesar login en el backend
   */
  procesarLoginBackend: async (uid: string): Promise<LoginResponse> => {
    try {
      return await api.post<LoginResponse>('/auth/login', { uid });
    } catch (error: any) {
      console.error('Error al procesar login en backend:', error);
      throw new Error(error.response?.data?.error || 'Error al procesar el login');
    }
  },

  /**
   * Verificar disponibilidad de username o DNI
   */
  verificarDisponibilidad: async (
    campo: 'username' | 'dni',
    valor: string
  ): Promise<VerificarDisponibilidadResponse> => {
    try {
      const params = new URLSearchParams();
      params.append(campo, valor);

      const response = await api.get<any>(`/auth/verificar-disponibilidad?${params}`);
      return response[campo];
    } catch (error: any) {
      console.error('Error al verificar disponibilidad:', error);
      throw new Error(error.response?.data?.error || 'Error al verificar disponibilidad');
    }
  },

  /**
   * Validar DNI y registrar datos (Step 2)
   */
  validarDniYDatos: async (datos: ValidarDniYDatosInput) => {
    try {
      return await api.post('/auth/register/validar-dni-y-datos', datos);
    } catch (error: any) {
      console.error('Error al validar DNI y datos:', error);
      throw new Error(error.response?.data?.error || 'Error al validar DNI');
    }
  },

  /**
   * Subir selfie y activar cuenta (Step 3)
   */
  subirSelfie: async (datos: SubirSelfieInput) => {
    try {
      return await api.post('/auth/register/subir-selfie', datos);
    } catch (error: any) {
      console.error('Error al subir selfie:', error);
      throw new Error(error.response?.data?.error || 'Error al subir selfie');
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  obtenerPerfil: async (): Promise<{ success: boolean; usuario: UsuarioAuth }> => {
    try {
      return await api.get<{ success: boolean; usuario: UsuarioAuth }>('/auth/perfil');
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      throw new Error(error.response?.data?.error || 'Error al obtener perfil');
    }
  },
};