'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ObtenerEquiposActualesDelJugadorResponse } from '@/app/types/jugador';

interface EquipoContextType {
  equipoSeleccionado: ObtenerEquiposActualesDelJugadorResponse | null;
  setEquipoSeleccionado: (equipo: ObtenerEquiposActualesDelJugadorResponse | null) => void;
}

const EquipoContext = createContext<EquipoContextType | undefined>(undefined);

export function EquipoProvider({ 
  children, 
  equiposUsuario 
}: { 
  children: ReactNode;
  equiposUsuario: ObtenerEquiposActualesDelJugadorResponse[] | undefined;
}) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<ObtenerEquiposActualesDelJugadorResponse | null>(null);

  // Inicializar equipo seleccionado cuando se cargan los equipos
  useEffect(() => {
    if (!equipoSeleccionado && equiposUsuario && equiposUsuario.length > 0) {
      setEquipoSeleccionado(equiposUsuario[0]);
    }
  }, [equiposUsuario, equipoSeleccionado]);

  return (
    <EquipoContext.Provider value={{ equipoSeleccionado, setEquipoSeleccionado }}>
      {children}
    </EquipoContext.Provider>
  );
}

export function useEquipoSeleccionado() {
  const context = useContext(EquipoContext);
  if (context === undefined) {
    throw new Error('useEquipoSeleccionado must be used within an EquipoProvider');
  }
  return context;
}

