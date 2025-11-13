'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type LoadingState = 'loading' | 'success' | 'error';

interface LoadingScreenProps {
  message?: string;
  successMessage?: string;
  errorMessage?: string;
  state?: LoadingState;
  onRetry?: () => void;
}

export const LoadingScreen = ({
  message = 'Procesando...',
  successMessage = '¡Completado!',
  errorMessage = 'Ocurrió un error',
  state = 'loading',
  onRetry,
}: LoadingScreenProps) => {
  const [dots, setDots] = useState('');

  // Animación de puntos suspensivos
  useEffect(() => {
    if (state !== 'loading') return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="fixed inset-0 bg-[var(--gray-500)] z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Icon & Animation */}
        <div className="relative">
          {state === 'loading' && (
            <>
              {/* Spinning outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[var(--green)]/20 animate-ping" />
              
              {/* Main loader */}
              <div className="relative bg-[var(--gray-400)] rounded-full p-6">
                <Loader2 className="w-12 h-12 text-[var(--green)] animate-spin" />
              </div>
              
              {/* Pulsing background */}
              <div className="absolute inset-0 rounded-full bg-[var(--green)]/10 animate-pulse" />
            </>
          )}

          {state === 'success' && (
            <div className="relative bg-[var(--green)]/20 rounded-full p-6 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-[var(--green)] animate-check" />
            </div>
          )}

          {state === 'error' && (
            <div className="relative bg-red-500/20 rounded-full p-6 animate-shake">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          )}
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">
            {state === 'loading' && `${message}${dots}`}
            {state === 'success' && successMessage}
            {state === 'error' && errorMessage}
          </h2>
          
          {state === 'loading' && (
            <p className="text-sm text-[var(--gray-200)]">
              Por favor espera un momento
            </p>
          )}
        </div>

        {/* Retry button (solo en error) */}
        {state === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-[var(--green)] hover:bg-[var(--green)]/90 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            Intentar de nuevo
          </button>
        )}

        {/* Loading bar */}
        {state === 'loading' && (
          <div className="w-64 h-1 bg-[var(--gray-400)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--green)] animate-loading-bar" />
          </div>
        )}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes check {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-45deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-check {
          animation: check 0.6s ease-out;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

