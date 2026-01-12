import { Download, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { FichaMedica } from '@/app/services/fichaMedica.service';

interface AccionesAdminProps {
    fichaMedica: FichaMedica | null;
    isSubiendo: boolean;
    isCambiandoEstado: boolean;
    onDescargar: () => void;
    onSubir: () => void;
    onCambiarEstado: () => void;
}

export const AccionesAdmin = ({
    fichaMedica,
    isSubiendo,
    isCambiandoEstado,
    onDescargar,
    onSubir,
    onCambiarEstado,
}: AccionesAdminProps) => {
    return (
        <div className="flex items-center gap-3">
            {fichaMedica?.url_ficha && (
                <Button
                    variant="footer"
                    onClick={onDescargar}
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                </Button>
            )}
            <Button
                variant="success"
                className="flex items-center gap-2"
                onClick={onSubir}
                disabled={isSubiendo}
            >
                <Upload className="w-4 h-4" />
                {isSubiendo ? 'Subiendo...' : 'Subir PDF'}
            </Button>
            {fichaMedica && (
                <Button
                    variant="secondary"
                    onClick={onCambiarEstado}
                    className="flex items-center gap-2"
                    disabled={isCambiandoEstado}
                >
                    Cambiar Estado
                </Button>
            )}
        </div>
    );
};

