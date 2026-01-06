import { User, LogOut, Ban } from "lucide-react";
import { ImagenPublica } from "../common/ImagenPublica";
import { Button } from "../ui/Button";

interface PlantelActions {
    onDarBaja?: (id_jugador: number, nombre: string) => void;
    onExpulsar?: (id_jugador: number, nombre: string) => void;
}

const getPlantelColumns = (actions?: PlantelActions) => {

    const EstadoBadge = ({ sancionado }: {
        sancionado: string;
    }) => {
        const getEstadoColor = () => {
            if (sancionado === 'Inactivo') return 'bg-[var(--color-secondary)] text-white';
            return 'bg-[var(--color-primary)] text-[var(--gray-400)]';
        };

        const getEstadoTexto = () => {
            if (sancionado === 'Inactivo') return 'Sancionado';
            return 'Apto';
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor()}`}>
                {getEstadoTexto()}
            </span>
        );
    };

    const CapitanBadge = ({ capitan }: {
        capitan: boolean;
    }) => {
        const getEstadoColor = () => {
            if (capitan) return 'bg-[var(--yellow)] text-white';
            return 'bg-[var(--gray-300)] text-[var(--gray-100)]';
        };

        const getEstadoTexto = () => {
            if (capitan) return 'Capitan';
            return 'Jugador';
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor()}`}>
                {getEstadoTexto()}
            </span>
        );
    };

    return [
        // {
        //     key: "actions",
        //     label: "",
        //     render: (value: any, row: any) => (
        //         <div className="flex items-center gap-2">
        //             <button
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     ('Editar jugador', row.id_jugador);
        //                 }}
        //                 className="p-2 rounded-md bg-[var(--import)] text-white hover:opacity-70 transition"
        //                 title="Editar jugador"
        //             >
        //                 <Edit3 className="w-4 h-4" />
        //             </button>
        //             <button
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     ('Eliminar jugador', row.id_jugador);
        //                 }}
        //                 className="p-2 rounded-md bg-[var(--color-secondary)] text-white hover:opacity-70 transition"
        //                 title="Eliminar jugador"
        //             >
        //                 <Trash2 className="w-4 h-4" />
        //             </button>
        //         </div>
        //     ),
        // },
        {
            key: "dni",
            label: "DNI",
            render: (value: unknown, _row: any, _index: number) => {
                const dniValue = String(value);
                return (
                    <span className={`font-mono text-sm ${dniValue === 'Sin DNI'
                        ? 'text-[var(--color-secondary)] font-medium'
                        : 'text-[var(--white)]'
                        }`}>
                        {dniValue}
                    </span>
                );
            },
        },
        {
            key: "nombre",
            label: "JUGADOR",
            render: (value: unknown, row: any, _index: number) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <ImagenPublica
                            src={row.img}
                            alt={String(value)}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-cover"
                            fallbackIcon={<User className="w-4 h-4 text-[var(--gray-100)]" />}
                        />
                    </div>
                    <span className="text-[var(--white)] font-medium">
                        {String(value)}
                    </span>
                </div>
            ),
        },
        {
            key: "posicion",
            label: "POSICIÓN",
            render: (value: unknown, _row: any, _index: number) => (
                <span className="text-[var(--gray-100)]">
                    {(value as any)?.codigo || '-'}
                </span>
            ),
        },
        {
            key: "estado_sancion",
            label: "ESTADO",
            render: (value: unknown, _row: any, _index: number) => (
                <EstadoBadge
                    sancionado={String(value)}
                />
            ),
        },
        {
            key: "partidos_jugados",
            label: "PJ",
            render: (value: unknown, _row: any, _index: number) => (
                <span className="text-[var(--white)] font-semibold">
                    {String(value)}
                </span>
            ),
        },
        {
            key: "es_eventual",
            label: "EVENTUAL",
            render: (value: unknown, _row: any, _index: number) => (
                <span className={`text-sm font-medium ${value ? 'text-[var(--yellow)]' : 'text-[var(--gray-100)]'
                    }`}>
                    {value ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            key: "Capitan",
            label: "Rol",
            render: (_value: unknown, row: any, _index: number) => (
                <CapitanBadge capitan={Boolean(row.capitan)} />
            ),
        },
        // Acciones (solo si se proporcionan)
        ...(actions ? [{
            key: "actions",
            label: "ACCIONES",
            render: (_value: unknown, row: any, _index: number) => {
                const nombreCompleto = `${row.nombre || ''}`.trim();
                return (
                    <div className="flex items-center gap-2">
                        {actions.onDarBaja && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    actions.onDarBaja?.(row.id_jugador, nombreCompleto);
                                }}
                                className="flex items-center gap-1"
                                title="Dar de baja del plantel"
                            >
                                <LogOut className="w-4 h-4" />
                                Dar de baja
                            </Button>
                        )}
                        {actions.onExpulsar && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    actions.onExpulsar?.(row.id_jugador, nombreCompleto);
                                }}
                                className="flex items-center gap-1"
                                title="Expulsar del torneo"
                            >
                                <Ban className="w-4 h-4" />
                                Expulsar
                            </Button>
                        )}
                    </div>
                );
            },
        }] : []),
    ];
}

export default getPlantelColumns;