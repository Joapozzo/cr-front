import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api'; 

interface ParsearDniFotoInput {
  imagenBase64: string;
}

interface DatosDNI {
  dni: string;
  nombre: string;
  apellido: string;
  sexo: string;
  fechaNacimiento: string;
}

interface ParsearDniFotoResponse {
  exito: boolean;
  datos?: DatosDNI;
  error?: string;
}

export const useParsearDniFoto = () => {
  return useMutation({
    mutationFn: async (input: ParsearDniFotoInput): Promise<ParsearDniFotoResponse> => {
      // Timeout aumentado a 30 segundos para procesamiento de imágenes
      const response = await api.post('/auth/parsear-dni-foto', input, { 
        timeout: 30000 
      }) as ParsearDniFotoResponse;
      return response;
    },
    // Retry con backoff exponencial para errores transitorios
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
