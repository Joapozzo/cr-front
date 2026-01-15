/**
 * Utilidad compartida para procesar usuarios autenticados con Google
 * Usada tanto en páginas como en hooks
 */
import { api } from '../lib/api';
import { auth } from '../lib/firebase.config';

export const procesarUsuarioGoogle = async (user: any) => {
  // 1. Obtener token de Firebase
  const token = await user.getIdToken();

  // 2. Intentar login en backend
  try {
    const loginData = await api.post<{
      success: boolean;
      usuario: any;
      proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
    }>('/auth/login', { uid: user.uid }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return { success: true, data: loginData, token };
  } catch (loginError: any) {
    // Si el error es 401/404, el usuario no existe, registrarlo
    const errorMessage = loginError.message || String(loginError);
    const statusCode = loginError.response?.status || loginError.status;
    
    // ✅ MEJOR DETECCIÓN DE ERROR - Agregar más casos
    const isUserNotFound = 
      statusCode === 401 ||
      statusCode === 404 ||
      statusCode === 400 || // También puede ser 400 si el usuario no existe
      errorMessage.includes('401') || 
      errorMessage.includes('404') ||
      errorMessage.includes('400') ||
      errorMessage.includes('Usuario no encontrado') ||
      errorMessage.includes('No autorizado') ||
      errorMessage.includes('Unauthorized') ||
      errorMessage.includes('not found') ||
      errorMessage.includes('not found in the database');
    
    console.log('🔍 Análisis de error de login:', {
      statusCode,
      errorMessage,
      isUserNotFound,
      responseData: loginError.response?.data,
      error: loginError
    });
    
    if (isUserNotFound) {
      try {
        // Registrar usuario en backend (con email)
        console.log('🔵 Usuario no encontrado, registrando en backend...', { 
          uid: user.uid, 
          email: user.email,
          emailVerified: user.emailVerified 
        });
        
        const registerResponse = await api.post<{
          success: boolean;
          mensaje?: string;
          usuario?: any;
          esEventual?: boolean;
        }>('/auth/register', { 
          uid: user.uid,
          email: user.email 
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('✅ Usuario registrado exitosamente:', registerResponse);
        
        if (!registerResponse || !registerResponse.success) {
          throw new Error('El registro no fue exitoso según la respuesta del servidor');
        }

        // Ahora intentar login nuevamente
        const loginData = await api.post<{
          success: boolean;
          usuario: any;
          proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
        }>('/auth/login', { uid: user.uid }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('✅ Login después de registro exitoso:', loginData);
        return { success: true, data: loginData, token };
      } catch (registerError: any) {
        // ✅ MANEJAR ERROR DE USUARIO YA EXISTE (race condition)
        const registerStatus = registerError.response?.status;
        const registerData = registerError.response?.data;
        const errorMessage = registerError.message || String(registerError);
        
        // Si el error es "usuario ya existe" o "unique constraint", intentar login
        const isUserAlreadyExists = 
          registerStatus === 400 ||
          registerStatus === 500 ||
          errorMessage.includes('ya está registrado') ||
          errorMessage.includes('Unique constraint') ||
          errorMessage.includes('P2002') ||
          (registerData?.error && registerData.error.includes('ya está registrado'));
        
        if (isUserAlreadyExists) {
          console.log('⚠️ Usuario ya existe (race condition), intentando login...');
          
          try {
            // Intentar login directamente
            const loginData = await api.post<{
              success: boolean;
              usuario: any;
              proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
            }>('/auth/login', { uid: user.uid }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            console.log('✅ Login exitoso después de detectar usuario existente:', loginData);
            return { success: true, data: loginData, token };
          } catch (loginRetryError: any) {
            console.error('❌ Error en login después de detectar usuario existente:', loginRetryError);
            throw new Error('El usuario ya existe pero no se pudo hacer login');
          }
        }
        
        console.error('❌ Error al registrar usuario en backend:', {
          error: registerError,
          message: registerError.message,
          status: registerError.response?.status,
          statusText: registerError.response?.statusText,
          data: registerError.response?.data,
          stack: registerError.stack
        });
        
        const registerErrorMessage = registerError.response?.data?.error || 
                                   registerError.message || 
                                   'Error al registrar usuario en el servidor';
        throw new Error(`No se pudo completar el registro: ${registerErrorMessage}`);
      }
    }
    
    // Si es otro error, relanzarlo
    console.error('❌ Error en login (no es 401/404):', {
      error: loginError,
      statusCode,
      errorMessage,
      responseData: loginError.response?.data
    });
    throw loginError;
  }
};


