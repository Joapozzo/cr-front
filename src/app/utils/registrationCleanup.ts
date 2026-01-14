/**
 * Utilidad para limpiar todos los datos relacionados con el registro
 * Incluye cookies, sessionStorage, localStorage y datos del store
 */

import { useAuthStore } from '@/app/stores/authStore';

/**
 * Limpia todos los datos relacionados con el proceso de registro
 * Esto incluye:
 * - Cookies de autenticación
 * - sessionStorage (políticas, datos de registro)
 * - localStorage (selfie, etc.)
 * - Store: datos del DNI escaneado
 * 
 * NOTA: No limpia el store de autenticación completo (logout) porque
 * el usuario puede querer volver al inicio sin perder su sesión en Firebase
 * Solo limpia los datos temporales del proceso de registro
 */
export const limpiarDatosRegistro = () => {
  if (typeof window === 'undefined') return;

  // 1. Limpiar cookies relacionadas con el registro
  // Eliminar cookie de auth-token
  document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';

  // 2. Limpiar sessionStorage relacionado con el registro
  sessionStorage.removeItem('politicas_aceptadas');
  sessionStorage.removeItem('registro_completo');
  sessionStorage.removeItem('usuario_nombre');

  // 3. Limpiar localStorage relacionado con el registro
  localStorage.removeItem('selfie_preview');
  localStorage.removeItem('selfie_base64');

  // 4. Limpiar datos del DNI del store
  const { clearDniEscaneado } = useAuthStore.getState();
  clearDniEscaneado();
};

