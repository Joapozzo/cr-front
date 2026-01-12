import { FichaMedica } from '@/app/services/fichaMedica.service';
import { InfoField } from './InfoField';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FichaMedicaDetalleProps {
    fichaMedica: FichaMedica;
}

const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
};

const formatDateTime = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: es });
};

export const FichaMedicaDetalle = ({ fichaMedica }: FichaMedicaDetalleProps) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <InfoField
                    label="Fecha de emisión"
                    value={formatDate(fichaMedica.fecha_emision)}
                />
                <InfoField
                    label="Fecha de vencimiento"
                    value={formatDate(fichaMedica.fecha_vencimiento)}
                />
                <InfoField
                    label="Fecha de creación"
                    value={formatDateTime(fichaMedica.fecha_creacion)}
                />
                <InfoField
                    label="Última actualización"
                    value={formatDateTime(fichaMedica.fecha_actualizacion)}
                />
            </div>

            {fichaMedica.motivo && (
                <InfoField
                    label="Motivo"
                    value={fichaMedica.motivo}
                />
            )}

            {fichaMedica.motivo_rechazo && (
                <InfoField
                    label="Motivo de Rechazo"
                    value={fichaMedica.motivo_rechazo}
                    variant="error"
                />
            )}

            {fichaMedica.observaciones && (
                <InfoField
                    label="Observaciones"
                    value={fichaMedica.observaciones}
                />
            )}

            {fichaMedica.subidoPorUsuario && (
                <InfoField
                    label="Subido por"
                    value={`${fichaMedica.subidoPorUsuario.nombre} ${fichaMedica.subidoPorUsuario.apellido}`}
                />
            )}
        </>
    );
};

