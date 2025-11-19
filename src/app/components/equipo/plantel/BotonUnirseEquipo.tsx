'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Send } from 'lucide-react';
import ConfirmModal from '@/app/components/modals/ConfirModal';
import { useEnviarSolicitudJugador } from '@/app/hooks/useSolicitudes';
import toast from 'react-hot-toast';
import { usePlayerStore } from '@/app/stores/playerStore';

interface BotonUnirseEquipoProps {
  idEquipo: number;
  idEdicion: number;
  loading?: boolean;
}

export const BotonUnirseEquipo: React.FC<BotonUnirseEquipoProps> = ({
  idEquipo,
  loading = false
}) => {
  const { equipos, jugador } = usePlayerStore();
  const { mutate: enviarSolicitud, isPending: isEnviando } = useEnviarSolicitudJugador();

  const [showModal, setShowModal] = useState(false);
  
  // Obtener idCategoriaEdicion del equipo desde el store (centralizado)
  const equipoDelStore = equipos.find(eq => eq.id_equipo === idEquipo);
  const idCategoriaEdicion = equipoDelStore?.id_categoria_edicion || 0;

  const handleEnviarSolicitud = (mensaje?: string) => {
    if (!jugador?.id_jugador) {
      toast.error('Error: No se pudo identificar al jugador');
      return;
    }

    enviarSolicitud(
      {
        id_jugador: jugador.id_jugador,
        id_equipo: idEquipo,
        id_categoria_edicion: idCategoriaEdicion,
        mensaje_jugador: mensaje || undefined
      },
      {
        onSuccess: () => {
          toast.success('Solicitud enviada exitosamente');
          setShowModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al enviar la solicitud');
        }
      }
    );
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="footer"
        size="md"
        className="w-full sm:w-auto flex items-center justify-center gap-2"
        disabled={loading || isEnviando}
      >
        <Send className="w-4 h-4" />
        Enviar solicitud para unirme
      </Button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleEnviarSolicitud}
        title="Enviar Solicitud"
        description="¿Estás seguro que quieres enviar una solicitud para unirte a este equipo?"
        confirmText="Enviar Solicitud"
        variant="success"
        icon={<Send className="w-5 h-5" />}
        isLoading={isEnviando}
        showTextarea={true}
        textareaPlaceholder="Escribe un mensaje para el capitán del equipo (opcional)..."
        textareaLabel="Mensaje opcional"
      />
    </>
  );
};

