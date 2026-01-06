'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { EMAIL_SUPPORT } from '@/app/constants/constants';
import { useRegistrationContext } from '@/app/contexts/RegistrationContext';
import { useAuthStore } from '@/app/stores/authStore';
import { StepBackButton } from '../StepBackButton';

/**
 * Step de políticas - Renderizado inline (no modal)
 * Optimizado para renderizado rápido sin delays artificiales
 */
export const PoliciesStep = () => {
  const { goToNextStep, updateUserData } = useRegistrationContext();
  const usuario = useAuthStore((state) => state.usuario);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar si ya aceptó las políticas
  useEffect(() => {
    if (usuario) {
      const politicasAceptadasStorage = sessionStorage.getItem('politicas_aceptadas');
      if (politicasAceptadasStorage) {
        setAceptaTerminos(true);
        updateUserData({ politicasAceptadas: true });
      }
    }
  }, [usuario, updateUserData]);

  const handleAccept = useCallback(async () => {
    if (!aceptaTerminos) return;
    
    setIsSubmitting(true);
    try {
      // Guardar en sessionStorage
      sessionStorage.setItem('politicas_aceptadas', 'true');
      updateUserData({ politicasAceptadas: true });
      
      // Ir al siguiente step
      goToNextStep();
    } finally {
      setIsSubmitting(false);
    }
  }, [aceptaTerminos, updateUserData, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div className="mb-4">
        <StepBackButton />
      </div>
      <div className="flex flex-col gap-6 w-full">
        {/* Título */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Términos y condiciones de uso
          </h3>
          <p className="text-xs text-[var(--gray-300)]">
            Última actualización: 22 de diciembre de 2025
          </p>
        </div>

        {/* Contenido scrollable */}
        <div className="bg-[var(--gray-400)] rounded-lg p-6 max-h-[400px] overflow-y-auto border border-[var(--gray-300)]">
          <div className="flex flex-col gap-4 text-sm text-[var(--gray-200)]">
            <p className="mb-4">
              Al registrarte en nuestra plataforma, aceptás los siguientes términos:
            </p>

            <div className="space-y-4">
              <section>
                <h3 className="text-white font-semibold mb-2">1. Datos que recolectamos</h3>
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
                <h3 className="text-white font-semibold mb-2">4. Tus derechos</h3>
                <p className="text-[var(--gray-200)] leading-relaxed mb-2">
                  Podés solicitar:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-[var(--gray-200)]">
                  <li>Acceso a tus datos</li>
                  <li>Corrección de información incorrecta</li>
                  <li>Eliminación de tu cuenta</li>
                </ul>
                <p className="text-[var(--gray-300)] text-xs mt-2">
                  <strong>Contacto:</strong>{' '}
                  <a href={`mailto:${EMAIL_SUPPORT}`} className="text-[var(--color-primary)] hover:underline">
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

        {/* Checkbox y botón */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acepta-terminos"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[var(--gray-300)] bg-[var(--gray-400)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 focus:ring-offset-[var(--gray-400)] cursor-pointer"
            />
            <label
              htmlFor="acepta-terminos"
              className="text-sm text-[var(--gray-200)] leading-relaxed cursor-pointer flex-1"
            >
              Acepto los Términos y condiciones de uso y autorizo el uso de mi DNI y foto para los fines mencionados.
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
    </motion.div>
  );
};

