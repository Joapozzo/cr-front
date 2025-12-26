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
 * Estados:
 * - Sin cuenta: VERIFICAR_EMAIL → /registro (verificar email)
 * - Estado 'S': VALIDAR_DNI → /validar-dni
 * - Estado 'V': SELFIE → /selfie
 * - Estado 'A': COMPLETO → /home según rol
 */
export const determinarRutaRedireccion = (usuario: UsuarioAuth | null): RedireccionResult => {
  // Si no hay usuario, ir a login
  if (!usuario) {
    return { ruta: '/login', paso: 'VERIFICAR_EMAIL' };
  }

  // Flujo igual para TODOS: Verificar Email → Políticas → DNI → Selfie → Activo
  // Verificar en orden estricto: Email → DNI → Selfie → Completo
  
  // 1. Si el email no está verificado → verificar email (TODOS los usuarios, incluyendo eventuales)
  if (!usuario.email_verificado) {
    return { ruta: '/registro', paso: 'VERIFICAR_EMAIL' };
  }

  // 2. Si no tiene DNI validado → validar DNI (TODOS los usuarios)
  if (!usuario.dni_validado) {
    return { ruta: '/validar-dni', paso: 'VALIDAR_DNI' };
  }

  // 3. Si tiene DNI pero no tiene cuenta activada (falta selfie) → subir selfie
  if (!usuario.cuenta_activada) {
    return { ruta: '/selfie', paso: 'SELFIE' };
  }

  // 4. Si tiene cuenta activada Y estado 'A' → redirigir según rol
  if (usuario.cuenta_activada && usuario.estado === 'A') {
    const rutaHome = obtenerRutaHomePorRol(usuario.rol);
    return { ruta: rutaHome, paso: 'COMPLETO' };
  }

  // Fallback: si no coincide con ningún caso, ir a validar DNI
  return { ruta: '/validar-dni', paso: 'VALIDAR_DNI' };
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
 */
export const proximoPasoARuta = (proximoPaso: ProximoPaso, rol?: string): string => {
  switch (proximoPaso) {
    case 'VERIFICAR_EMAIL':
      return '/registro';
    case 'VALIDAR_DNI':
      return '/validar-dni';
    case 'SELFIE':
      return '/selfie';
    case 'COMPLETO':
      return rol ? obtenerRutaHomePorRol(rol) : '/home';
    default:
      return '/validar-dni';
  }
};


