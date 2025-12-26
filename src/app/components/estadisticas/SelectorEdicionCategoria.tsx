'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';

/**
 * Selector de ediciones y categorías reutilizable
 * Primero selecciona edición, luego categorías de esa edición
 */
export const SelectorEdicionCategoria = () => {
  const {
    isLoading,
    edicionSeleccionada,
    categoriaSeleccionada,
    categoriasDisponibles,
    setCategoriaSeleccionada
  } = useEdicionCategoria();

  const [isOpenCategoria, setIsOpenCategoria] = useState(false);
  const [searchTermCategoria, setSearchTermCategoria] = useState('');
  const categoriaDropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar categorías solo de la edición seleccionada
  const categoriasDeEdicionSeleccionada = useMemo(() => {
    if (!edicionSeleccionada) return [];
    return categoriasDisponibles.filter(cat => cat.id_edicion === edicionSeleccionada.id_edicion);
  }, [edicionSeleccionada, categoriasDisponibles]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriaDropdownRef.current && !categoriaDropdownRef.current.contains(event.target as Node)) {
        setIsOpenCategoria(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar categorías por búsqueda (solo de la edición seleccionada)
  const categoriasFiltradas = categoriasDeEdicionSeleccionada.filter(cat => {
    return cat.nombre.toLowerCase().includes(searchTermCategoria.toLowerCase()) ||
           cat.edicion.toLowerCase().includes(searchTermCategoria.toLowerCase());
  });

  const handleSeleccionarCategoria = (categoria: typeof categoriasDisponibles[0]) => {
    setCategoriaSeleccionada(categoria);
    setIsOpenCategoria(false);
    setSearchTermCategoria('');
  };

  if (isLoading) {
    return (
      <div className="h-10 bg-[var(--black-800)] rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de Categoría (solo si hay edición seleccionada y categorías disponibles) */}
      {edicionSeleccionada && categoriasDeEdicionSeleccionada.length > 0 && (
        <div className="relative w-full max-w-md" ref={categoriaDropdownRef}>
          <button
            onClick={() => setIsOpenCategoria(!isOpenCategoria)}
            className="w-full flex items-center justify-between gap-2 bg-[var(--black-900)] border border-[#262626] rounded-lg px-3 py-2 hover:border-[var(--green)] transition-colors text-sm"
          >
            <span className="text-[#737373]">
              {categoriaSeleccionada && categoriaSeleccionada.id_edicion === edicionSeleccionada.id_edicion 
                ? `Categoría: ${categoriaSeleccionada.nombre}`
                : 'Seleccionar categoría'}
            </span>
            <ChevronDown 
              className={`text-[#737373] transition-transform duration-200 ${isOpenCategoria ? 'rotate-180' : ''}`} 
              size={16} 
            />
          </button>

            {isOpenCategoria && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--black-900)] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[#262626] bg-[var(--black-800)]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar categoría..."
                      value={searchTermCategoria}
                      onChange={(e) => setSearchTermCategoria(e.target.value)}
                      className="w-full bg-[var(--black-900)] border border-[#262626] text-white text-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => handleSeleccionarCategoria(categoria)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--black-800)] transition-colors text-left ${
                          categoriaSeleccionada?.id === categoria.id ? 'bg-[var(--black-800)]' : ''
                        }`}
                      >
                        <p className={`text-sm font-medium flex-1 ${
                          categoriaSeleccionada?.id === categoria.id ? 'text-[var(--green)]' : 'text-white'
                        }`}>
                          {categoria.nombre}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-[#737373] text-sm">No se encontraron categorías</p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

