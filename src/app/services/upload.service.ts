// src/services/upload.service.ts

/**
 * Convertir File a base64
 */
export const convertirABase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al convertir archivo'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    
    reader.readAsDataURL(file);
  });
};

/**
 * Comprimir imagen manteniendo calidad
 */
export const comprimirImagen = (
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Crear canvas y comprimir
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear contexto de canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validar archivo de imagen
 */
export const validarImagen = (file: File): { valido: boolean; error?: string } => {
  // Validar tipo
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!tiposPermitidos.includes(file.type)) {
    return {
      valido: false,
      error: 'Formato no permitido. Use JPEG, PNG o WebP',
    };
  }
  
  // Validar tamaño (máximo 10MB antes de comprimir)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valido: false,
      error: 'La imagen es demasiado grande. Máximo 10MB',
    };
  }
  
  return { valido: true };
};

/**
 * Capturar foto desde cámara web
 */
export const capturarDesdeCamara = async (): Promise<MediaStream> => {
  try {
    // Verificar si navigator.mediaDevices está disponible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Tu navegador no soporta acceso a cámara');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user', // Cámara frontal
      },
      audio: false,
    });
    
    console.log('Cámara iniciada exitosamente:', stream);
    return stream;
  } catch (error: any) {
    console.error('Error al acceder a la cámara:', error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Permiso de cámara denegado. Por favor, permite el acceso a la cámara en tu navegador.');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('No se encontró cámara conectada');
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('La cámara está siendo usada por otra aplicación');
    } else {
      throw new Error(`Error al acceder a la cámara: ${error.message}`);
    }
  }
};

/**
 * Capturar frame de video como imagen base64
 */
export const capturarFrameVideo = (
  video: HTMLVideoElement,
  quality: number = 0.85
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo crear contexto de canvas');
  }
  
  ctx.drawImage(video, 0, 0);
  
  return canvas.toDataURL('image/jpeg', quality);
};

/**
 * Detener stream de cámara
 */
export const detenerCamara = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
};