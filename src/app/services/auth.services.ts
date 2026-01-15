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
import { api, getApiBaseUrl } from '../lib/api';

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
  rol: 'ADMIN' | 'PLANILLERO' | 'USER' | 'CAJERO';
  estado: string;
  cuenta_activada: boolean;
  dni_validado?: boolean;
  email_verificado?: boolean;
  img: string;
  ultimo_login: Date | null;
}

export interface LoginResponse {
  success: boolean;
  usuario: UsuarioAuth;
  proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
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
 * Fuerza la renovación si el token está por expirar (menos de 5 minutos restantes)
 */
export const obtenerToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    // Obtener el token con información de expiración
    const tokenResult = await user.getIdTokenResult();

    // Verificar si el token está por expirar (menos de 5 minutos) o YA expiró
    const expTime = tokenResult.expirationTime ? new Date(tokenResult.expirationTime).getTime() : 0;
    const now = Date.now();
    const timeUntilExpiry = expTime - now;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos

    // Renovar si:
    // - forceRefresh es true, O
    // - el token ya expiró (timeUntilExpiry <= 0), O
    // - el token está por expirar en menos de 5 minutos
    const shouldRefresh = forceRefresh || timeUntilExpiry <= 0 || timeUntilExpiry < fiveMinutes;

    const token = await user.getIdToken(shouldRefresh);
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
      // 1. Intentar crear usuario en Firebase
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } catch (firebaseError: any) {
        // Si el email ya existe, intentar hacer login con las credenciales proporcionadas
        if (firebaseError.code === 'auth/email-already-in-use') {
          // Intentar hacer login para verificar si la contraseña es correcta
          try {
            const loginResult = await signInWithEmailAndPassword(auth, email, password);

            // Si el login es exitoso, el usuario ya existe y tiene la contraseña correcta
            // Si el email no está verificado, reenviar el email de verificación
            if (!loginResult.user.emailVerified) {
              try {
                await sendEmailVerification(loginResult.user);
              } catch (emailError) {
                console.error('Error al reenviar email de verificación:', emailError);
                // No fallar si hay error al enviar email, pero loguear para debugging
              }
            }

            // Retornar un resultado especial para indicar que necesita verificar email
            return {
              success: true,
              user: loginResult.user,
              emailYaExiste: true, // Flag para indicar que el email ya existía
            };
          } catch (loginError: any) {
            // El login falló, verificar si es un eventual
            if (loginError.code === 'auth/wrong-password' || loginError.code === 'auth/user-not-found') {
              const apiBaseUrl = getApiBaseUrl();
              const verificarResponse = await fetch(
                `${apiBaseUrl}/auth/verificar-email-eventual?email=${encodeURIComponent(email)}`
              );

              if (verificarResponse.ok) {
                const verificarData = await verificarResponse.json();

                if (verificarData.esEventual) {
                  // Es un eventual, retornar error especial
                  return {
                    success: false,
                    error: 'EVENTUAL_NEEDS_PASSWORD',
                    esEventual: true,
                    usuario: verificarData.usuario,
                  };
                }
              }

              // No es eventual y la contraseña es incorrecta, o el usuario no existe
              return {
                success: false,
                error: 'El email ya está registrado. Si olvidaste tu contraseña, usa la opción de recuperación. Si eres un jugador eventual, contacta al administrador.',
              };
            }

            // Otro error en el login
            throw loginError;
          }
        }

        // Otro error de Firebase
        throw firebaseError;
      }

      // 2. Obtener token de Firebase para el nuevo usuario
      const token = await userCredential.user.getIdToken();

      // 3. Enviar email de verificación
      await sendEmailVerification(userCredential.user);

      // 4. Crear usuario básico en backend (con token explícito)
      try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/auth/register`, {
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
   * Establecer contraseña para usuario eventual
   */
  establecerPasswordEventual: async (email: string, password: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl();

      // Llamar al endpoint para establecer contraseña
      const response = await fetch(`${apiBaseUrl}/auth/establecer-password-eventual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al establecer contraseña');
      }

      const data = await response.json();

      // Autenticarse en Firebase usando el custom token
      const { signInWithCustomToken, sendEmailVerification } = await import('firebase/auth');
      const userCredential = await signInWithCustomToken(auth, data.customToken);

      // Enviar email de verificación (TODOS los usuarios, incluyendo eventuales)
      try {
        await sendEmailVerification(userCredential.user);
      } catch (error) {
        console.error('Error al enviar email de verificación:', error);
        // No fallar si hay error, pero loguear para debugging
      }

      return {
        success: true,
        user: userCredential.user,
        mensaje: data.mensaje,
      };
    } catch (error: any) {
      console.error('Error al establecer contraseña eventual:', error);
      return {
        success: false,
        error: error.message || 'Error al establecer contraseña',
      };
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
   * Usa popup para TODO (desktop y mobile) - más confiable
   * Procesamiento inmediato después del popup
   */
  loginConGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      // ✅ USAR POPUP PARA TODO (como el proyecto que funciona)
      // No usar redirect - popup funciona bien en mobile moderno
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };

    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);

      let mensaje = 'Error al iniciar sesión con Google';

      if (error.code === 'auth/popup-closed-by-user') {
        mensaje = 'Ventana cerrada por el usuario';
      } else if (error.code === 'auth/cancelled-popup-request') {
        mensaje = 'Operación cancelada';
      } else if (error.code === 'auth/popup-blocked') {
        mensaje = 'El navegador bloqueó la ventana emergente. Por favor, habilita los pop-ups para este sitio e intenta nuevamente.';
      } else if (error.code === 'auth/unauthorized-domain') {
        mensaje = 'Dominio no autorizado. Verifica la configuración en Firebase Console.';
      } else if (error.code === 'auth/operation-not-allowed') {
        mensaje = 'Google Sign-In no está habilitado en Firebase';
      } else if (error.code === 'auth/network-request-failed') {
        mensaje = 'Error de red. Verifica tu conexión a internet.';
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
      return await api.get<{ success: boolean; usuario: UsuarioAuth }>('/user/perfil');
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      throw new Error(error.response?.data?.error || 'Error al obtener perfil');
    }
  },

  /**
   * Obtener posiciones de jugador (para registro)
   */
  obtenerPosicionesJugador: async (): Promise<{ id_posicion: number; codigo: string; nombre: string }[]> => {
    try {
      const response = await api.get<{ success: boolean; data: { id_posicion: number; codigo: string; nombre: string }[] }>('/auth/posiciones-jugador');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener posiciones:', error);
      throw new Error(error.response?.data?.error || 'Error al obtener posiciones');
    }
  },
};