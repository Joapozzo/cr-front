'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { EMAIL_SUPPORT } from '@/app/constants/constants';

interface ModalPoliticasPrivacidadProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const ModalPoliticasPrivacidad: React.FC<ModalPoliticasPrivacidadProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else if (!isOpen && isVisible) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isOpen, isVisible]);

  const handleAccept = async () => {
    if (!aceptaTerminos) return;
    
    setIsSubmitting(true);
    try {
      await onAccept();
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 200);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        // No permitir cerrar haciendo clic fuera del modal
        e.stopPropagation();
      }}
    >
      <div
        className={`
          bg-[#1a1a1a] rounded-[20px] shadow-xl border border-[#262626]
          w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col
          transform transition-all duration-200 ease-out
          ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h3 className="text-white font-bold text-lg">Términos y Condiciones de Uso</h3>
          {/* No mostrar botón de cerrar - no se puede cerrar sin aceptar */}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-4 text-sm text-[var(--gray-200)]">
            <div>
              <p className="text-xs text-[var(--gray-300)] mb-2">
                <strong>Última actualización:</strong> 22 de diciembre de 2025
              </p>
              <p className="mb-4">
                Al registrarte en nuestra plataforma, aceptás los siguientes términos:
              </p>
            </div>

            <div className="space-y-4">
              <section>
                <h3 className="text-white font-semibold mb-2">1. Datos que Recolectamos</h3>
                <p className="text-[var(--gray-200)] leading-relaxed">
                  Para participar en torneos, necesitamos:
                </p>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1 text-[var(--gray-200)]">
                  <li><strong>DNI:</strong> Número de documento</li>
                  <li><strong>Datos personales:</strong> Nombre, apellido, fecha de nacimiento</li>
                  <li><strong>Foto selfie:</strong> Para verificar tu identidad en partidos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold mb-2">2. ¿Para qué usamos tus datos?</h3>
                <ul className="list-disc list-inside ml-2 space-y-1 text-[var(--gray-200)]">
                  <li>Verificar tu identidad en los partidos</li>
                  <li>Prevenir suplantación de identidad</li>
                  <li>Gestionar tu participación en torneos</li>
                  <li>Cumplir con requisitos deportivos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold mb-2">3. ¿Cómo protegemos tu información?</h3>
                <ul className="list-disc list-inside ml-2 space-y-1 text-[var(--gray-200)]">
                  <li>Encriptación de datos</li>
                  <li>Acceso restringido solo a personal autorizado</li>
                  <li>Servidores seguros</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold mb-2">4. Tus Derechos</h3>
                <p className="text-[var(--gray-200)] leading-relaxed mb-2">
                  Podés solicitar:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-[var(--gray-200)]">
                  <li>Acceso a tus datos</li>
                  <li>Corrección de información incorrecta</li>
                  <li>Eliminación de tu cuenta</li>
                </ul>
                <p className="text-[var(--gray-300)] text-xs mt-2">
                  <strong>Contacto:</strong> 
                  <a href={`mailto:${EMAIL_SUPPORT}`} className="text-[var(--gray-200)] hover:text-[var(--green)]">
                    {EMAIL_SUPPORT}
                  </a>
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold mb-2">5. Uso de la foto selfie</h3>
                <p className="text-[var(--gray-200)] leading-relaxed">
                  La foto que tomes será utilizada exclusivamente para:
                </p>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1 text-[var(--gray-200)]">
                  <li>Verificar que sos la misma persona registrada en el DNI</li>
                  <li>Confirmar tu identidad antes de partidos oficiales</li>
                  <li>No compartiremos tu foto con terceros</li>
                </ul>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gray-300)]">
              <p className="text-xs text-[var(--gray-300)] leading-relaxed">
                Al marcar el checkbox confirmás que:
              </p>
              <ul className="list-disc list-inside ml-2 mt-2 space-y-1 text-xs text-[var(--gray-300)]">
                <li>Sos mayor de 18 años (o tenés autorización de tus padres)</li>
                <li>Leíste y aceptás estos términos</li>
                <li>Autorizás el uso de tu DNI y foto para los fines mencionados</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-[#262626]">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acepta-terminos"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[var(--gray-300)] bg-[var(--gray-400)] text-[var(--green)] focus:ring-2 focus:ring-[var(--green)] focus:ring-offset-0 focus:ring-offset-[var(--gray-400)] cursor-pointer"
              />
              <label
                htmlFor="acepta-terminos"
                className="text-sm text-[var(--gray-200)] leading-relaxed cursor-pointer flex-1"
              >
                Acepto los términos y condiciones de uso y autorizo el uso de mi DNI y foto para los fines mencionados.
              </label>
            </div>
            <Button
              onClick={handleAccept}
              disabled={!aceptaTerminos || isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  Procesando <Loader2 className="animate-spin w-4 h-4" />
                </>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

