"use client";

import { useEffect } from "react";
import { EstadoPartido, PartidoCompleto } from "@/app/types/partido";
import usePartidoStore from "@/app/stores/partidoStore";

interface UseSyncPartidoToStoreProps {
  partido?: PartidoCompleto | null;
}

export function useSyncPartidoToStore({ partido }: UseSyncPartidoToStoreProps) {
  const {
    setEstadoPartido,
    setHoraInicio,
    setHoraInicioSegundoTiempo,
    setMinutosPorTiempo,
    setMinutosEntretiempo,
  } = usePartidoStore();

  useEffect(() => {
    if (!partido) return;

    if (partido.estado) {
      setEstadoPartido(partido.estado as EstadoPartido);
    }

    if (partido.categoriaEdicion?.duracion_tiempo) {
      setMinutosPorTiempo(partido.categoriaEdicion.duracion_tiempo);
    }

    if (partido.categoriaEdicion?.duracion_entretiempo) {
      setMinutosEntretiempo(partido.categoriaEdicion.duracion_entretiempo);
    }

    if (
      ["C1", "C2", "T"].includes(partido.estado) &&
      partido.hora_inicio
    ) {
      setHoraInicio(new Date(partido.hora_inicio));
    }

    if (
      ["C2", "T"].includes(partido.estado) &&
      partido.hora_inicio_segundo_tiempo
    ) {
      setHoraInicioSegundoTiempo(
        new Date(partido.hora_inicio_segundo_tiempo)
      );
    }
  }, [
    partido,
    setEstadoPartido,
    setHoraInicio,
    setHoraInicioSegundoTiempo,
    setMinutosPorTiempo,
    setMinutosEntretiempo,
  ]);
}
