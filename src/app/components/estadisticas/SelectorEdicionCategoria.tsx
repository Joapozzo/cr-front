'use client';

import { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';

/**
 * Helper para convertir hex a rgba con opacidad
 */
const hexToRgba = (hex: string | null | undefined, opacity: number = 0.1): string => {
  if (!hex) return `rgba(115, 115, 115, ${opacity})`; // fallback gray
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Selector de ediciones y categorías reutilizable
 * Muestra categorías como chips horizontales con scroll
 */
export const SelectorEdicionCategoria = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isLoading,
    edicionSeleccionada,
    categoriaSeleccionada,
    categoriasDisponibles,
    setCategoriaSeleccionada
  } = useEdicionCategoria();

  // Filtrar categorías solo de la edición seleccionada
  const categoriasDeEdicionSeleccionada = useMemo(() => {
    if (!edicionSeleccionada) return [];
    return categoriasDisponibles.filter(cat => cat.id_edicion === edicionSeleccionada.id_edicion);
  }, [edicionSeleccionada, categoriasDisponibles]);

  const handleSeleccionarCategoria = (categoria: typeof categoriasDisponibles[0]) => {
    setCategoriaSeleccionada(categoria);
    
    // Actualizar URL con el parámetro de categoría
    const params = new URLSearchParams(window.location.search);
    params.set('categoria', categoria.id.toString());
    
    // Mantener otros parámetros (como 'tipo' en estadísticas)
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // if (isLoading) {
  //   return (
  //     <div className="h-8 bg-[var(--black-800)] rounded-lg animate-pulse w-full" style={{ overflow: 'visible' }} />
  //   );
  // }

  // Si no hay edición seleccionada o categorías disponibles, no renderizar nada
  if (!edicionSeleccionada || categoriasDeEdicionSeleccionada.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .category-chips-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .category-chips-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .category-chips-scroll::-webkit-scrollbar-thumb {
          background-color: var(--color-primary);
          border-radius: 3px;
        }
        .category-chips-scroll::-webkit-scrollbar-thumb:hover {
          background-color: var(--color-primary);
          opacity: 0.8;
        }
        @media (max-width: 640px) {
          .category-chips-scroll::-webkit-scrollbar {
            display: block;
            height: 8px;
          }
        }
      `}</style>
      <div className="w-full" style={{ overflow: 'visible', paddingTop: '12px', paddingBottom: '0' }}>
        {/* Chips horizontales con scroll */}
        <div 
          className="w-full category-chips-scroll"
          style={{
            overflowX: 'auto',
            overflowY: 'visible',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-primary) transparent',
            paddingBottom: '8px',
          }}
        >
          <div className="flex gap-3 min-w-max px-1" style={{ paddingTop: '3px' }}>
            {categoriasDeEdicionSeleccionada.map((categoria) => {
              const isActive = categoriaSeleccionada?.id === categoria.id;
              const color = categoria.color || '#737373'; // fallback gray
              
              return (
                <button
                  key={categoria.id}
                  onClick={() => handleSeleccionarCategoria(categoria)}
                  style={{
                    borderColor: color,
                    backgroundColor: hexToRgba(color, isActive ? 0.3 : 0.05),
                    borderWidth: isActive ? '1px' : '1px', 
                    opacity: isActive ? 1 : 0.6,
                    color: isActive ? color : '#a3a3a3'
                  }}
                  className={`
                    flex items-center justify-center gap-2 
                    rounded-full border-solid
                    transition-all duration-200 whitespace-nowrap
                    font-medium
                    text-xs px-3 py-1.5
                    sm:text-sm sm:px-4 sm:py-2
                    ${isActive ? '' : 'text-gray-300'}
                    hover:brightness-110
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  `}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = hexToRgba(color, 0.1);
                      e.currentTarget.style.opacity = '0.8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = hexToRgba(color, 0.05);
                      e.currentTarget.style.opacity = '0.6';
                    }
                  }}
                >
                  <span className="whitespace-nowrap">
                    {categoria.nombre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

