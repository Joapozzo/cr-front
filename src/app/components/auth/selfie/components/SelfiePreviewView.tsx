import { CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';

interface SelfiePreviewViewProps {
  selfiePreview: string;
  rostroValidado: boolean;
  loading: boolean;
  loadingMessage?: string;
  isPending: boolean;
  onConfirmar: () => void;
  onReiniciar: () => void;
}

/**
 * Componente presentacional para la vista de preview del selfie
 * Solo renderiza UI, sin lógica
 */
export const SelfiePreviewView = ({
  selfiePreview,
  rostroValidado,
  loading,
  loadingMessage,
  isPending,
  onConfirmar,
  onReiniciar,
}: SelfiePreviewViewProps) => {
  return (
    <>
      {/* Indicador de carga dentro del componente */}
      {loading && (
        <div className="bg-[var(--gray-400)] rounded-xl p-4 border border-[var(--gray-300)] flex items-center gap-3 flex-shrink-0">
          <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--gray-200)] font-medium">{loadingMessage || 'Procesando...'}</p>
        </div>
      )}

      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-lg lg:text-xl font-semibold text-white">Revisa tu foto</h2>
      </div>

      <div className="bg-[var(--gray-400)] rounded-xl p-6 border border-[var(--gray-300)] flex-1 min-h-0 flex flex-col">
        <div className="relative aspect-square max-w-md mx-auto w-full bg-black rounded-lg overflow-hidden border-4 border-[var(--gray-300)] flex-shrink-0">
          <Image
            src={selfiePreview}
            alt="Selfie preview"
            fill
            className="object-cover"
          />

          {rostroValidado && (
            <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>Foto lista</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex flex-col lg:flex-row gap-3 flex-shrink-0">
        <Button
          onClick={onConfirmar}
          disabled={isPending || !rostroValidado || loading}
          className="flex items-center justify-center gap-2 flex-1"
          variant="success"
        >
          {isPending ? (
            <>
              Subiendo...
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              Confirmar
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </Button>

        <Button
          onClick={onReiniciar}
          disabled={isPending || loading}
          variant="default"
          className="flex items-center justify-center gap-2 flex-1"
        >
          <RefreshCw className="w-5 h-5" />
          Tomar otra
        </Button>
      </div>
    </>
  );
};

