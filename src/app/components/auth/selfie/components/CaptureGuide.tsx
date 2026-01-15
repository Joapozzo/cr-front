import { ScanFace, Loader2 } from 'lucide-react';

interface CaptureGuideProps {
  loading: boolean;
  loadingMessage?: string;
}

/**
 * Componente presentacional para la guía inicial de captura
 * Muestra icono y mensaje, o spinner si está cargando
 */
export const CaptureGuide = ({ loading, loadingMessage }: CaptureGuideProps) => {
  return (
    <div className="bg-[var(--gray-400)] rounded-xl p-6 border border-[var(--gray-300)] flex-shrink-0">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 lg:w-20 lg:h-20 text-[var(--color-primary)] animate-spin" />
          <div className="text-center space-y-2">
            <p className="text-sm lg:text-base text-[var(--gray-200)] font-medium">
              {loadingMessage || 'Procesando...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
            <ScanFace className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--color-primary)]" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-base lg:text-lg font-semibold text-white">
              Asegúrate de estar en un lugar bien iluminado
            </h3>
            <p className="text-xs lg:text-sm text-[var(--gray-200)]">
              Te guiaremos paso a paso para obtener una foto perfecta
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

