import { CaptureCounter } from './CaptureCounter';
import type { DeteccionRostro } from '../hooks/useFaceDetection';

interface CameraOverlayProps {
  deteccionRostro: DeteccionRostro;
  contador: number | null;
  isMobile?: boolean;
}

/**
 * Componente presentacional para el overlay de la cámara
 * Incluye guía oval y contador
 */
export const CameraOverlay = ({ deteccionRostro, contador, isMobile = false }: CameraOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`${isMobile ? 'w-72 h-96' : 'w-64 lg:w-80'} border-4 rounded-full transition-all ${
          deteccionRostro.valido
            ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/50'
            : isMobile
            ? 'border-white/50'
            : 'border-white/30'
        }`}
        style={!isMobile ? { aspectRatio: '3/4' } : undefined}
      />

      <CaptureCounter contador={contador} isMobile={isMobile} />

      {/* Mensaje de estado - Solo desktop */}
      {!isMobile && contador === null && deteccionRostro.mensaje && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-xs text-center">
          {deteccionRostro.mensaje}
        </div>
      )}
    </div>
  );
};

