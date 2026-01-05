"use client";

import { Suspense, lazy } from "react";
import {
  PartidosEquipoCardFallback,
  TablaPosicionesHomeFallback,
  SancionesHomeFallback,
  NoticiasHomeFallback,
  UnirseEquipoCardFallback,
} from "./homeFallbacks";

// Lazy load components
const UnirseEquipoCard = lazy(() =>
  import("./UnirseEquipoCard").then((module) => ({ default: module.UnirseEquipoCard }))
);

const PartidosEquipoCard = lazy(() =>
  import("./PartidosEquipoCard").then((module) => ({ default: module.PartidosEquipoCard }))
);

const TablaPosiciones = lazy(() =>
  import("../posiciones/TablaPosiciones").then((module) => ({ default: module.TablaPosiciones }))
);

const SancionesHome = lazy(() =>
  import("./SancionesHome").then((module) => ({ default: module.SancionesHome }))
);

const NoticiasHome = lazy(() =>
  import("./NoticiasHome").then((module) => ({ default: module.NoticiasHome }))
);

interface LazyUnirseEquipoCardProps {
  show: boolean;
}

export const LazyUnirseEquipoCard = ({ show }: LazyUnirseEquipoCardProps) => {
  if (!show) return null;

  return (
    <Suspense fallback={<UnirseEquipoCardFallback />}>
      <UnirseEquipoCard />
    </Suspense>
  );
};

interface LazyPartidosEquipoCardProps {
  show: boolean;
}

export const LazyPartidosEquipoCard = ({ show }: LazyPartidosEquipoCardProps) => {
  if (!show) return null;

  return (
    <Suspense fallback={<PartidosEquipoCardFallback />}>
      <PartidosEquipoCard />
    </Suspense>
  );
};

interface LazyTablaPosicionesHomeProps {
  linkTablaCompleta?: string;
}

export const LazyTablaPosicionesHome = ({ linkTablaCompleta = "/estadisticas" }: LazyTablaPosicionesHomeProps) => {
  return (
    <Suspense fallback={<TablaPosicionesHomeFallback />}>
      <TablaPosiciones variant="home" linkTablaCompleta={linkTablaCompleta} limitPosiciones={6} />
    </Suspense>
  );
};

export const LazySancionesHome = () => {
  return (
    <Suspense fallback={<SancionesHomeFallback />}>
      <SancionesHome />
    </Suspense>
  );
};

interface LazyNoticiasHomeProps {
  linkNoticiasCompleta?: string;
}

export const LazyNoticiasHome = ({ linkNoticiasCompleta = "/noticias" }: LazyNoticiasHomeProps) => {
  return (
    <Suspense fallback={<NoticiasHomeFallback />}>
      <NoticiasHome linkNoticiasCompleta={linkNoticiasCompleta} />
    </Suspense>
  );
};

