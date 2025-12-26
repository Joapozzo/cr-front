'use client';

import { useState, useEffect } from 'react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { ValidarDniForm } from '@/app/components/auth/ValidarDNIForm';
import { ValidarDniProvider, useValidarDniContext } from '@/app/contexts/ValidarDniContext';
import { ModalPoliticasPrivacidad } from '@/app/components/modals/ModalPoliticasPrivacidad';
import { useAuthStore } from '@/app/stores/authStore';

function ValidarDniContent() {
  const { step } = useValidarDniContext();
  const usuario = useAuthStore((state) => state.usuario);
  const [showModalPoliticas, setShowModalPoliticas] = useState(false);
  const [politicasAceptadas, setPoliticasAceptadas] = useState(false);

  // Verificar si ya aceptó las políticas (TODOS los usuarios deben aceptar)
  useEffect(() => {
    if (usuario && !usuario.cuenta_activada) {
      const politicasAceptadasStorage = sessionStorage.getItem('politicas_aceptadas');
      if (!politicasAceptadasStorage) {
        // Mostrar modal si no ha aceptado antes (TODOS los usuarios)
        setShowModalPoliticas(true);
      } else {
        setPoliticasAceptadas(true);
      }
    } else if (usuario?.cuenta_activada) {
      // Si la cuenta ya está activada, no mostrar políticas
      setPoliticasAceptadas(true);
    }
  }, [usuario]);

  const handleAcceptPoliticas = () => {
    // Guardar en sessionStorage que aceptó las políticas (TODOS los usuarios)
    sessionStorage.setItem('politicas_aceptadas', 'true');
    setPoliticasAceptadas(true);
    setShowModalPoliticas(false);
  };

  const handleCloseModal = () => {
    // No permitir cerrar sin aceptar
    // El modal no se puede cerrar sin aceptar los términos
  };

  // Mostrar modal si es necesario, o el formulario si ya aceptó
  if (!politicasAceptadas) {
    return (
      <>
        <ModalPoliticasPrivacidad
          isOpen={showModalPoliticas}
          onClose={handleCloseModal}
          onAccept={handleAcceptPoliticas}
        />
        <AuthLayout
          title="Escaneá el código de tu DNI 🪪"
          subtitle="Usa la cámara para escanear el código de barras"
          infoTitle="seguridad"
          infoDescription="Validamos tu identidad escaneando el código de barras de tu DNI para garantizar la seguridad de todos los usuarios"
          infoPosition="right"
          showBackButton={true}
          hideTitle={step === 'form'}
        >
          <div className="w-full flex flex-col gap-4 lg:gap-5 flex-1 lg:flex-none justify-start">
            <div className="w-full h-56 lg:h-48 bg-[var(--gray-400)] rounded-lg border-2 border-dashed border-[var(--gray-300)] flex flex-col items-center justify-center gap-3">
              <p className="text-sm text-[var(--gray-200)] text-center">
                Por favor, acepta los términos y condiciones para continuar
              </p>
            </div>
          </div>
        </AuthLayout>
      </>
    );
  }
  
  return (
    <AuthLayout
      title="Escaneá el código de tu DNI 🪪"
      subtitle="Usa la cámara para escanear el código de barras"
      infoTitle="seguridad"
      infoDescription="Validamos tu identidad escaneando el código de barras de tu DNI para garantizar la seguridad de todos los usuarios"
      infoPosition="right"
      showBackButton={true}
      hideTitle={step === 'form'}
    >
      <ValidarDniForm />
    </AuthLayout>
  );
}

export default function ValidarDniPage() {
  return (
    <ValidarDniProvider>
      <ValidarDniContent />
    </ValidarDniProvider>
  );
}