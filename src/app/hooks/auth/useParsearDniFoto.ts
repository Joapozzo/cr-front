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
      const response = await api.post('/auth/parsear-dni-foto', input) as ParsearDniFotoResponse;
      return response;
    },
  });
};
