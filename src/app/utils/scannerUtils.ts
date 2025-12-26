/**
 * Utilidades para el escáner de DNI
 */

/**
 * Convierte un archivo a base64
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remover el prefijo "data:image/...;base64,"
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Valida que el archivo sea una imagen válida
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Por favor selecciona una imagen válida' };
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'La imagen es demasiado grande. Máximo 5MB' };
  }

  return { valid: true };
};

/**
 * Verifica si el contexto es seguro (HTTPS o localhost)
 */
export const isSecureContext = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.isSecureContext ||
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

/**
 * Verifica si los mediaDevices están disponibles
 */
export const isMediaDevicesAvailable = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
};

/**
 * Obtiene un mensaje de error amigable basado en el tipo de error
 */
export const getErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes('PermissionDenied') || errorMessage.includes('NotAllowedError')) {
    return 'Permisos de cámara denegados. Permite el acceso en la configuración.';
  }
  
  if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera')) {
    return 'No se encontró cámara disponible.';
  }
  
  if (errorMessage.includes('HTTPS') || errorMessage.includes('secure')) {
    return 'Se requiere conexión segura (HTTPS).';
  }
  
  return 'Error al acceder a la cámara.';
};

