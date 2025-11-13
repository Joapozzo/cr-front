// src/hooks/storage/useUploadImage.ts
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/lib/firebase.config';
import { authService } from '@/app/services/auth.services';

export const useUploadImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (
    file: File,
    folder: 'dni_frente' | 'dni_dorso' | 'selfie'
  ): Promise<string> => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Obtener UID del usuario actual
      const user = authService.obtenerUsuarioActual();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Crear referencia con nombre único
      const timestamp = Date.now();
      const fileName = `${folder}_${timestamp}.jpg`;
      const storageRef = ref(storage, `usuarios/${user.uid}/${fileName}`);

      // Subir archivo
      setProgress(50);
      await uploadBytes(storageRef, file);

      // Obtener URL de descarga
      setProgress(75);
      const downloadURL = await getDownloadURL(storageRef);

      setProgress(100);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return { uploadImage, isUploading, progress };
};