import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';

/**
 * Hook para escuchar eventos globales de partidos (para actualizar listas)
 * No requiere un id_partido específico, escucha todos los eventos globales
 */
export const usePartidosGlobalLive = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    // Handler para eventos globales de partidos
    const handleGlobalPartidoEvent = (data: { id_partido: number; [key: string]: any }) => {
      console.log(`[Global Live] Evento recibido para partido ${data.id_partido}:`, data);
      
      // Invalidar queries generales de listas de partidos y forzar refetch inmediato
      queryClient.invalidateQueries({ 
        queryKey: ['partidos'],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['partidos', 'generales'],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['partidos', 'jugador', 'ultimos-proximos'],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['partidos', 'usuario', 'lista'],
        refetchType: 'active'
      });
      
      // Invalidar posiciones cuando hay eventos de goles (afectan tabla de posiciones) y forzar refetch
      if (data.gol || data.resultado) {
        queryClient.invalidateQueries({ 
          queryKey: ['estadisticas', 'posiciones'],
          refetchType: 'active'
        });
      }
    };

    // Escuchar eventos globales (emitidos sin room específico)
    socket.on('partido:estado_cambiado', handleGlobalPartidoEvent);
    socket.on('partido:resultado_cambiado', handleGlobalPartidoEvent);
    socket.on('partido:gol_registrado', handleGlobalPartidoEvent);
    socket.on('partido:gol_editado', handleGlobalPartidoEvent);
    socket.on('partido:gol_eliminado', handleGlobalPartidoEvent);

    // Cleanup: remover listeners
    return () => {
      socket.off('partido:estado_cambiado', handleGlobalPartidoEvent);
      socket.off('partido:resultado_cambiado', handleGlobalPartidoEvent);
      socket.off('partido:gol_registrado', handleGlobalPartidoEvent);
      socket.off('partido:gol_editado', handleGlobalPartidoEvent);
      socket.off('partido:gol_eliminado', handleGlobalPartidoEvent);
    };
  }, [socket, isConnected, queryClient]);
};

