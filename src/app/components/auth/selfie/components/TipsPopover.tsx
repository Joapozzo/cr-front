import { Info } from 'lucide-react';

interface TipsPopoverProps {
  showTips: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * Componente presentacional para mostrar tips/requisitos de la foto
 * 100% presentacional, sin lógica
 */
export const TipsPopover = ({ showTips, onToggle, disabled = false }: TipsPopoverProps) => {
  return (
    <div className="relative flex justify-end -mt-2 lg:-mt-4 mb-1 flex-shrink-0">
      <button
        onClick={onToggle}
        disabled={disabled}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gray-400)] hover:bg-[var(--gray-300)] text-[var(--gray-200)] transition-colors mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Ver consejos"
      >
        <Info size={18} />
      </button>

      {showTips && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onToggle}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--gray-400)] rounded-lg p-4 shadow-xl z-50 border border-[var(--gray-300)]">
            <p className="text-xs text-[var(--gray-200)] font-medium mb-2">📋 Requisitos para la foto:</p>
            <ul className="text-xs text-[var(--gray-200)] space-y-1">
              <li>• Buena iluminación (preferiblemente luz natural)</li>
              <li>• Rostro completamente visible y centrado</li>
              <li>• Sin gafas de sol ni accesorios que cubran el rostro</li>
              <li>• Fondo neutro</li>
              <li>• Solo debe aparecer una persona</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

