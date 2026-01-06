import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getEstadoInfo = (estado: string) => {
    switch (estado) {
        case 'A':
            return { text: 'Aceptada', color: 'text-[var(--color-primary)]', bgColor: 'bg-[var(--color-primary)]/20', icon: <CheckCircle size={14} /> };
        case 'R':
            return { text: 'Rechazada', color: 'text-[var(--color-secondary)]', bgColor: 'bg-[var(--color-secondary)]/20', icon: <XCircle size={14} /> };
        case 'C':
            return { text: 'Cancelada', color: 'text-[var(--gray-100)]', bgColor: 'bg-[var(--gray-300)]/20', icon: <XCircle size={14} /> };
        default:
            return { text: 'Pendiente', color: 'text-[var(--yellow)]', bgColor: 'bg-[var(--yellow)]/20', icon: <Clock size={14} /> };
    }
};

export const EstadoBadge: React.FC<{ estado: string }> = ({ estado }) => {
    const { text, color, bgColor, icon } = getEstadoInfo(estado);
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgColor} ${color} text-xs font-medium`}>
            {icon}
            <span>{text}</span>
        </div>
    );
};