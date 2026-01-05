/**
 * Utilidad centralizada para determinar la ruta de redirección
 * basada en el estado del usuario después del login
 */

import { UsuarioAuth } from '../services/auth.services';

export type ProximoPaso = 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';

export interface RedireccionResult {
  ruta: string;
  paso: ProximoPaso;
}

/**
 * Determina la ruta de redirección basada en el estado del usuario
 * Ahora todo el flujo de registro está unificado en /registro con stepper
 * Estados:
 * - Sin cuenta o email no verificado → /registro (step EMAIL_VERIFICATION)
 * - Email verificado pero sin políticas → /registro (step POLICIES)
 * - Políticas aceptadas pero sin DNI → /registro (step DNI_VALIDATION)
 * - DNI validado pero sin selfie → /registro (step SELFIE)
 * - Completo → /home según rol
 */
export const determinarRutaRedireccion = (usuario: UsuarioAuth | null): RedireccionResult => {
  // Si no hay usuario, ir a login
  if (!usuario) {
    return { ruta: '/login', paso: 'VERIFICAR_EMAIL' };
  }

  // Si tiene cuenta activada Y estado 'A' → redirigir según rol
  if (usuario.cuenta_activada && usuario.estado === 'A') {
    const rutaHome = obtenerRutaHomePorRol(usuario.rol);
    return { ruta: rutaHome, paso: 'COMPLETO' };
  }

  // Cualquier otro caso → ir a /registro (el stepper manejará el step correcto)
  return { ruta: '/registro', paso: 'VALIDAR_DNI' };
};

/**
 * Obtiene la ruta home según el rol del usuario
 */
export const obtenerRutaHomePorRol = (rol: string): string => {
  switch (rol) {
    case 'ADMIN':
      return '/adm/dashboard';
    case 'CAJERO':
      return '/cajero/dashboard';
    case 'PLANILLERO':
      return '/planillero/home';
    case 'USER':
    case 'INVITADO':
    default:
      return '/home';
  }
};

/**
 * Convierte el proximoPaso del backend a la ruta correspondiente
 * Ahora todo el flujo está unificado en /registro
 */
export const proximoPasoARuta = (proximoPaso: ProximoPaso, rol?: string): string => {
  switch (proximoPaso) {
    case 'VERIFICAR_EMAIL':
    case 'VALIDAR_DNI':
    case 'SELFIE':
      return '/registro'; // Todos los pasos de registro van a /registro
    case 'COMPLETO':
      return rol ? obtenerRutaHomePorRol(rol) : '/home';
    default:
      return '/registro';
  }
};


