import { Credencial as CredencialBackend } from '@/app/services/credenciales.client';

export type EstadoCredencialEnum = 'ACTIVA' | 'VENCIDA' | 'REVOCADA';

/**
 * Tipo para el componente visual de credencial
 * Adaptado desde CredencialBackend
 */
export interface Credencial {
  id: string;
  jugador: {
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    fotoUrl?: string;
  };
  equipo: {
    nombre: string;
    escudoUrl?: string; // URL o path
    categoria: string;
  };
  temporada: string | number;
  estado: EstadoCredencialEnum;
  vencimiento: string; // ISO date string
  qrData: string; // Datos para el QR
}

/**
 * Convierte una credencial del backend al formato del componente visual
 */
export const adaptarCredencialParaComponente = (
  credencialBackend: CredencialBackend
): Credencial => {
  // Mapear estado: 'A' -> 'ACTIVA', 'R' -> 'REVOCADA', 'V' -> 'VENCIDA'
  const estadoMap: Record<'A' | 'R' | 'V', EstadoCredencialEnum> = {
    A: 'ACTIVA',
    R: 'REVOCADA',
    V: 'VENCIDA'
  };

  return {
    id: credencialBackend.id_credencial,
    jugador: {
      nombre: credencialBackend.jugador.nombre,
      apellido: credencialBackend.jugador.apellido,
      dni: credencialBackend.jugador.dni || '',
      fechaNacimiento: credencialBackend.jugador.fecha_nacimiento || '',
      fotoUrl: credencialBackend.jugador.img || undefined
    },
    equipo: {
      nombre: credencialBackend.equipo.nombre,
      escudoUrl: credencialBackend.equipo.img || undefined,
      categoria: credencialBackend.categoriaEdicion.categoria.nombre || 'Sin categoría'
    },
    temporada: credencialBackend.categoriaEdicion.edicion.temporada || 
               credencialBackend.categoriaEdicion.edicion.nombre || 
               new Date().getFullYear(),
    estado: estadoMap[credencialBackend.estado] || 'VENCIDA',
    vencimiento: credencialBackend.fecha_vencimiento,
    qrData: credencialBackend.qr_data
  };
};
