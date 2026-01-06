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
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calcular posición del dropdown para evitar que se salga de la pantalla
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 120; // Ancho aproximado del dropdown
      
      // Si el botón está cerca del borde derecho, posicionar el dropdown a la derecha
      if (buttonRect.left + dropdownWidth > viewportWidth - 16) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('left');
      }
    }
  }, [isOpen]);

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
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-3 bg-[var(--black-900)] border border-[#262626] rounded-lg hover:border-[var(--color-primary)] transition-colors text-xs whitespace-nowrap"
        >
          <span className="text-white font-medium">J{jornadaActual}</span>
          <ChevronDown 
            size={14} 
            className={`text-[#737373] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className={`absolute top-full mt-2 bg-[var(--black-900)] border border-[#262626] rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto min-w-[120px] ${
              dropdownPosition === 'right' ? 'right-0' : 'left-0'
            }`}
            style={{ maxWidth: 'calc(100vw - 2rem)' }}
          >
            {jornadas.map((jornada) => (
              <button
                key={jornada}
                onClick={() => {
                  onJornadaChange(jornada);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[var(--black-800)] transition-colors whitespace-nowrap ${
                  jornada === jornadaActual
                    ? 'bg-[var(--black-800)] text-[var(--color-primary)] font-medium'
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
        className="flex items-center gap-2 px-3 py-2 bg-[var(--black-900)] border border-[#262626] rounded-lg hover:border-[var(--color-primary)] transition-colors text-xs"
      >
        <Calendar size={14} className="text-[#737373]" />
        <span className="text-white text-xs">Filtrar</span>
      </button> */}
    </div>
  );
};

