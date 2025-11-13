import { useMutation, useQueryClient } from '@tanstack/react-query';
import { temporadasService } from '../services/temporadas.services';
import { ConfigurarAutomatizacionPartidoData, OcuparVacanteConAutomatizacionInput } from '../types/temporada';

export const useOcuparVacanteConAutomatizacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ 
            vacante, 
            id_zona, 
            id_categoria_edicion, 
            id_zona_previa, 
            pos_zona_previa 
        }: OcuparVacanteConAutomatizacionInput) => {
            return await temporadasService.ocuparVacanteConAutomatizacion({
                vacante,
                id_zona,
                id_categoria_edicion,
                id_zona_previa,
                pos_zona_previa
            });
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con la zona y categoría
            queryClient.invalidateQueries({
                queryKey: ['zona', variables.id_zona]
            });
            queryClient.invalidateQueries({
                queryKey: ['zonas', variables.id_categoria_edicion]
            });
            queryClient.invalidateQueries({
                queryKey: ['temporadas', variables.id_zona, variables.id_categoria_edicion]
            });
            queryClient.invalidateQueries({
                queryKey: ['tabla-posiciones']
            });

            console.log('✅ Vacante ocupada con automatización:', data.mensaje);
        },
        onError: (error: Error) => {
            console.error('❌ Error al ocupar vacante con automatización:', error.message);
        },
    });
};

export const useConfigurarAutomatizacionPartido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ 
            id_partido, 
            vacante, 
            id_partido_previo, 
            res_partido_previo 
        }: ConfigurarAutomatizacionPartidoData) => {
            return await temporadasService.configurarAutomatizacionPartido(id_partido, {
                vacante,
                id_partido_previo,
                res_partido_previo
            });
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con el partido
            queryClient.invalidateQueries({
                queryKey: ['partido', variables.id_partido]
            });
            queryClient.invalidateQueries({
                queryKey: ['partidos']
            });

            console.log('✅ Automatización de partido configurada:', data.mensaje);
        },
        onError: (error: Error) => {
            console.error('❌ Error al configurar automatización de partido:', error.message);
        },
    });
};