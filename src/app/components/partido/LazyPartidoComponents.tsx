"use client";

import { Suspense, lazy } from "react";
import { EstadoPartido } from "@/app/types/partido";
import {
  CardPartidoHeaderFallback,
  JugadoresTabsUnifiedFallback,
  CaraACaraTabFallback,
  PreviaTabFallback,
} from "./partidoFallbacks";

// Lazy load components - Preload para mejorar rendimiento
const PartidoHeaderSticky = lazy(() =>
  import("./CardPartidoHeader").then((module) => ({ default: module.default }))
);

const JugadoresTabsUnified = lazy(() =>
  import("./JugadoresTabsUnified").then((module) => ({ default: module.default }))
);

const PreviaTab = lazy(() =>
  import("./PreviaTab").then((module) => ({ default: module.PreviaTab }))
);

const CaraACaraTab = lazy(() =>
  import("./CaraACaraTab").then((module) => ({ default: module.CaraACaraTab }))
);

// Lazy wrappers con Suspense
interface LazyCardPartidoHeaderProps {
  partido: any;
  goles?: any[];
  esPlanillero?: boolean;
  isLoading?: boolean;
  cronometro?: any;
  [key: string]: any;
}

export const LazyCardPartidoHeader = (props: LazyCardPartidoHeaderProps) => {
  // Si no hay partido, mostrar fallback directamente
  if (!props.partido) {
    return <CardPartidoHeaderFallback />;
  }

  // Suspense manejará el loading del componente lazy
  // El componente se renderiza directamente cuando hay datos
  return (
    <Suspense fallback={<CardPartidoHeaderFallback />}>
      <PartidoHeaderSticky {...props} />
    </Suspense>
  );
};

interface LazyJugadoresTabsUnifiedProps {
  mode: 'view' | 'planillero';
  estadoPartido?: EstadoPartido;
  equipoLocal: any;
  equipoVisita: any;
  incidencias?: any[];
  destacados?: any[];
  jugadorDestacado?: any;
  cambios?: any[];
  idPartido?: number;
  loading?: boolean;
  [key: string]: any;
}

export const LazyJugadoresTabsUnified = (props: LazyJugadoresTabsUnifiedProps) => {
  // Suspense manejará el loading del componente lazy
  // El componente se renderiza directamente cuando hay datos
  // Proporcionar valores por defecto para props requeridas
  return (
    <Suspense fallback={<JugadoresTabsUnifiedFallback />}>
      <JugadoresTabsUnified 
        {...props}
        incidencias={props.incidencias || []}
        jugadorDestacado={props.jugadorDestacado ?? null}
      />
    </Suspense>
  );
};

interface LazyPreviaTabProps {
  ultimosPartidosLocal?: any[];
  ultimosPartidosVisita?: any[];
  nombreEquipoLocal?: string;
  nombreEquipoVisita?: string;
  idEquipoLocal?: number;
  idEquipoVisita?: number;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const LazyPreviaTab = (props: LazyPreviaTabProps) => {
  // Suspense manejará el loading del componente lazy
  // El componente PreviaTab manejará su propio estado interno
  // Proporcionar valores por defecto para props requeridas
  return (
    <Suspense fallback={<PreviaTabFallback />}>
      <PreviaTab 
        {...props}
        ultimosPartidosLocal={props.ultimosPartidosLocal || []}
        ultimosPartidosVisita={props.ultimosPartidosVisita || []}
        nombreEquipoLocal={props.nombreEquipoLocal || 'Local'}
        nombreEquipoVisita={props.nombreEquipoVisita || 'Visitante'}
      />
    </Suspense>
  );
};

interface LazyCaraACaraTabProps {
  historial?: any[];
  idEquipoLocal?: number;
  idEquipoVisita?: number;
  nombreEquipoLocal?: string;
  nombreEquipoVisita?: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const LazyCaraACaraTab = (props: LazyCaraACaraTabProps) => {
  // Suspense manejará el loading del componente lazy
  // El componente CaraACaraTab manejará su propio estado interno
  // Proporcionar valores por defecto para props requeridas
  return (
    <Suspense fallback={<CaraACaraTabFallback />}>
      <CaraACaraTab 
        {...props}
        historial={props.historial || []}
        idEquipoLocal={props.idEquipoLocal || 0}
        idEquipoVisita={props.idEquipoVisita || 0}
        nombreEquipoLocal={props.nombreEquipoLocal || 'Local'}
        nombreEquipoVisita={props.nombreEquipoVisita || 'Visitante'}
      />
    </Suspense>
  );
};

