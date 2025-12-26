'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface CategoriaOption {
  id: number;
  nombre: string;
  edicion: string;
  [key: string]: any; // Permitir campos adicionales
}

interface CategoriaSelectorProps {
  categorias: CategoriaOption[];
  categoriaSeleccionada?: CategoriaOption | null;
  onSeleccionar: (categoria: CategoriaOption) => void;
  loading?: boolean;
}

/**
 * Selector de categorías con búsqueda y dropdown
 * Permite filtrar y seleccionar una categoría
 */
export const CategoriaSelector: React.FC<CategoriaSelectorProps> = ({
  categorias,
  categoriaSeleccionada,
  onSeleccionar,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar categorías por búsqueda
  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.edicion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeleccionar = (categoria: CategoriaOption) => {
    onSeleccionar(categoria);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="h-12 bg-[var(--black-800)] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      {/* Botón selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-[var(--black-900)] border border-[#262626] rounded-xl px-4 py-3 hover:border-[var(--green)] transition-colors"
      >
        <div className="flex-1 text-left">
          {categoriaSeleccionada ? (
            <>
              <p className="text-white font-medium text-sm">{categoriaSeleccionada.nombre}</p>
              <p className="text-[#737373] text-xs mt-0.5">{categoriaSeleccionada.edicion}</p>
            </>
          ) : (
            <p className="text-[#737373] text-sm">Seleccionar categoría</p>
          )}
        </div>
        <ChevronDown 
          className={`text-[#737373] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--black-900)] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Búsqueda */}
          <div className="p-3 border-b border-[#262626] bg-[var(--black-800)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={16} />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--black-900)] border border-[#262626] text-white text-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
            </div>
          </div>

          {/* Lista de categorías */}
          <div className="max-h-64 overflow-y-auto">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => handleSeleccionar(categoria)}
                  className={`w-full flex flex-col items-start gap-1 px-4 py-3 hover:bg-[var(--black-800)] transition-colors text-left ${
                    categoriaSeleccionada?.id === categoria.id ? 'bg-[var(--black-800)]' : ''
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    categoriaSeleccionada?.id === categoria.id ? 'text-[var(--green)]' : 'text-white'
                  }`}>
                    {categoria.nombre}
                  </p>
                  <p className="text-xs text-[#737373]">{categoria.edicion}</p>
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
  );
};

