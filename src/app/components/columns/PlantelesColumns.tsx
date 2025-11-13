import { Edit3, Trash2, User } from "lucide-react";

const getPlantelColumns = () => {

    const EstadoBadge = ({ sancionado }: {
        sancionado: string;
    }) => {
        const getEstadoColor = () => {
            if (sancionado === 'Inactivo') return 'bg-[var(--red)] text-white';
            return 'bg-[var(--green)] text-[var(--gray-400)]';
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
        //                     console.log('Editar jugador', row.id_jugador);
        //                 }}
        //                 className="p-2 rounded-md bg-[var(--import)] text-white hover:opacity-70 transition"
        //                 title="Editar jugador"
        //             >
        //                 <Edit3 className="w-4 h-4" />
        //             </button>
        //             <button
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     console.log('Eliminar jugador', row.id_jugador);
        //                 }}
        //                 className="p-2 rounded-md bg-[var(--red)] text-white hover:opacity-70 transition"
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
            render: (value: string) => (
                <span className={`font-mono text-sm ${value === 'Sin DNI'
                    ? 'text-[var(--red)] font-medium'
                    : 'text-[var(--white)]'
                    }`}>
                    {value}
                </span>
            ),
        },
        {
            key: "nombre",
            label: "JUGADOR",
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[var(--gray-100)]" />
                    </div>
                    <span className="text-[var(--white)] font-medium">
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: "posicion",
            label: "POSICIÓN",
            render: (value: any) => (
                <span className="text-[var(--gray-100)]">
                    {value?.codigo || '-'}
                </span>
            ),
        },
        {
            key: "estado_sancion",
            label: "ESTADO",
            render: (value: string, row: any) => (
                <EstadoBadge
                    sancionado={value}
                />
            ),
        },
        {
            key: "partidos_jugados",
            label: "PJ",
            render: (value: number) => (
                <span className="text-[var(--white)] font-semibold">
                    {value}
                </span>
            ),
        },
        {
            key: "es_eventual",
            label: "EVENTUAL",
            render: (value: boolean) => (
                <span className={`text-sm font-medium ${value ? 'text-[var(--yellow)]' : 'text-[var(--gray-100)]'
                    }`}>
                    {value ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            key: "Capitan",
            label: "Rol",
            render: (value: boolean, row: any) => (
                <CapitanBadge capitan={row.capitan} />
            ),
        },
    ];
}

export default getPlantelColumns;