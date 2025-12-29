"use client";

import { useState, useEffect } from "react";
import BaseModal from "./ModalPlanillero";
import { Save } from "lucide-react";
import { Button } from "../ui/Button";
import { PiSoccerBall } from "react-icons/pi";
import { TbRectangleVerticalFilled } from "react-icons/tb";
import GolModal from "./GolModal";
import ExpulsionModal from "./ExpulsionModal";
import MinutoModal from "./MinutoModal";
import { useCrearGol } from "@/app/hooks/useIncidentsCreate";
import { useCrearAmonestacion } from "@/app/hooks/useIncidentsCreate";
import { useCrearExpulsion } from "@/app/hooks/useIncidentsCreate";
import { useCronometroPartido } from "@/app/hooks/useCronometroPartido";
import { IncidenciaPartido } from "@/app/types/partido";
import { useEditarGol, useEditarAmonestacion, useEditarExpulsion } from "@/app/hooks/useIncidentsEditDelete";

import toast from "react-hot-toast";

interface AccionModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador?: { id: number; nombre: string; apellido: string; dorsal: number | null };
    idPartido: number;
    idCategoriaEdicion: number;
    idEquipo: number;
    // Props para edición
    accionToEdit?: IncidenciaPartido;
    isEditing?: boolean;
}

type ModalStep = 'accion' | 'gol-opciones' | 'expulsion-opciones' | 'minuto';

const AccionModal: React.FC<AccionModalProps> = ({
    isOpen,
    onClose,
    jugador,
    idPartido,
    idCategoriaEdicion,
    idEquipo,
    accionToEdit,
    isEditing = false,
}) => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('accion');
    const [selectedAction, setSelectedAction] = useState<'gol' | 'amarilla' | 'roja' | null>(null);

    // Estados para gol
    const [golData, setGolData] = useState<{
        penal: "S" | "N";
        en_contra: "S" | "N";
        asistencia: "S" | "N";
        id_jugador_asistencia?: number;
    } | null>(null);

    // Estados para expulsión
    const [motivoExpulsion, setMotivoExpulsion] = useState<string>('');

    const cronometro = useCronometroPartido();

    // Hooks para las mutaciones
    const { mutateAsync: crearGol, isPending: isCreatingGol } = useCrearGol();
    const { mutateAsync: crearAmonestacion, isPending: isCreatingAmonestacion } = useCrearAmonestacion();
    const { mutateAsync: crearExpulsion, isPending: isCreatingExpulsion } = useCrearExpulsion();

    const { mutateAsync: editarGol, isPending: isEditingGol } = useEditarGol();
    const { mutateAsync: editarAmonestacion, isPending: isEditingAmonestacion } = useEditarAmonestacion();
    const { mutateAsync: editarExpulsion, isPending: isEditingExpulsion } = useEditarExpulsion();

    const isPending = isCreatingGol || isCreatingAmonestacion || isCreatingExpulsion ||
        isEditingGol || isEditingAmonestacion || isEditingExpulsion;

    useEffect(() => {
        if (isOpen) {
            if (isEditing && accionToEdit) {
                // Configurar modal para edición
                const tipoAccion = accionToEdit.tipo === 'doble_amarilla' ? 'roja' : accionToEdit.tipo as 'gol' | 'amarilla' | 'roja';
                setSelectedAction(tipoAccion);

                switch (accionToEdit.tipo) {
                    case 'gol':
                        setCurrentStep('gol-opciones');
                        setGolData({
                            penal: accionToEdit.penal || "N",
                            en_contra: accionToEdit.en_contra || "N",
                            asistencia: "N",
                            id_jugador_asistencia: undefined
                        });
                        break;
                    case 'roja':
                    case 'doble_amarilla':
                        setCurrentStep('expulsion-opciones');
                        setMotivoExpulsion(accionToEdit.observaciones || accionToEdit.tipo_tarjeta || '');
                        break;
                    case 'amarilla':
                        setCurrentStep('minuto');
                        break;
                }
            } else {
                // Configurar modal para creación
                resetModal();
            }
        }
    }, [isOpen, isEditing, accionToEdit]);

    const resetModal = () => {
        setCurrentStep('accion');
        setSelectedAction(null);
        setGolData(null);
        setMotivoExpulsion('');
    };

    const handleActionSelect = () => {
        if (!selectedAction) return;

        // Cambiar el step SIN cerrar
        switch (selectedAction) {
            case 'gol':
                setCurrentStep('gol-opciones');
                break;
            case 'roja':
                setCurrentStep('expulsion-opciones');
                break;
            case 'amarilla':
                setCurrentStep('minuto');
                break;
        }
    };
    
    const handleGolOptionsSubmit = (data: typeof golData) => {
        setGolData(data);
        setCurrentStep('minuto');
    };

    const handleExpulsionOptionsSubmit = (motivo: string) => {
        setMotivoExpulsion(motivo);
        setCurrentStep('minuto');
    };

    const handleMinutoSubmit = async (minuto: number) => {
        try {
            let response;

            if (isEditing && accionToEdit) {
                // Lógica para editar usando los hooks reales
                switch (selectedAction) {
                    case 'gol':
                        if (!golData) return;
                        response = await editarGol({
                            idGol: accionToEdit.id,
                            idPartido,
                            golData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto,
                                ...golData
                            }
                        });
                        break;
                    case 'amarilla':
                        response = await editarAmonestacion({
                            idAmonestacion: accionToEdit.id,
                            idPartido,
                            amonestacionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto
                            }
                        });
                        break;
                    case 'roja':
                        response = await editarExpulsion({
                            idExpulsion: accionToEdit.id,
                            idPartido,
                            expulsionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto,
                                motivo: motivoExpulsion
                            }
                        });
                        break;
                }

                if (response) {
                    const responseMessage = typeof response === 'object' && response !== null && 'message' in response 
                        ? (response as { message?: string }).message 
                        : undefined;
                    toast.success(responseMessage || `${getActionLabel(selectedAction!)} editado correctamente`);
                }
            } else {
                // Lógica original para crear
                switch (selectedAction) {
                    case 'gol':
                        if (!golData || !jugador) return;
                        response = await crearGol({
                            idPartido,
                            golData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto,
                                ...golData
                            }
                        });
                        break;

                    case 'amarilla':
                        if (!jugador) return;
                        response = await crearAmonestacion({
                            idPartido,
                            amonestacionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto
                            }
                        });
                        break;

                    case 'roja':
                        if (!jugador) return;
                        response = await crearExpulsion({
                            idPartido,
                            expulsionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto,
                                motivo: motivoExpulsion
                            }
                        });
                        break;
                }

                if (response) {
                    const responseMessage = typeof response === 'object' && response !== null && 'message' in response 
                        ? (response as { message?: string }).message 
                        : undefined;
                    toast.success(responseMessage || `${getActionLabel(selectedAction!)} registrado correctamente`);
                }
            }

            handleClose();

        } catch (error) {
            const errorObj = error as { response?: { data?: { error?: string } }; message?: string };
            const errorMessage = errorObj?.response?.data?.error || errorObj?.message || 'Error al procesar la acción';
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        if (isPending) return;
        resetModal();
        onClose();
    };

    const handleBackToAction = () => {
        if (isEditing) {
            handleClose();
        } else {
            // Si estamos creando, volver al paso de selección de acción
            setCurrentStep('accion');
            setSelectedAction(null);
            setGolData(null);
            setMotivoExpulsion('');
        }
    };


    const getActionLabel = (action: 'gol' | 'amarilla' | 'roja') => {
        const labels = {
            gol: 'Gol',
            amarilla: 'Tarjeta amarilla',
            roja: 'Expulsión'
        };
        return labels[action];
    };

    const getMinutoActual = () => {
        const [minutos] = cronometro.tiempoFormateado.split(':').map(Number);
        return minutos + (cronometro.shouldShowAdicional ? cronometro.tiempoAdicional : 0);
    };

    const getCurrentJugador = () => {
        return jugador || {
            id: accionToEdit?.id_jugador || 0,
            nombre: accionToEdit?.nombre || '',
            apellido: accionToEdit?.apellido || '',
            dorsal: null
        };
    };

    const actions = [
        {
            id: 'gol',
            label: 'Gol',
            icon: <PiSoccerBall className="w-5 h-5 text-green-400" />
        },
        {
            id: 'amarilla',
            label: 'Tarjeta amarilla',
            icon: <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-400" />
        },
        {
            id: 'roja',
            label: 'Tarjeta roja',
            icon: <TbRectangleVerticalFilled className="w-5 h-5 text-red-400" />
        }
    ] as const;

    // Renderizar el modal principal de selección de acción (solo para creación)
    if (currentStep === 'accion' && !isEditing) {
        return (
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title={
                    <div className="flex items-center justify-between w-full">
                        <span>Registrar acción</span>
                        {/* Indicador de pasos */}
                        <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-[var(--green)] flex items-center justify-center text-black text-xs font-medium">
                                    1
                                </div>
                                <span className="hidden sm:inline">Acción</span>
                            </div>
                            <div className="w-4 h-px bg-[#404040]"></div>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                                    2
                                </div>
                                <span className="hidden sm:inline">Tipo</span>
                            </div>
                            <div className="w-4 h-px bg-[#404040]"></div>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                                    3
                                </div>
                                <span className="hidden sm:inline">Minuto</span>
                            </div>
                        </div>
                    </div>
                }
                actions={
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            variant="default"
                            className="flex items-center gap-2 w-full justify-center"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleActionSelect}
                            disabled={!selectedAction}
                            variant="success"
                            className="flex items-center gap-2 w-full justify-center"
                        >
                            <Save size={16} />
                            Siguiente
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Jugador: {getCurrentJugador().apellido.toUpperCase()}, {getCurrentJugador().nombre}
                            {getCurrentJugador().dorsal && ` (#${getCurrentJugador().dorsal})`}
                        </label>
                        <div className="text-xs text-[#737373] mb-4">
                            Minuto del partido: {getMinutoActual()}&apos;
                        </div>
                        <label className="block text-sm font-medium text-[#737373] mb-3">
                            Selecciona una acción:
                        </label>
                        <div className="space-y-3">
                            {actions.map((action, index) => (
                                <label
                                    key={action.id}
                                    className="flex items-center gap-3 p-3 border border-[#262626] rounded-lg hover:bg-[#171717] transition-colors cursor-pointer animate-in slide-in-from-left-2 duration-300"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <input
                                        type="radio"
                                        name="action"
                                        value={action.id}
                                        checked={selectedAction === action.id}
                                        onChange={(e) =>
                                            setSelectedAction(e.target.value as 'gol' | 'amarilla' | 'roja')
                                        }
                                        className={`
                                            relative w-5 h-5 cursor-pointer
                                            appearance-none rounded-full border-2 border-[#262626] bg-[#171717]
                                            transition-colors duration-300 ease-in-out
                                            checked:border-[var(--green)]
                                            before:content-[''] before:absolute before:inset-1
                                            before:rounded-full before:bg-[var(--green)]
                                            before:scale-0 before:transition-transform before:duration-300 before:ease-in-out
                                            checked:before:scale-100
                                        `}
                                    />
                                    <span className="flex items-center gap-2">
                                        {action.icon}
                                        <span className="text-white font-medium">
                                            {action.label}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </BaseModal>
        );
    }

    return (
        <>
            <GolModal
                isOpen={currentStep === 'gol-opciones'}
                onClose={onClose}
                jugador={getCurrentJugador()}
                onSubmit={handleGolOptionsSubmit}
                idEquipo={idEquipo}
                onBack={handleBackToAction}
            />

            <ExpulsionModal
                isOpen={currentStep === 'expulsion-opciones'}
                onClose={handleBackToAction}
                jugador={getCurrentJugador()}
                onSubmit={handleExpulsionOptionsSubmit}
                onBack={handleBackToAction}
            />

            <MinutoModal
                isOpen={currentStep === 'minuto'}
                onClose={onClose}
                onBack={handleBackToAction}
                jugador={getCurrentJugador()}
                tipoAccion={selectedAction!}
                onSubmit={handleMinutoSubmit}
                minutoPartido={isEditing ? accionToEdit?.minuto || getMinutoActual() : getMinutoActual()}
                isLoading={isPending}
                isEditing={isEditing}
            />
        </>
    );
};

export default AccionModal;