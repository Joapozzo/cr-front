import { useState, useEffect } from 'react';

export type ModoCaptura = 'inicial' | 'capturando' | 'preview';

export interface UseSelfieStateReturn {
  modo: ModoCaptura;
  setModo: (modo: ModoCaptura) => void;
  selfiePreview: string | null;
  setSelfiePreview: (preview: string | null) => void;
  selfieBase64: string | null;
  setSelfieBase64: (base64: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
  rostroValidado: boolean;
  setRostroValidado: (validado: boolean) => void;
  showTips: boolean;
  setShowTips: (show: boolean) => void;
  isMobile: boolean;
  loginState: 'idle' | 'loading' | 'success' | 'error';
  setLoginState: (state: 'idle' | 'loading' | 'success' | 'error') => void;
}

/**
 * Hook para manejar el estado general del formulario de selfie
 * Incluye: modo, preview, base64, loading, validación, tips, mobile detection
 */
export const useSelfieState = (): UseSelfieStateReturn => {
  const [modo, setModo] = useState<ModoCaptura>('inicial');
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [rostroValidado, setRostroValidado] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar selfie persistida al montar
  useEffect(() => {
    const savedSelfie = localStorage.getItem('selfie_preview');
    const savedBase64 = localStorage.getItem('selfie_base64');
    if (savedSelfie && savedBase64) {
      setSelfiePreview(savedSelfie);
      setSelfieBase64(savedBase64);
      setRostroValidado(true);
      setModo('preview');
    }
  }, []);

  // Persistir selfie cuando cambia
  useEffect(() => {
    if (selfiePreview && selfieBase64) {
      localStorage.setItem('selfie_preview', selfiePreview);
      localStorage.setItem('selfie_base64', selfieBase64);
    } else {
      localStorage.removeItem('selfie_preview');
      localStorage.removeItem('selfie_base64');
    }
  }, [selfiePreview, selfieBase64]);

  return {
    modo,
    setModo,
    selfiePreview,
    setSelfiePreview,
    selfieBase64,
    setSelfieBase64,
    loading,
    setLoading,
    loadingMessage,
    setLoadingMessage,
    rostroValidado,
    setRostroValidado,
    showTips,
    setShowTips,
    isMobile,
    loginState,
    setLoginState,
  };
};

