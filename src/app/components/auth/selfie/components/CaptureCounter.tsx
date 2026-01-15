interface CaptureCounterProps {
  contador: number | null;
  isMobile?: boolean;
}

/**
 * Componente presentacional para el contador de captura
 * Muestra el número grande cuando hay contador activo
 */
export const CaptureCounter = ({ contador, isMobile = false }: CaptureCounterProps) => {
  if (contador === null || contador <= 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`${isMobile ? 'w-40 h-40' : 'w-32 h-32'} rounded-full bg-[var(--color-primary)]/90 flex items-center justify-center shadow-2xl`}>
        <span className={`${isMobile ? 'text-7xl' : 'text-6xl'} font-bold text-white`}>{contador}</span>
      </div>
    </div>
  );
};

