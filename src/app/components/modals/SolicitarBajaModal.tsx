"use client";

import { UserMinus } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "./ConfirModal"; 
import { Input } from "../ui/Input";
import toast from "react-hot-toast";

interface SolicitarBajaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (motivo: string, observaciones: string) => void;
    jugadorNombre: string;
    isLoading?: boolean;
}

const SolicitarBajaModal: React.FC<SolicitarBajaModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jugadorNombre,
    isLoading = false
}) => {
    const [motivo, setMotivo] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const handleClose = () => {
        setMotivo('');
        setObservaciones('');
        onClose();
    };

    const handleConfirm = (mensajeTextarea?: string) => {
        if (!motivo.trim() || !observaciones.trim()) {
            return toast.error('Debes rellenar todos los campos');
        }
        
        if (!motivo.trim()) {
            return;
        }
        onConfirm(motivo.trim(), mensajeTextarea || '');
        setMotivo('');
        setObservaciones('');
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title="Solicitar Baja de Jugador"
            description={`¿Estás seguro que deseas solicitar la baja de ${jugadorNombre}?`}
            confirmText="Solicitar Baja"
            cancelText="Cancelar"
            variant="danger"
            icon={<UserMinus className="w-5 h-5" />}
            isLoading={isLoading}
            showTextarea={true}
            textareaLabel="Observaciones (opcional)"
            textareaPlaceholder="Agrega detalles adicionales sobre la solicitud..."
        >
            <Input
                label="Motivo *"
                placeholder="Ej: Lesión, Motivos personales, etc."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isLoading}
                required
            />
        </ConfirmModal>
    );
};

export default SolicitarBajaModal;