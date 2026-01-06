'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown, Search, Trophy } from 'lucide-react';
import Image from 'next/image';
import { ImagenPublica } from '../common/ImagenPublica';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';

interface EdicionLayoutProps {
  nombreEdicion: string;
  temporada?: string | number;
  nombreCategoria?: string;
  logoEdicion?: string;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Layout compartido para páginas que muestran datos por edición
 * Incluye header con logo y nombre de edición/categoría
 * Con selector integrado para cambiar de edición si hay múltiples
 */
export const EdicionLayout: React.FC<EdicionLayoutProps> = ({
  nombreEdicion,
  temporada,
  nombreCategoria,
  logoEdicion,
  loading = false,
  children
}) => {
  const { edicionesConCategorias, edicionSeleccionada, setEdicionSeleccionada } = useEdicionCategoria();
  const [isOpenEdicion, setIsOpenEdicion] = useState(false);
  const [searchTermEdicion, setSearchTermEdicion] = useState('');
  const edicionDropdownRef = useRef<HTMLDivElement>(null);

  // Verificar si hay múltiples ediciones
  const hayMultiplesEdiciones = edicionesConCategorias && edicionesConCategorias.length > 1;

  // Filtrar ediciones por búsqueda
  const edicionesFiltradas = (edicionesConCategorias || []).filter(edicion =>
    `${edicion.nombre} ${edicion.temporada}`.toLowerCase().includes(searchTermEdicion.toLowerCase())
  );

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (edicionDropdownRef.current && !edicionDropdownRef.current.contains(event.target as Node)) {
        setIsOpenEdicion(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSeleccionarEdicion = (idEdicion: number) => {
    setEdicionSeleccionada(idEdicion);
    setIsOpenEdicion(false);
    setSearchTermEdicion('');
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 p-4 bg-[var(--black-900)] rounded-xl border border-[#262626]">
          <div className="w-10 h-10 bg-[var(--black-800)] rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 bg-[var(--black-800)] rounded animate-pulse" />
            <div className="h-4 w-32 bg-[var(--black-800)] rounded animate-pulse" />
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header con edición y categoría */}
      <div className="relative flex items-center gap-3 p-4 bg-[var(--black-900)] rounded-xl border border-[#262626]">
        <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logoEdicion ? (
            <ImagenPublica
              src={logoEdicion}
              alt={nombreEdicion}
              width={40}
              height={40}
              fallbackIcon="Shield"
            />
          ) : (
            <Shield size={20} className="text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">
              {nombreEdicion} {temporada && `- ${temporada}`}
            </p>
            {hayMultiplesEdiciones && (
              <button
                onClick={() => setIsOpenEdicion(!isOpenEdicion)}
                className="p-1 hover:bg-[var(--black-800)] rounded transition-colors"
              >
                <ChevronDown
                  className={`text-[#737373] transition-transform duration-200 ${isOpenEdicion ? 'rotate-180' : ''}`}
                  size={16}
                />
              </button>
            )}
          </div>
          {nombreCategoria && (
            <p className="text-xs text-[#737373]">{nombreCategoria}</p>
          )}
        </div>

        {/* Dropdown de ediciones */}
        {hayMultiplesEdiciones && isOpenEdicion && (
          <div
            ref={edicionDropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--black-900)] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-[#262626] bg-[var(--black-800)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={16} />
                <input
                  type="text"
                  placeholder="Buscar edición..."
                  value={searchTermEdicion}
                  onChange={(e) => setSearchTermEdicion(e.target.value)}
                  className="w-full bg-[var(--black-900)] border border-[#262626] text-white text-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {edicionesFiltradas.length > 0 ? (
                edicionesFiltradas.map((edicion) => (
                  <button
                    key={edicion.id_edicion}
                    onClick={() => handleSeleccionarEdicion(edicion.id_edicion)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--black-800)] transition-colors text-left ${edicionSeleccionada?.id_edicion === edicion.id_edicion ? 'bg-[var(--black-800)]' : ''
                      }`}
                  >
                    {edicion.img && (
                      <Image
                        src={edicion.img}
                        alt={edicion.nombre}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                    {!edicion.img && (
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                        <Trophy size={16} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${edicionSeleccionada?.id_edicion === edicion.id_edicion ? 'text-[var(--color-primary)]' : 'text-white'
                        }`}>
                        {edicion.nombre}
                      </p>
                      <p className="text-xs text-[#737373]">{edicion.temporada}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-[#737373] text-sm">No se encontraron ediciones</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      {children}
    </div>
  );
};

