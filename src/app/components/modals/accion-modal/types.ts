import { IncidenciaPartido } from "@/app/types/partido";

export type ModalStep = 'accion' | 'gol-opciones' | 'expulsion-opciones' | 'minuto';

export type ActionType = 'gol' | 'amarilla' | 'roja';

export interface GolData {
    penal: "S" | "N";
    en_contra: "S" | "N";
    asistencia: "S" | "N";
    id_jugador_asistencia?: number;
}

export interface AccionModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador?: { id: number; nombre: string; apellido: string; dorsal: number | null };
    idPartido: number;
    idCategoriaEdicion: number;
    idEquipo: number;
    accionToEdit?: IncidenciaPartido;
    isEditing?: boolean;
}

export interface JugadorInfo {
    id: number;
    nombre: string;
    apellido: string;
    dorsal: number | null;
}

export interface ActionItem {
    id: ActionType;
    label: string;
    icon: React.ReactNode;
}

