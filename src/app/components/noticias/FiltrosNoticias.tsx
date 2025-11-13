'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export type OrdenNoticias = 'fecha-desc' | 'fecha-asc' | 'visitas-desc' | 'visitas-asc';

interface FiltrosNoticiasProps {
  busqueda: string;
  onBusquedaChange: (busqueda: string) => void;
  orden: OrdenNoticias;
  onOrdenChange: (orden: OrdenNoticias) => void;
  destacadas: boolean;
  onDestacadasChange: (destacadas: boolean) => void;
  loading?: boolean;
}

const opcionesOrden: { value: OrdenNoticias; label: string }[] = [
  { value: 'fecha-desc', label: 'Más recientes' },
  { value: 'fecha-asc', label: 'Más antiguas' },
  { value: 'visitas-desc', label: 'Más vistas' },
  { value: 'visitas-asc', label: 'Menos vistas' }
];

export const FiltrosNoticias: React.FC<FiltrosNoticiasProps> = ({
  busqueda,
  onBusquedaChange,
  orden,
  onOrdenChange,
  destacadas,
  onDestacadasChange,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ordenActual = opcionesOrden.find(o => o.value === orden);

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 bg-[var(--black-800)] rounded-lg animate-pulse" />
        <div className="h-10 w-full sm:w-40 bg-[var(--black-800)] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full bg-[var(--black-900)] border border-[#262626] rounded-lg pl-10 pr-10 py-2.5 text-white text-sm placeholder:text-[#737373] focus:outline-none focus:border-[var(--green)] transition-colors"
          />
          {busqueda && (
            <button
              onClick={() => onBusquedaChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Selector de orden */}
        <div className="relative w-full sm:w-48" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-[var(--black-900)] border border-[#262626] rounded-lg hover:border-[var(--green)] transition-colors text-sm"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#737373]" />
              <span className="text-white text-xs">{ordenActual?.label}</span>
            </div>
            <svg
              className={`w-4 h-4 text-[#737373] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--black-900)] border border-[#262626] rounded-lg shadow-2xl z-50 overflow-hidden">
              {opcionesOrden.map((opcion) => (
                <button
                  key={opcion.value}
                  onClick={() => {
                    onOrdenChange(opcion.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-xs hover:bg-[var(--black-800)] transition-colors ${
                    orden === opcion.value
                      ? 'bg-[var(--black-800)] text-[var(--green)] font-medium'
                      : 'text-white'
                  }`}
                >
                  {opcion.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtro de destacadas */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDestacadasChange(!destacadas)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            destacadas
              ? 'bg-[var(--green)] text-white'
              : 'bg-[var(--black-900)] border border-[#262626] text-[#737373] hover:text-white hover:border-[var(--green)]'
          }`}
        >
          ⭐ Solo destacadas
        </button>
      </div>
    </div>
  );
};

