import { Partido } from '@/app/types/partido';
import {
    Edit3,
    Trash2,
    MessageSquare,
    Shield,
} from 'lucide-react';

const GetPartidosColumns = (onEliminarPartido?: (partido: any) => void, onEditar?: (partido: any) => void, onVerDescripcion?: (partido: Partido) => void) => {

    const EstadoBadge = ({ estado }: { estado: string }) => {
        const estados = {
            'F': { label: 'FINALIZADO', color: 'bg-[var(--green)] text-white' },
            'P': { label: 'PROGRAMADO', color: 'bg-[var(--yellow)] text-white' },
            'C': { label: 'EN CURSO', color: 'bg-[var(--blue)] text-white' },
            'S': { label: 'SUSPENDIDO', color: 'bg-red-600 text-white' },
            'T': { label: 'FALTA SUBIR', color: 'bg-yellow-600 text-white' },
        };

        const estadoInfo = estados[estado as keyof typeof estados] || estados['P'];

        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${estadoInfo.color}`}>
                {estadoInfo.label}
            </span>
        );
    };

    return [
        {
            key: "equipo_local",
            label: <div className="w-full text-right">LOCAL</div>,
            render: (value: string, row: any) => (
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[var(--white)] font-medium text-right">
                        {row.equipoLocal?.nombre || 'Sin definir'}
                    </span>
                    <div className="w-8 h-8 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                    </div>
                </div>
            ),
        },
        {
            key: "resultado",
            label: "",
            render: (value: string, row: any) =>
                row.estado === "F" &&
                    row.goles_local !== null &&
                    row.goles_visita !== null ? (
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[var(--white)] font-bold">
                            {row.goles_local}
                        </span>
                        <span className="text-[var(--gray-100)]">-</span>
                        <span className="text-[var(--white)] font-bold">
                            {row.goles_visita}
                        </span>
                    </div>
                ) : (
                    <span className="text-[var(--gray-100)] flex justify-center">
                        -
                    </span>
                ),
        },
        {
            key: "equipo_visita",
            label: "VISITANTE",
            render: (value: string, row: any) => (
                <div className="flex items-center justify-start gap-2">
                    <div className="w-8 h-8 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                    </div>
                    <span className="text-[var(--white)] font-medium text-left">
                        {row.equipoVisita?.nombre || 'Sin definir'}
                    </span>
                </div>
            ),
        },
        {
            key: "dia",
            label: "DÍA",
            render: (value: string, row: any) => (
                <span className="text-[var(--gray-100)]">
                    {new Date(value).toLocaleDateString("es-ES")}
                </span>
            ),
        },
        {
            key: "estado",
            label: "ESTADO",
            render: (value: string, row: any) => <EstadoBadge estado={value} />,
        },
        {
            key: "hora",
            label: "HORA",
            render: (value: string, row: any) => (
                <span className="text-[var(--gray-100)]">{value}</span>
            ),
        },
        {
            key: "planillero",
            label: "PLANILLERO",
            render: (value: string, row: any) => (
                <span className="text-[var(--gray-100)]">
                    {row.planillero?.nombre} {row.planillero?.apellido}
                </span>
            ),
        },
        {
            key: "cancha",
            label: "CANCHA",
            render: (value: string, row: any) => (
                <span className="text-[var(--gray-100)]">Cancha {value}</span>
            ),
        },
        {
            key: "actions",
            label: "",
            render: (value: string, row: any) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEditar?.(row)}
                        className="px-3 py-2 rounded-md bg-[var(--export)] text-white hover:opacity-70 transition"
                    >
                        <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onVerDescripcion?.(row)}
                        className="px-3 py-2 rounded-md bg-[var(--import)] text-white hover:opacity-70 transition"
                    >
                        <MessageSquare className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onEliminarPartido?.(row)}
                        className="px-3 py-2 rounded-md bg-[var(--danger)] text-white hover:opacity-70 transition"
                        title="Eliminar partido"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ),
        },
    ];
}

export default GetPartidosColumns;