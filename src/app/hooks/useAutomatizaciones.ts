import { useMutation, useQueryClient } from '@tanstack/react-query';
import { temporadasService } from '../services/temporadas.services';
import { ConfigurarAutomatizacionPartidoData, OcuparVacanteConAutomatizacionInput } from '../types/temporada';
import { zonasKeys } from './useZonas';

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
            // Invalidar todas las queries de zonas para que se refresquen automáticamente
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });
            
            // Invalidar todas las queries de zonas por fase para esta categoría
            // Esto cubrirá todas las fases posibles
            queryClient.invalidateQueries({ 
                queryKey: ['zonas', 'fase', variables.id_categoria_edicion],
                exact: false 
            });

            // Invalidar queries de temporadas relacionadas
            queryClient.invalidateQueries({
                queryKey: ['temporadas'],
                exact: false
            });
            
            // Invalidar queries de tabla de posiciones
            queryClient.invalidateQueries({
                queryKey: ['tabla-posiciones'],
                exact: false
            });

            ('✅ Vacante ocupada con automatización:', data.mensaje);
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
        onSuccess: async (data, variables) => {
            // Invalidar queries relacionadas con el partido
            queryClient.invalidateQueries({
                queryKey: ['partido', variables.id_partido]
            });
            queryClient.invalidateQueries({
                queryKey: ['partidos']
            });

            // También invalidar todas las zonas ya que el partido puede afectar la visualización
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });

            ('✅ Automatización de partido configurada:', data.mensaje);
        },
        onError: (error: Error) => {
            console.error('❌ Error al configurar automatización de partido:', error.message);
        },
    });
};