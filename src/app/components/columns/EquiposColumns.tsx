import { FileText, Trash2, Users, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { EscudoEquipo } from "../common/EscudoEquipo";

const getEquiposColumns = (
    handleDeleteEquipo: (id: number) => void,
) => {
    const EstadoBadge = ({ estado }: { estado: string }) => {
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${estado
                    ? "bg-[var(--color-primary)] text-white"
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
            render: (value: unknown, row: any) => (
                <div className="flex items-center gap-3">
                    <EscudoEquipo src={row.img} alt={row.nombre} size={32} className="flex-shrink-0" />
                    <span className="text-[var(--white)] font-medium">
                        {row.nombre}
                    </span>
                </div>
            ),
        },
        {
            key: "vacante",
            label: "VACANTE",
            render: (value: unknown) => <EstadoBadge estado={String(value)} />,
        },
        {
            key: "lista_buena_fe",
            label: "LISTA DE BUENA FE",
            render: (value: unknown, row: any) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-[var(--white)] font-medium">
                        {row.lista_de_buena_fe}
                    </span>
                </div>
            ),
        },
        {
            key: "solicitudes_pendientes",
            label: "SOLICITUDES PENDIENTES",
            render: (value: unknown, row: any) => {
                const solicitudes = (typeof value === 'number' ? value : 0) || 0;
                const invitaciones = row.invitaciones_pendientes || 0;
                const total = solicitudes + invitaciones;
                
                return (
                    <div className="flex items-center gap-3">
                        {/* Solicitudes (jugadores solicitan unirse) */}
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[var(--yellow)]" />
                            <span
                                className={`font-medium text-xs ${solicitudes === 0 ? "text-[var(--gray-100)]" : "text-[var(--yellow)]"
                                    }`}
                            >
                                {solicitudes}
                            </span>
                        </div>
                        {/* Invitaciones (equipo invita jugadores) */}
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[var(--blue)]" />
                            <span
                                className={`font-medium text-xs ${invitaciones === 0 ? "text-[var(--gray-100)]" : "text-[var(--blue)]"
                                    }`}
                            >
                                {invitaciones}
                            </span>
                        </div>
                        {/* Total */}
                        {total > 0 && (
                            <span className="text-[var(--white)] font-semibold text-xs">
                                ({total})
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            key: "actions",
            label: "",
            render: (value: unknown, row: any) => (
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