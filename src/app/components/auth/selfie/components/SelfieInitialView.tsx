import { Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { TipsPopover } from './TipsPopover';
import { CaptureGuide } from './CaptureGuide';

interface SelfieInitialViewProps {
  showTips: boolean;
  onToggleTips: () => void;
  loading: boolean;
  loadingMessage?: string;
  onFileInputClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente presentacional para la vista inicial del formulario de selfie
 * Solo renderiza UI, sin lógica
 */
export const SelfieInitialView = ({
  showTips,
  onToggleTips,
  loading,
  loadingMessage,
  onFileInputClick,
  fileInputRef,
  onFileChange,
}: SelfieInitialViewProps) => {
  return (
    <>
      <TipsPopover showTips={showTips} onToggle={onToggleTips} disabled={loading} />

      <CaptureGuide loading={loading} loadingMessage={loadingMessage} />

      <div className="flex flex-col gap-3 flex-shrink-0">
        <Button
          onClick={onFileInputClick}
          disabled={loading}
          className="flex items-center justify-center gap-3 h-14 text-base flex-1"
        >
          <Upload className="w-5 h-5" />
          Subir foto
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          disabled={loading}
          className="hidden"
        />
      </div>
    </>
  );
};

