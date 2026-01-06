'use client';

import React, { useRef, useEffect, useState } from 'react';
import { StatsResumenCard } from '@/app/components/equipo/resumen/StatsResumenCard';
import { StatsResumen } from '@/app/types/equipoResumen';

interface StatsParticipacionSliderProps {
  stats: StatsResumen[];
}

export const StatsParticipacionSlider: React.FC<StatsParticipacionSliderProps> = ({
  stats
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
      
      const flexContainer = container.children[0] as HTMLElement;
      if (!flexContainer) return;
      
      Array.from(flexContainer.children).forEach((child, index) => {
        const childRect = (child as HTMLElement).getBoundingClientRect();
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

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const flexContainer = container.children[0] as HTMLElement;
    if (!flexContainer || !flexContainer.children[index]) return;
    
    const targetChild = flexContainer.children[index] as HTMLElement;
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

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-white font-semibold text-sm px-1">Estadísticas destacadas</h4>
      
      {/* Slider horizontal */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent hover:scrollbar-thumb-[#525252] pb-2"
        style={{
          scrollSnapType: 'x mandatory'
        }}
      >
        <div className="flex gap-4 px-1">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                scrollSnapAlign: 'start'
              }}
            >
              <StatsResumenCard stats={stat} />
            </div>
          ))}
        </div>
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
                  ? 'w-6 bg-[var(--color-primary)]'
                  : 'w-1.5 bg-[#262626] hover:bg-[#525252]'
              }`}
              aria-label={`Ir a estadística ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
      `}</style>
    </div>
  );
};
