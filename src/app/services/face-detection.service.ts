// src/services/face-detection.service.ts
import * as faceapi from 'face-api.js';

let modelosDescargados = false;

/**
 * Descargar modelos de face-api.js
 */
export const descargarModelosFaciales = async (): Promise<void> => {
  if (modelosDescargados) return;

  try {
    const MODEL_URL = '/models'; // Los modelos deben estar en public/models/

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    modelosDescargados = true;
  } catch (error) {
    console.error('Error al descargar modelos faciales:', error);
    throw new Error('Error al cargar sistema de detección facial');
  }
};

export interface ResultadoDeteccion {
  caraDetectada: boolean;
  cantidad: number;
  confianza: number;
  advertencias: string[];
}

/**
 * Detectar rostro en imagen
 */
export const detectarRostro = async (
  imagenElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<ResultadoDeteccion> => {
  try {
    // Asegurar que los modelos estén cargados
    if (!modelosDescargados) {
      await descargarModelosFaciales();
    }

    // Detectar rostros
    const detecciones = await faceapi
      .detectAllFaces(imagenElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const advertencias: string[] = [];

    // No se detectó ningún rostro
    if (detecciones.length === 0) {
      return {
        caraDetectada: false,
        cantidad: 0,
        confianza: 0,
        advertencias: ['No se detectó ningún rostro en la imagen'],
      };
    }

    // Se detectaron múltiples rostros
    if (detecciones.length > 1) {
      advertencias.push(`Se detectaron ${detecciones.length} rostros. Solo debe haber uno.`);
    }

    const deteccion = detecciones[0];
    const confianza = deteccion.detection.score;

    // Verificar confianza
    if (confianza < 0.5) {
      advertencias.push('La calidad de la imagen es baja. Intenta con mejor iluminación.');
    }

    // Verificar que el rostro esté centrado y ocupando buen espacio
    const box = deteccion.detection.box;
    const areaRostro = box.width * box.height;
    const areaImagen = imagenElement.width * imagenElement.height;
    const porcentaje = (areaRostro / areaImagen) * 100;

    if (porcentaje < 15) {
      advertencias.push('El rostro está muy lejos. Acércate más a la cámara.');
    } else if (porcentaje > 70) {
      advertencias.push('El rostro está muy cerca. Aléjate un poco de la cámara.');
    }

    // Verificar si está muy inclinado
    const landmarks = deteccion.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    const leftEyeCenter = {
      x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
      y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length,
    };
    
    const rightEyeCenter = {
      x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
      y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length,
    };

    const angulo = Math.abs(
      Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x) * (180 / Math.PI)
    );

    if (angulo > 15) {
      advertencias.push('La cabeza está muy inclinada. Manténla recta.');
    }

    return {
      caraDetectada: detecciones.length === 1 && confianza >= 0.5,
      cantidad: detecciones.length,
      confianza: confianza,
      advertencias,
    };
  } catch (error) {
    console.error('Error al detectar rostro:', error);
    throw new Error('Error al analizar la imagen');
  }
};

/**
 * Validar selfie antes de subir
 */
export const validarSelfie = async (
  base64Image: string
): Promise<{ valido: boolean; mensaje: string; advertencias?: string[] }> => {
  try {
    // Crear imagen desde base64
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = base64Image;
    });

    // Detectar rostro
    const resultado = await detectarRostro(img);

    if (!resultado.caraDetectada) {
      return {
        valido: false,
        mensaje: resultado.advertencias[0] || 'No se detectó un rostro válido',
        advertencias: resultado.advertencias,
      };
    }

    if (resultado.cantidad > 1) {
      return {
        valido: false,
        mensaje: 'Solo debe aparecer una persona en la foto',
        advertencias: resultado.advertencias,
      };
    }

    // Si hay advertencias pero la cara fue detectada, permitir con advertencia
    if (resultado.advertencias.length > 0) {
      return {
        valido: true,
        mensaje: 'Rostro detectado',
        advertencias: resultado.advertencias,
      };
    }

    return {
      valido: true,
      mensaje: `Rostro detectado correctamente (confianza: ${Math.round(resultado.confianza * 100)}%)`,
    };
  } catch (error: any) {
    console.error('Error al validar selfie:', error);
    return {
      valido: false,
      mensaje: 'Error al procesar la imagen. Intenta con otra foto.',
    };
  }
};

