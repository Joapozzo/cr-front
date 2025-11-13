import { FileText, Shield, Trash2, Users } from "lucide-react";
import { Button } from "../ui/Button";

const getEquiposColumns = (
    handleDeleteEquipo: (id: number) => void,
) => {
    const EstadoBadge = ({ estado }: { estado: string }) => {
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${estado
                    ? "bg-[var(--green)] text-white"
                    : "bg-[var(--gray-200)] text-[var(--gray-100)]"
                    }`}
            >
                {estado ? `ASIGNADA` : `SIN ASIGNAR`}
            </span>
        );
    };

    return [
        {
            key: "nombre",
            label: "NOMBRE",
            render: (value: string, row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                    </div>
                    <span className="text-[var(--white)] font-medium">
                        {row.nombre}
                    </span>
                </div>
            ),
        },
        {
            key: "vacante",
            label: "VACANTE",
            render: (value: string) => <EstadoBadge estado={value} />,
        },
        {
            key: "lista_buena_fe",
            label: "LISTA DE BUENA FE",
            render: (value: number, row: any) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--green)]" />
                    <span className="text-[var(--white)] font-medium">
                        {row.lista_de_buena_fe}
                    </span>
                </div>
            ),
        },
        {
            key: "solicitudes_pendientes",
            label: "SOLICITUDES PENDIENTES",
            render: (value: number) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--yellow)]" />
                    <span
                        className={`font-medium ${value === 0 ? "text-[var(--gray-100)]" : "text-[var(--yellow)]"
                            }`}
                    >
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "",
            render: (value: any, row: any) => (
                <div className="flex items-center gap-2">
                    {/* <button
                        onClick={() => handleEditEquipo(row.id_equipo)}
                        className="p-2 rounded-md bg-[var(--import)] text-white hover:opacity-70 transition"
                        title="Editar equipo"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button> */}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEquipo(row.id_equipo);
                        }}
                        className="flex items-center gap-2"
                        title="Eliminar equipo"
                        variant="more"
                    >
                        <Trash2 className="w-4 h-4" />
                        Expulsar
                    </Button>
                </div>
            ),
        },
    ];
};

export default getEquiposColumns;