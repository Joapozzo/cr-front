'use client';

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useEdicionesConCategorias } from '@/app/hooks/useEdiciones';

interface EdicionConCategorias {
  id_edicion: number;
  nombre: string;
  temporada: number;
  img: string | null;
  categorias: Array<{
    id_categoria_edicion: number;
    nombre: string;
    color?: string | null;
  }>;
}

interface CategoriaSeleccionada {
  id: number;
  nombre: string;
  edicion: string;
  id_edicion: number;
  img_edicion: string | null;
  nombre_edicion: string;
  temporada_edicion: number;
  color?: string | null;
}

interface EdicionCategoriaContextType {
  edicionesConCategorias: EdicionConCategorias[] | undefined;
  isLoading: boolean;
  edicionSeleccionada: EdicionConCategorias | null;
  categoriaSeleccionada: CategoriaSeleccionada | null;
  categoriasDisponibles: CategoriaSeleccionada[];
  setEdicionSeleccionada: (idEdicion: number | null) => void;
  setCategoriaSeleccionada: (categoria: CategoriaSeleccionada | null) => void;
  edicionActual: {
    id_edicion: number;
    nombre: string;
    temporada: number;
    img: string | null;
  } | null;
}

const EdicionCategoriaContext = createContext<EdicionCategoriaContextType | undefined>(undefined);

export const EdicionCategoriaProvider = ({ children }: { children: ReactNode }) => {
  const { data: edicionesConCategorias, isLoading } = useEdicionesConCategorias();
  const [edicionSeleccionadaId, setEdicionSeleccionadaId] = useState<number | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaSeleccionada | null>(null);

  // Obtener todas las categorías disponibles de todas las ediciones
  const categoriasDisponibles = useMemo(() => {
    if (!edicionesConCategorias) return [];
    
    const categorias: CategoriaSeleccionada[] = [];
    edicionesConCategorias.forEach(edicion => {
      edicion.categorias.forEach(categoria => {
        categorias.push({
          id: categoria.id_categoria_edicion,
          nombre: categoria.nombre,
          edicion: `${edicion.nombre} ${edicion.temporada}`,
          id_edicion: edicion.id_edicion,
          img_edicion: edicion.img,
          nombre_edicion: edicion.nombre,
          temporada_edicion: edicion.temporada,
          color: categoria.color
        });
      });
    });
    
    return categorias;
  }, [edicionesConCategorias]);

  // Obtener la edición seleccionada
  const edicionSeleccionada = useMemo(() => {
    if (!edicionesConCategorias) return null;
    
    // Si hay una edición seleccionada, usarla
    if (edicionSeleccionadaId) {
      return edicionesConCategorias.find(e => e.id_edicion === edicionSeleccionadaId) || null;
    }
    
    // Si hay una categoría seleccionada, usar su edición
    if (categoriaSeleccionada) {
      return edicionesConCategorias.find(e => e.id_edicion === categoriaSeleccionada.id_edicion) || null;
    }
    
    // Si no hay selección, usar la primera edición disponible
    return edicionesConCategorias[0] || null;
  }, [edicionSeleccionadaId, categoriaSeleccionada, edicionesConCategorias]);

  // Obtener información de la edición actual para mostrar
  const edicionActual = useMemo(() => {
    if (!edicionSeleccionada) return null;
    
    return {
      id_edicion: edicionSeleccionada.id_edicion,
      nombre: edicionSeleccionada.nombre,
      temporada: edicionSeleccionada.temporada,
      img: edicionSeleccionada.img
    };
  }, [edicionSeleccionada]);

  // Inicializar edición seleccionada cuando cargan los datos
  useEffect(() => {
    if (!isLoading && edicionesConCategorias && edicionesConCategorias.length > 0 && !edicionSeleccionadaId && !categoriaSeleccionada) {
      // Si hay categorías disponibles, seleccionar la primera
      if (categoriasDisponibles.length > 0) {
        setCategoriaSeleccionada(categoriasDisponibles[0]);
      } else {
        // Si no hay categorías, al menos seleccionar la primera edición
        setEdicionSeleccionadaId(edicionesConCategorias[0].id_edicion);
      }
    }
  }, [isLoading, edicionesConCategorias, categoriasDisponibles, edicionSeleccionadaId, categoriaSeleccionada]);

  // Asegurar que siempre haya una categoría seleccionada cuando hay categorías disponibles
  useEffect(() => {
    if (!isLoading && categoriasDisponibles.length > 0 && !categoriaSeleccionada) {
      // Si hay una edición seleccionada, buscar categorías de esa edición
      if (edicionSeleccionada) {
        const categoriasDeEdicion = categoriasDisponibles.filter(cat => cat.id_edicion === edicionSeleccionada.id_edicion);
        if (categoriasDeEdicion.length > 0) {
          setCategoriaSeleccionada(categoriasDeEdicion[0]);
          return;
        }
      }
      // Si no hay edición seleccionada o no hay categorías de esa edición, seleccionar la primera disponible
      setCategoriaSeleccionada(categoriasDisponibles[0]);
    }
  }, [isLoading, categoriasDisponibles, categoriaSeleccionada, edicionSeleccionada]);

  // Cuando cambia la edición seleccionada, asegurar que haya una categoría seleccionada de esa edición
  useEffect(() => {
    if (!isLoading && edicionSeleccionada && categoriasDisponibles.length > 0) {
      // Si no hay categoría seleccionada o la categoría seleccionada no pertenece a la edición actual
      if (!categoriaSeleccionada || categoriaSeleccionada.id_edicion !== edicionSeleccionada.id_edicion) {
        const categoriasDeEdicion = categoriasDisponibles.filter(cat => cat.id_edicion === edicionSeleccionada.id_edicion);
        if (categoriasDeEdicion.length > 0) {
          setCategoriaSeleccionada(categoriasDeEdicion[0]);
        }
      }
    }
  }, [isLoading, edicionSeleccionada, categoriasDisponibles, categoriaSeleccionada]);

  // Cuando se selecciona una edición, actualizar el estado
  const handleSetEdicionSeleccionada = (idEdicion: number | null) => {
    setEdicionSeleccionadaId(idEdicion);
    // El useEffect anterior se encargará de seleccionar la categoría correcta
  };

  const value: EdicionCategoriaContextType = {
    edicionesConCategorias,
    isLoading,
    edicionSeleccionada,
    categoriaSeleccionada,
    categoriasDisponibles,
    setEdicionSeleccionada: handleSetEdicionSeleccionada,
    setCategoriaSeleccionada,
    edicionActual
  };

  return (
    <EdicionCategoriaContext.Provider value={value}>
      {children}
    </EdicionCategoriaContext.Provider>
  );
};

export const useEdicionCategoria = () => {
  const context = useContext(EdicionCategoriaContext);
  if (context === undefined) {
    throw new Error('useEdicionCategoria must be used within EdicionCategoriaProvider');
  }
  return context;
};

