import { Calendar, FileText, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

const getEquiposInactivosColumns = (
    onReactivar: (id: number) => void
) => {
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
            key: "expulsion.fecha_expulsion",
            label: "FECHA EXPULSIÓN",
            render: (value: string, row: any) => {
                const fecha = new Date(row.expulsion.fecha_expulsion);
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--red)]" />
                        <div>
                            <p className="text-[var(--white)] text-sm">
                                {fecha.toLocaleDateString("es-AR")}
                            </p>
                            <p className="text-[var(--gray-100)] text-xs">
                                {fecha.toLocaleTimeString("es-AR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "expulsion.motivo",
            label: "MOTIVO",
            render: (value: string, row: any) => (
                <div className="flex items-center gap-2 max-w-xs">
                    <FileText className="w-4 h-4 text-[var(--yellow)]" />
                    <span className="text-[var(--white)] text-sm truncate">
                        {row.expulsion.motivo || "Sin motivo especificado"}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "ACCIONES",
            render: (value: any, row: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="more"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReactivar(row.id_equipo);
                        }}
                        className="flex items-center gap-2"
                        title="Reactivar equipo"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reactivar
                    </Button>
                </div>
            ),
        },
    ];
};

export default getEquiposInactivosColumns;
