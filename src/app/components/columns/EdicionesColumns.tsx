import { Shield, User, TableProperties } from "lucide-react";
import { Button } from "../ui/Button";

type Column = {
    key: string;
    label: string;
    render: (value: any, row?: any) => React.ReactNode;
};

export const getEdicionesColumns = (
    handleIngresarEdicion: (id: number) => void
): Column[] => [
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
            render: (value: string) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${value === "A"
                        ? "bg-[var(--import)] text-white"
                        : value === "F"
                            ? "bg-gray-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                >
                    {value === "A"
                        ? "JUGANDO"
                        : value === "F"
                            ? "FINALIZADA"
                            : "INACTIVA"}
                </span>
            ),
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
                    <User size={20} className="text-[var(--green)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "equipos",
            label: "EQUIPOS",
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-[var(--green)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "categorias",
            label: "CATEGORÍAS",
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <TableProperties size={20} className="text-[var(--green)]" />
                    <span className="text-white font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "",
            render: (_: any, row: any) => (
                <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleIngresarEdicion(row.id_edicion)}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                >
                    Ingresar
                </Button>
            ),
        },
    ];
