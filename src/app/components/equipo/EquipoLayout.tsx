'use client';

import { ImagenPublica } from '../common/ImagenPublica';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { ChevronDown, Crown, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ObtenerEquiposActualesDelJugadorResponse } from '@/app/types/jugador';

interface EquipoLayoutProps {
  // Data del equipo actual
  idEquipo: number;
  nombreEquipo: string;
  imgEquipo?: string | null;
  
  // Data del usuario (si pertenece al equipo)
  perteneceAlEquipo: boolean;
  esCapitan: boolean;
  
  // Equipos del usuario (para el selector)
  equiposDelUsuario?: ObtenerEquiposActualesDelJugadorResponse[];
  onCambiarEquipo?: (idEquipo: number) => void;
  
  // Children (tabs y contenido)
  children: React.ReactNode;
}

export const EquipoLayout: React.FC<EquipoLayoutProps> = ({
  idEquipo,
  nombreEquipo,
  imgEquipo,
  perteneceAlEquipo,
  esCapitan,
  equiposDelUsuario = [],
  onCambiarEquipo,
  children
}) => {
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Cerrar selector al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setSelectorAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mostrar selector solo si pertenece al equipo Y tiene más de 1 equipo
  const mostrarSelector = perteneceAlEquipo && equiposDelUsuario.length > 1;

  return (
    <div className="space-y-0 w-full">
      {/* Header del equipo */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-t-xl p-4">
        <div className="flex items-center gap-4">
          {/* Escudo del equipo */}
          <div className="flex-shrink-0">
            <EscudoEquipo
              src={imgEquipo}
              alt={nombreEquipo}
              size={64}
            />
          </div>

          {/* Nombre y selector */}
          <div className="flex-1 min-w-0">
            {/* Nombre del equipo + Selector */}
            {mostrarSelector ? (
              <div className="relative" ref={selectorRef}>
                <button
                  onClick={() => setSelectorAbierto(!selectorAbierto)}
                  className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                >
                  <h1 className="text-white font-bold text-xl truncate">
                    {nombreEquipo}
                  </h1>
                  <ChevronDown 
                    size={18} 
                    className={`text-[#737373] group-hover:text-white transition-all ${
                      selectorAbierto ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown de equipos */}
                {selectorAbierto && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--black-900)] border border-[#262626] rounded-lg shadow-2xl z-50 overflow-hidden">
                    {equiposDelUsuario.map((eq) => (
                      <button
                        key={eq.id_equipo}
                        onClick={() => {
                          onCambiarEquipo?.(eq.id_equipo);
                          setSelectorAbierto(false);
                        }}
                        className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[var(--black-800)] transition-colors ${
                          eq.id_equipo === idEquipo ? 'bg-[var(--black-800)]' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <EscudoEquipo
                            src={eq.img_equipo}
                            alt={eq.nombre_equipo}
                            size={32}
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            eq.id_equipo === idEquipo ? 'text-[var(--green)]' : 'text-white'
                          }`}>
                            {eq.nombre_equipo}
                          </p>
                          <p className="text-[10px] text-[#737373] truncate">
                            {eq.nombre_categoria}
                          </p>
                        </div>
                        {eq.es_capitan && (
                          <Crown size={14} className="text-yellow-500 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <h1 className="text-white font-bold text-xl truncate">
                {nombreEquipo}
              </h1>
            )}

            {/* Badge de rol (solo si pertenece al equipo) */}
            {perteneceAlEquipo && (
              <div className="flex items-center gap-2 mt-2">
                {esCapitan ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <Crown size={12} className="text-yellow-500" />
                    <span className="text-yellow-500 text-xs font-medium">Capitán</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-[var(--black-800)] border border-[#262626] rounded-md">
                    <User size={12} className="text-[var(--green)]" />
                    <span className="text-[var(--green)] text-xs font-medium">Jugador</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children (tabs y contenido) */}
      <div className="w-full mx-auto">
        {children}
      </div>
    </div>
  );
};

