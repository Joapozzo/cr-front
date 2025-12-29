'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FiltrosFixtureProps {
  jornadas: number[];
  jornadaActual: number;
  onJornadaChange: (jornada: number) => void;
  onFechaChange?: (fecha: Date) => void;
  loading?: boolean;
}

export const FiltrosFixture: React.FC<FiltrosFixtureProps> = ({
  jornadas,
  jornadaActual,
  onJornadaChange,
  onFechaChange: _onFechaChange,
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

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-32 bg-[var(--black-800)] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Selector de Jornada */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-3 bg-[var(--black-900)] border border-[#262626] rounded-lg hover:border-[var(--green)] transition-colors text-xs"
        >
          <span className="text-white font-medium">J{jornadaActual}</span>
          <ChevronDown 
            size={14} 
            className={`text-[#737373] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-[var(--black-900)] border border-[#262626] rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto w-24">
            {jornadas.map((jornada) => (
              <button
                key={jornada}
                onClick={() => {
                  onJornadaChange(jornada);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[var(--black-800)] transition-colors ${
                  jornada === jornadaActual
                    ? 'bg-[var(--black-800)] text-[var(--green)] font-medium'
                    : 'text-white'
                }`}
              >
                Jornada {jornada}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TODO: Agregar filtro de fechas/calendario si es necesario */}
      {/* <button
        className="flex items-center gap-2 px-3 py-2 bg-[var(--black-900)] border border-[#262626] rounded-lg hover:border-[var(--green)] transition-colors text-xs"
      >
        <Calendar size={14} className="text-[#737373]" />
        <span className="text-white text-xs">Filtrar</span>
      </button> */}
    </div>
  );
};

