import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';

/**
 * Hook para escuchar actualizaciones en tiempo real de la tabla de posiciones
 */
export const usePosicionesLive = (id_zona?: number | null, id_categoria_edicion?: number | null) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    // Unirse a rooms de posiciones (tanto zona como categoría si están disponibles)
    if (id_zona) {
      socket.emit('join:posiciones', { id_zona });
    }
    if (id_categoria_edicion) {
      socket.emit('join:posiciones', { id_categoria_edicion });
    }

    // Handler para posiciones actualizadas
    const handlePosicionesActualizadas = (data: { id_zona: number; id_categoria_edicion: number }) => {
      console.log('[Posiciones Live] Evento recibido:', data);
      
      // Invalidar queries de posiciones (usando las keys correctas) y forzar refetch
      queryClient.invalidateQueries({ 
        queryKey: ['estadisticas', 'posiciones'],
        refetchType: 'active' // Forzar refetch inmediato de queries activas
      });
      queryClient.invalidateQueries({ 
        queryKey: ['estadisticas', 'posiciones', data.id_categoria_edicion],
        refetchType: 'active'
      });
      
      // IMPORTANTE: Invalidar también las queries de tablas-posiciones (para home)
      queryClient.invalidateQueries({ 
        queryKey: ['tablas-posiciones'],
        refetchType: 'active'
      });
      
      queryClient.invalidateQueries({ queryKey: ['posiciones'] });
      queryClient.invalidateQueries({ queryKey: ['posiciones', data.id_zona] });
      queryClient.invalidateQueries({ queryKey: ['posiciones', 'categoria', data.id_categoria_edicion] });
      queryClient.invalidateQueries({ queryKey: ['tabla-posiciones'] });
    };

    // Escuchar el evento (funciona tanto para rooms como para eventos globales)
    socket.on('posiciones:actualizadas', handlePosicionesActualizadas);

    // Cleanup: salir de los rooms y remover listeners
    return () => {
      if (id_zona) {
        socket.emit('leave:posiciones', { id_zona });
      }
      if (id_categoria_edicion) {
        socket.emit('leave:posiciones', { id_categoria_edicion });
      }
      socket.off('posiciones:actualizadas', handlePosicionesActualizadas);
    };
  }, [socket, isConnected, id_zona, id_categoria_edicion, queryClient]);
};

