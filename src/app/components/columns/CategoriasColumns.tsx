import { Shield, Users } from "lucide-react";
import { Button } from "../ui/Button";

type Column = {
    key: string;
    label: string;
    render: (value: any, row?: any) => React.ReactNode;
};

export const getCategoriasColumns = (
    handleIngresarCategoria: (id: number) => void
): Column[] => [
    {
        key: "categoria.nombre_completo",
        label: "CATEGORÍA",
        render: (value: string, row: any) => (
            <span className="font-medium text-[var(--white)]">
                {row.categoria.nombre_completo}
            </span>
        ),
    },
    {
        key: "estadisticas.estado",
        label: "ESTADO",
        render: (value: string, row: any) => (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${row.configuracion.publicada === "S"
                    ? "bg-[var(--import)] text-white"
                    : "bg-[var(--gray-200)] text-white"
                    }`}
            >
                {row.configuracion.publicada === "S" ? "PUBLICADA" : "NO PUBLICADA"}
            </span>
        ),
    },
    {
        key: "estadisticas.partidos_jugados",
        label: "PARTIDOS JUGADOS / TOTALES",
        render: (value: string, row: any) => (
            <span className="text-[var(--gray-100)]">
                {row.estadisticas.partidos_jugados}
            </span>
        ),
    },
    {
        key: "estadisticas.equipos",
        label: "EQUIPOS",
        render: (value: string, row: any) => (
            <div className="flex items-center space-x-2">
                <Shield className="text-[var(--green)]" size={18} />
                <span className="text-white font-medium">
                    {row.estadisticas.equipos}
                </span>
            </div>
        ),
    },
    {
        key: "estadisticas.jugadores",
        label: "JUGADORES",
        render: (value: string, row: any) => (
            <div className="flex items-center space-x-2">
                <Users className="text-[var(--green)]" size={18} />
                <span className="text-white font-medium">{row.estadisticas.jugadores}</span>
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
                onClick={(e) => {
                    e.stopPropagation();
                    handleIngresarCategoria(row.categoria.id_categoria);
                }}
                className="text-[var(--green)] hover:text-[var(--green)] hover:bg-[var(--green-opacity)]"
            >
                Ingresar
            </Button>
        ),
    },
];
