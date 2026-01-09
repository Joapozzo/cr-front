import { Shield, User, TableProperties } from "lucide-react";
import { Button } from "../ui/Button";
import { EscudoEquipo } from "../common/EscudoEquipo";

type Column = {
    key: string;
    label: string;
    render: (value: any, row?: any) => React.ReactNode;
};

export const getEdicionesColumns = (
    handleIngresarEdicion: (id: number) => void
): Column[] => [
        {
            key: "img",
            label: "LOGO",
            render: (_: unknown, row: { img?: string | null; nombre?: string }) => (
                <div className="flex items-center">
                    <EscudoEquipo
                        src={row.img}
                        alt={row.nombre || 'Edición'}
                        width={40}
                        height={40}
                        // fallbackIcon={<Trophy className="w-6 h-6 text-[var(--gray-100)]" />}
                    />
                </div>
            ),
        },
        {
            key: "nombre",
            label: "NOMBRE",
            render: (value: string) => (
                <span className="font-medium text-white">{value}</span>
            ),
        },
        {
            key: "estado",
            label: "ESTADO",
            render: (value: string) => {
                const estadoConfig = {
                    'I': { label: 'INACTIVA', bg: 'bg-gray-500', text: 'text-white' },
                    'A': { label: 'ACTIVA', bg: 'bg-[var(--import)]', text: 'text-white' },
                    'T': { label: 'TERMINADA', bg: 'bg-blue-500', text: 'text-white' },
                };
                const config = estadoConfig[value as keyof typeof estadoConfig] || estadoConfig['I'];
                
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        {config.label}
                    </span>
                );
            },
        },
        {
            key: "partidos_jugados",
            label: "PARTIDOS JUGADOS",
            render: (value: string) => (
                <span className="text-gray-300">{value}</span>
            ),
        },
        {
            key: "jugadores",
            label: "JUGADORES",
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <User size={20} className="text-[var(--color-primary)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "equipos",
            label: "EQUIPOS",
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-[var(--color-primary)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "categorias",
            label: "CATEGORÍAS",
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <TableProperties size={20} className="text-[var(--color-primary)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "",
            render: (_: unknown, row: { id_edicion: number }) => (
                <Button
                    variant="success"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevenir que se active el click de la fila
                        handleIngresarEdicion(row.id_edicion);
                    }}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-opacity)]"
                >
                    Ingresar
                </Button>
            ),
        },
    ];
