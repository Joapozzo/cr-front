import { PartidoResponse } from '@/app/schemas/partidos.schema';
import {
    Edit3,
    Trash2,
    MessageSquare,
} from 'lucide-react';
import { EscudoEquipo } from '../common/EscudoEquipo';

type PartidoRow = PartidoResponse;

const GetPartidosColumns = (onEliminarPartido?: (partido: PartidoRow) => void, onEditar?: (partido: PartidoRow) => void, onVerDescripcion?: (partido: PartidoRow) => void) => {

    const EstadoBadge = ({ estado }: { estado: string }) => {
        const estados = {
            'F': { label: 'FINALIZADO', color: 'bg-[var(--color-primary)] text-white' },
            'P': { label: 'PROGRAMADO', color: 'bg-[var(--yellow)] text-white' },
            'C1': { label: 'EN VIVO', color: 'bg-[var(--color-primary)] text-white animate-pulse' },
            'E': { label: 'EN VIVO', color: 'bg-[var(--color-primary)] text-white animate-pulse' },
            'C2': { label: 'EN VIVO', color: 'bg-[var(--color-primary)] text-white animate-pulse' },
            'C': { label: 'EN CURSO', color: 'bg-[var(--blue)] text-white' },
            'S': { label: 'SUSPENDIDO', color: 'bg-red-600 text-white' },
            'A': { label: 'APLAZADO', color: 'bg-orange-600 text-white' },
            'T': { label: 'FALTA SUBIR', color: 'bg-yellow-600 text-white' },
            'I': { label: 'INDEFINIDO', color: 'bg-[var(--gray-600)] text-white' },
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
            render: (value: unknown, row: PartidoRow, _index: number) => (
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[var(--white)] font-medium text-right">
                        {row.equipoLocal?.nombre || 'Sin definir'}
                    </span>
                    <EscudoEquipo
                        src={row.equipoLocal?.img}
                        alt={row.equipoLocal?.nombre || 'Sin definir'}
                        width={20}
                        height={20}
                    />
                </div>
            ),
        },
        {
            key: "resultado",
            label: "",
            render: (value: unknown, row: PartidoRow, _index: number) =>
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
            render: (value: unknown, row: PartidoRow, _index: number) => (
                <div className="flex items-center justify-start gap-2">
                    <EscudoEquipo
                        src={row.equipoVisita?.img}
                        alt={row.equipoVisita?.nombre || 'Sin definir'}
                        width={20}
                        height={20}
                    />
                    <span className="text-[var(--white)] font-medium text-left">
                        {row.equipoVisita?.nombre || 'Sin definir'}
                    </span>
                </div>
            ),
        },
        {
            key: "dia",
            label: "DÍA",
            render: (value: unknown, row: PartidoRow, _index: number) => {
                if (!value) return <span className="text-[var(--gray-100)]">-</span>;
                const dateValue = value instanceof Date ? value : new Date(String(value));
                return (
                    <span className="text-[var(--gray-100)]">
                        {dateValue.toLocaleDateString("es-ES")}
                    </span>
                );
            },
        },
        {
            key: "estado",
            label: "ESTADO",
            render: (value: unknown, row: PartidoRow, _index: number) => <EstadoBadge estado={String(value)} />,
        },
        {
            key: "hora",
            label: "HORA",
            render: (value: unknown, row: PartidoRow, _index: number) => (
                <span className="text-[var(--gray-100)]">{String(value || '-')}</span>
            ),
        },
        {
            key: "planillero",
            label: "PLANILLERO",
            render: (value: unknown, row: PartidoRow, _index: number) => (
                <span className="text-[var(--gray-100)]">
                    {row.planillero?.nombre} {row.planillero?.apellido}
                </span>
            ),
        },
        {
            key: "cancha",
            label: "CANCHA",
            render: (value: unknown, row: PartidoRow, _index: number) => {
                const canchaNombre = row.cancha?.nombre || (typeof value === 'string' ? value : 'Sin cancha');
                return (
                    <span className="text-[var(--gray-100)]">{canchaNombre}</span>
                );
            },
        },
        {
            key: "actions",
            label: "",
            render: (value: unknown, row: PartidoRow, _index: number) => (
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
                        className="px-3 py-2 rounded-md bg-[var(--color-danger)] text-white hover:opacity-70 transition"
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