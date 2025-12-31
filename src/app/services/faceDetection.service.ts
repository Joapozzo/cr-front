/**
 * Servicio para detección y validación facial usando face-api.js
 */

import * as faceapi from 'face-api.js';

// Estado de carga de modelos
let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Carga los modelos de face-api.js si no están cargados
 */
export const loadFaceModels = async (): Promise<void> => {
  if (modelsLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const MODEL_URL = '/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      modelsLoaded = true;
    } catch (error) {
      console.error('Error al cargar modelos de face-api.js:', error);
      modelsLoaded = false;
      loadingPromise = null;
      throw new Error('No se pudieron cargar los modelos de detección facial');
    }
  })();

  return loadingPromise;
};

/**
 * Valida si una imagen contiene un rostro válido
 * @param imageSource - URL de imagen, elemento img, canvas o video
 * @returns Objeto con información de validación
 */
export const validarRostro = async (
  imageSource: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<{
  valido: boolean;
  tieneRostro: boolean;
  cantidadRostros: number;
  confianza?: number;
  mensaje?: string;
  detecciones?: unknown[];
}> => {
  try {
    // Asegurar que los modelos estén cargados
    await loadFaceModels();

    // Crear elemento de imagen si es string
    let imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    
    if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSource;
      });
      imageElement = img;
    } else {
      imageElement = imageSource;
    }

    // Detectar rostros con landmarks y expresiones
    const detecciones = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // Validar que haya exactamente un rostro
    if (detecciones.length === 0) {
      return {
        valido: false,
        tieneRostro: false,
        cantidadRostros: 0,
        mensaje: 'No se detectó ningún rostro en la imagen',
        detecciones: [],
      };
    }

    if (detecciones.length > 1) {
      return {
        valido: false,
        tieneRostro: true,
        cantidadRostros: detecciones.length,
        mensaje: `Se detectaron ${detecciones.length} rostros. Debe haber solo uno.`,
        detecciones,
      };
    }

    // Validar confianza mínima (0.5 = 50%)
    const deteccion = detecciones[0];
    const confianza = deteccion.detection.score;
    const confianzaMinima = 0.5;

    if (confianza < confianzaMinima) {
      return {
        valido: false,
        tieneRostro: true,
        cantidadRostros: 1,
        confianza,
        mensaje: `La confianza de detección es muy baja (${Math.round(confianza * 100)}%). Por favor, asegúrate de tener buena iluminación.`,
        detecciones,
      };
    }

    // Validar que el rostro esté centrado y tenga un tamaño razonable
    const box = deteccion.detection.box;
    const imageWidth = imageElement instanceof HTMLVideoElement 
      ? imageElement.videoWidth 
      : imageElement.width || (imageElement as HTMLImageElement).naturalWidth;
    const imageHeight = imageElement instanceof HTMLVideoElement
      ? imageElement.videoHeight
      : imageElement.height || (imageElement as HTMLImageElement).naturalHeight;

    // El rostro debe ocupar al menos el 15% del área de la imagen
    const areaRostro = box.width * box.height;
    const areaImagen = imageWidth * imageHeight;
    const porcentajeArea = (areaRostro / areaImagen) * 100;

    if (porcentajeArea < 15) {
      return {
        valido: false,
        tieneRostro: true,
        cantidadRostros: 1,
        confianza,
        mensaje: 'El rostro es muy pequeño. Acércate más a la cámara.',
        detecciones,
      };
    }

    // El rostro no debe ocupar más del 60% del área (muy cerca)
    if (porcentajeArea > 60) {
      return {
        valido: false,
        tieneRostro: true,
        cantidadRostros: 1,
        confianza,
        mensaje: 'El rostro está muy cerca. Aléjate un poco de la cámara.',
        detecciones,
      };
    }

    // Validar que el rostro esté relativamente centrado (dentro del 40% central)
    const centroX = box.x + box.width / 2;
    const centroY = box.y + box.height / 2;
    const margenX = imageWidth * 0.3; // 30% de margen a cada lado
    const margenY = imageHeight * 0.3;

    if (
      centroX < margenX ||
      centroX > imageWidth - margenX ||
      centroY < margenY ||
      centroY > imageHeight - margenY
    ) {
      return {
        valido: false,
        tieneRostro: true,
        cantidadRostros: 1,
        confianza,
        mensaje: 'El rostro debe estar centrado en la imagen.',
        detecciones,
      };
    }

    return {
      valido: true,
      tieneRostro: true,
      cantidadRostros: 1,
      confianza,
      mensaje: 'Rostro válido detectado',
      detecciones,
    };
  } catch (error) {
    console.error('Error al validar rostro:', error);
    return {
      valido: false,
      tieneRostro: false,
      cantidadRostros: 0,
      mensaje: error instanceof Error ? error.message : 'Error al validar el rostro',
      detecciones: [],
    };
  }
};

/**
 * Detecta rostros en tiempo real desde un video
 * @param video - Elemento de video
 * @param callback - Callback que se ejecuta con los resultados de detección
 * @returns Función para detener la detección
 */
export const detectarRostroEnTiempoReal = async (
  video: HTMLVideoElement,
  callback: (resultado: {
    tieneRostro: boolean;
    valido: boolean;
    confianza?: number;
    mensaje?: string;
    detecciones?: unknown[];
  }) => void
): Promise<() => void> => {
  await loadFaceModels();

  let isRunning = true;
  let animationFrameId: number | null = null;

  const detect = async () => {
    if (!isRunning || video.readyState !== video.HAVE_ENOUGH_DATA) {
      if (isRunning) {
        animationFrameId = requestAnimationFrame(detect);
      }
      return;
    }

    try {
      const detecciones = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detecciones.length === 0) {
        callback({
          tieneRostro: false,
          valido: false,
          mensaje: 'Posiciona tu rostro dentro del óvalo',
        });
      } else if (detecciones.length > 1) {
        callback({
          tieneRostro: true,
          valido: false,
          mensaje: 'Solo debe aparecer una persona',
        });
      } else {
        const deteccion = detecciones[0];
        const confianza = deteccion.detection.score;
        const box = deteccion.detection.box;

        // Validar tamaño del rostro
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const areaRostro = box.width * box.height;
        const areaVideo = videoWidth * videoHeight;
        const porcentajeArea = (areaRostro / areaVideo) * 100;

        // Validar centrado
        const centroX = box.x + box.width / 2;
        const centroY = box.y + box.height / 2;
        const margenX = videoWidth * 0.3;
        const margenY = videoHeight * 0.3;

        const estaCentrado =
          centroX >= margenX &&
          centroX <= videoWidth - margenX &&
          centroY >= margenY &&
          centroY <= videoHeight - margenY;

        const tamañoValido = porcentajeArea >= 15 && porcentajeArea <= 60;
        const confianzaValida = confianza >= 0.5;

        if (confianzaValida && tamañoValido && estaCentrado) {
          callback({
            tieneRostro: true,
            valido: true,
            confianza,
            mensaje: 'Rostro detectado correctamente',
            detecciones,
          });
        } else {
          let mensaje = 'Ajusta tu posición: ';
          if (!confianzaValida) {
            mensaje += 'mejora la iluminación. ';
          }
          if (!tamañoValido) {
            if (porcentajeArea < 15) {
              mensaje += 'acércate más. ';
            } else {
              mensaje += 'aléjate un poco. ';
            }
          }
          if (!estaCentrado) {
            mensaje += 'centra tu rostro.';
          }

          callback({
            tieneRostro: true,
            valido: false,
            confianza,
            mensaje: mensaje.trim(),
            detecciones,
          });
        }
      }
    } catch (error) {
      console.error('Error en detección en tiempo real:', error);
      callback({
        tieneRostro: false,
        valido: false,
        mensaje: 'Error al detectar rostro',
      });
    }

    if (isRunning) {
      animationFrameId = requestAnimationFrame(detect);
    }
  };

  animationFrameId = requestAnimationFrame(detect);

  return () => {
    isRunning = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};

