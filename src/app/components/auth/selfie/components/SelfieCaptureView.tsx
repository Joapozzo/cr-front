import { Camera, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { TipsPopover } from './TipsPopover';
import { CameraOverlay } from './CameraOverlay';
import type { DeteccionRostro } from '../hooks/useFaceDetection';

interface SelfieCaptureViewProps {
  // Estado
  loading: boolean;
  loadingMessage?: string;
  showTips: boolean;
  deteccionRostro: DeteccionRostro;
  contador: number | null;
  isMobile: boolean;
  cameras: Array<{ deviceId: string; label: string }>;
  selectedCamera: string;

  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;
  
  // Handlers
  onToggleTips: () => void;
  onDetenerCamera: () => void;
  onCapturarFoto: () => void;
  onCambiarCamara: () => void;
}

/**
 * Componente presentacional para la vista de captura con cámara
 * Solo renderiza UI, sin lógica
 */
export const SelfieCaptureView = ({
  loading,
  loadingMessage,
  showTips,
  deteccionRostro,
  contador,
  isMobile,
  cameras,
  selectedCamera,
  videoRef,
  onToggleTips,
  onDetenerCamera,
  onCapturarFoto,
  onCambiarCamara,
}: SelfieCaptureViewProps) => {
  return (
    <>
      {/* Indicador de carga dentro del componente */}
      {loading && (
        <div className="bg-[var(--gray-400)] rounded-xl p-4 border border-[var(--gray-300)] flex items-center gap-3 flex-shrink-0">
          <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--gray-200)] font-medium">{loadingMessage || 'Procesando...'}</p>
        </div>
      )}

      <TipsPopover showTips={showTips} onToggle={onToggleTips} disabled={loading} />

      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-white">Posiciona tu rostro</h2>
        <p className="text-sm text-[var(--gray-200)]">
          Asegúrate de que tu rostro esté visible y bien iluminado
        </p>
      </div>

      {/* Video con overlay - Modal fullscreen en mobile */}
      {isMobile ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header con instrucciones */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 pt-safe">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onDetenerCamera}
                disabled={loading}
                className="p-2 bg-black/50 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex-1 text-center">
                <p className="text-white text-sm font-medium">
                  {deteccionRostro.valido ? 'Mantén la posición' : 'Posiciona tu rostro en el óvalo'}
                </p>
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>
            {!deteccionRostro.valido && deteccionRostro.mensaje && (
              <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-xs text-center">
                {deteccionRostro.mensaje}
              </div>
            )}
          </div>

          {/* Video fullscreen */}
          <div className="relative flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            <CameraOverlay deteccionRostro={deteccionRostro} contador={contador} isMobile={true} />
          </div>

          {/* Botones en la parte inferior */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pb-safe">
            <div className="flex flex-col gap-3">
              {contador === null && (
                <Button
                  onClick={onCapturarFoto}
                  disabled={loading || !deteccionRostro.valido}
                  className="w-full h-14 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Capturando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      {deteccionRostro.valido ? 'Capturar Foto' : 'Esperando rostro...'}
                    </>
                  )}
                </Button>
              )}
              {contador !== null && contador > 0 && (
                <div className="text-center">
                  <p className="text-white text-lg font-medium">
                    Mantén la posición... {contador}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--gray-400)] rounded-xl p-4 border border-[var(--gray-300)] flex-1 min-h-0 flex flex-col">
          <div className="relative flex-1 min-h-0 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            <CameraOverlay deteccionRostro={deteccionRostro} contador={contador} isMobile={false} />

            {/* Cambiar cámara (si hay múltiples y desktop) */}
            {cameras.length > 1 && (
              <button
                onClick={onCambiarCamara}
                disabled={loading}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Controles - Solo en desktop */}
      {!isMobile && (
        <div className="flex flex-col lg:flex-row gap-3 flex-shrink-0">
          <Button
            onClick={onDetenerCamera}
            variant="secondary"
            className="flex items-center justify-center gap-2 flex-1"
            disabled={loading || contador !== null}
          >
            <X className="w-5 h-5" />
            Cancelar
          </Button>

          {/* Solo mostrar botón manual si no hay detección automática activa */}
          {contador === null && (
            <Button
              onClick={onCapturarFoto}
              disabled={loading || !deteccionRostro.valido}
              className="flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Capturando...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  {deteccionRostro.valido ? 'Capturar Foto' : 'Esperando rostro...'}
                </>
              )}
            </Button>
          )}

          {/* Mostrar mensaje cuando está contando */}
          {contador !== null && contador > 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-[var(--gray-200)]">
                Mantén la posición... {contador}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

