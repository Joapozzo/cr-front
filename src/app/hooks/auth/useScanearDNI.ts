import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api'; 

interface ParsearCodigoInput {
  codigoBarras: string;
}

interface DatosDNI {
  dni: string;
  nombre: string;
  apellido: string;
  sexo: string;
  fechaNacimiento: string;
}

interface ParsearCodigoResponse {
  exito: boolean;
  datos?: DatosDNI;
  error?: string;
}

export const useParsearCodigoDNI = () => {
  return useMutation({
    mutationFn: async (input: ParsearCodigoInput): Promise<ParsearCodigoResponse> => {
      const response = await api.post('/auth/parsear-codigo-dni', input);
      return response;
    },
  });
};
