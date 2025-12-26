'use client';

import React, { useRef, useEffect, useState } from 'react';
import { StatsResumen } from '@/app/types/equipoResumen';
import { StatsResumenCard } from './StatsResumenCard';
import CardStatPlayerTeamSkeleton from '../../skeletons/CardStatPlayerTeam';

interface StatsResumenSliderProps {
  stats: StatsResumen[];
  loading?: boolean;
  onVerTodos?: (tipo: string) => void;
}

export const StatsResumenSlider: React.FC<StatsResumenSliderProps> = ({
  stats,
  loading = false,
  onVerTodos
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!scrollContainerRef.current || !stats || stats.length === 0) return;
    
    const container = scrollContainerRef.current;
    
    const handleScroll = () => {
      if (!container || !container.children.length) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      // Encontrar qué card está más cerca del centro
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      Array.from(container.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(containerCenter - childCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      setCurrentIndex(closestIndex);
    };
    
    // Agregar el listener después de que el DOM esté listo
    const timeoutId = setTimeout(() => {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Llamar una vez al montar
    }, 50);
    
    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [stats]);

  if (loading) {
    return (
      <CardStatPlayerTeamSkeleton />
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm px-1">Estadísticas temporada</h3>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 sm:p-6 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay estadísticas disponibles</p>
        </div>
      </div>
    );
  }

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || !scrollContainerRef.current.children[index]) return;
    
    const container = scrollContainerRef.current;
    const targetChild = container.children[index] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const childRect = targetChild.getBoundingClientRect();
    
    // Calcular la posición de scroll para centrar la card
    const scrollLeft = container.scrollLeft;
    const targetLeft = childRect.left - containerRect.left + scrollLeft;
    const containerCenter = containerRect.width / 2;
    const targetCenter = childRect.width / 2;
    
    container.scrollTo({
      left: targetLeft - containerCenter + targetCenter,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-white font-semibold text-sm px-1">Estadísticas temporada</h3>
      
      {/* Slider horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent hover:scrollbar-thumb-[#525252] pb-2 scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory'
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.tipo}
            style={{
              scrollSnapAlign: 'start'
            }}
          >
            <StatsResumenCard
              stats={stat}
              onVerTodos={() => onVerTodos?.(stat.tipo)}
            />
          </div>
        ))}
      </div>

      {/* Dots indicadores */}
      {stats.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-[var(--green)]'
                  : 'w-1.5 bg-[#262626] hover:bg-[#525252]'
              }`}
              aria-label={`Ir a estadística ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

