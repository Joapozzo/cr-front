import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';

/**
 * Hook para escuchar eventos en tiempo real de un partido específico
 * Se une automáticamente al room del partido y actualiza las queries relevantes
 */
export const usePartidoLive = (idPartido: number | null | undefined) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected || !idPartido) {
      return;
    }

    // Unirse al room del partido
    socket.emit('join:partido', { id_partido: idPartido });

    // Handler para estado cambiado
    const handleEstadoCambiado = (data: { id_partido: number; estado: string }) => {
      if (data.id_partido === idPartido) {
        // Invalidar todas las queries relacionadas al partido
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
        
        // Invalidar queries de listas de partidos (home, equipos, etc.)
        queryClient.invalidateQueries({ queryKey: ['partidos', 'jugador', 'ultimos-proximos'] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'lista'] });
        queryClient.invalidateQueries({ queryKey: ['partidos'] });
        queryClient.invalidateQueries({ queryKey: ['ultimo-proximo-partido'] });
      }
    };

    // Handler para gol registrado
    const handleGolRegistrado = (data: { id_partido: number; gol: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'jugador', 'ultimos-proximos'] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'lista'] });
        
        // Invalidar posiciones cuando hay goles (afecta tabla de posiciones) y forzar refetch
        queryClient.invalidateQueries({ 
          queryKey: ['estadisticas', 'posiciones'],
          refetchType: 'active'
        });
      }
    };

    // Handler para gol editado
    const handleGolEditado = (data: { id_partido: number; gol: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
        
        // Invalidar posiciones cuando se edita un gol y forzar refetch
        queryClient.invalidateQueries({ 
          queryKey: ['estadisticas', 'posiciones'],
          refetchType: 'active'
        });
      }
    };

    // Handler para gol eliminado
    const handleGolEliminado = (data: { id_partido: number; id_gol: number }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'jugador', 'ultimos-proximos'] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'lista'] });
        
        // Invalidar posiciones cuando se elimina un gol y forzar refetch
        queryClient.invalidateQueries({ 
          queryKey: ['estadisticas', 'posiciones'],
          refetchType: 'active'
        });
      }
    };

    // Handler para resultado cambiado
    const handleResultadoCambiado = (data: { id_partido: number; resultado: { goles_local: number; goles_visita: number } }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'jugador', 'ultimos-proximos'] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'lista'] });
        
        // Invalidar posiciones cuando cambia el resultado (afecta puntos) y forzar refetch
        queryClient.invalidateQueries({ 
          queryKey: ['estadisticas', 'posiciones'],
          refetchType: 'active'
        });
      }
    };

    // Handler para amonestación registrada
    const handleAmonestacionRegistrada = (data: { id_partido: number; amonestacion: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Handler para amonestación editada
    const handleAmonestacionEditada = (data: { id_partido: number; amonestacion: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Handler para amonestación eliminada
    const handleAmonestacionEliminada = (data: { id_partido: number; id_amonestacion: number }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Handler para expulsión registrada
    const handleExpulsionRegistrada = (data: { id_partido: number; expulsion: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Handler para expulsión editada
    const handleExpulsionEditada = (data: { id_partido: number; expulsion: any }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Handler para expulsión eliminada
    const handleExpulsionEliminada = (data: { id_partido: number; id_expulsion: number }) => {
      if (data.id_partido === idPartido) {
        queryClient.invalidateQueries({ queryKey: ['incidencias', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partido-completo', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['planillero', 'datos-completos', idPartido] });
        queryClient.invalidateQueries({ queryKey: ['partidos', 'usuario', 'detalle', idPartido] });
      }
    };

    // Registrar todos los listeners
    socket.on('partido:estado_cambiado', handleEstadoCambiado);
    socket.on('partido:gol_registrado', handleGolRegistrado);
    socket.on('partido:gol_editado', handleGolEditado);
    socket.on('partido:gol_eliminado', handleGolEliminado);
    socket.on('partido:resultado_cambiado', handleResultadoCambiado);
    socket.on('partido:amonestacion_registrada', handleAmonestacionRegistrada);
    socket.on('partido:amonestacion_editada', handleAmonestacionEditada);
    socket.on('partido:amonestacion_eliminada', handleAmonestacionEliminada);
    socket.on('partido:expulsion_registrada', handleExpulsionRegistrada);
    socket.on('partido:expulsion_editada', handleExpulsionEditada);
    socket.on('partido:expulsion_eliminada', handleExpulsionEliminada);

    // Cleanup: salir del room y remover listeners
    return () => {
      socket.emit('leave:partido', { id_partido: idPartido });
      socket.off('partido:estado_cambiado', handleEstadoCambiado);
      socket.off('partido:gol_registrado', handleGolRegistrado);
      socket.off('partido:gol_editado', handleGolEditado);
      socket.off('partido:gol_eliminado', handleGolEliminado);
      socket.off('partido:resultado_cambiado', handleResultadoCambiado);
      socket.off('partido:amonestacion_registrada', handleAmonestacionRegistrada);
      socket.off('partido:amonestacion_editada', handleAmonestacionEditada);
      socket.off('partido:amonestacion_eliminada', handleAmonestacionEliminada);
      socket.off('partido:expulsion_registrada', handleExpulsionRegistrada);
      socket.off('partido:expulsion_editada', handleExpulsionEditada);
      socket.off('partido:expulsion_eliminada', handleExpulsionEliminada);
    };
  }, [socket, isConnected, idPartido, queryClient]);
};

