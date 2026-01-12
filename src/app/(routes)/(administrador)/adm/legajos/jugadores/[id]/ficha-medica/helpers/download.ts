import toast from 'react-hot-toast';
import fichaMedicaService from '@/app/services/fichaMedica.service';
import { obtenerToken } from '@/app/services/auth.services';

/**
 * Descarga el PDF de la ficha médica de un jugador
 */
export const descargarFichaMedica = async (idJugador: number, urlFicha?: string): Promise<void> => {
    if (!urlFicha) {
        toast.error('No hay URL disponible para descargar');
        return;
    }

    try {
        const url = fichaMedicaService.obtenerUrlDescarga(idJugador);
        const token = await obtenerToken();

        if (!token) {
            throw new Error('No se pudo obtener el token de autenticación');
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al descargar el PDF');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `ficha-medica-${idJugador}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlBlob);
        toast.success('PDF descargado exitosamente');
    } catch (error: any) {
        console.error('Error al descargar:', error);
        toast.error(error.message || 'Error al descargar el PDF');
        throw error;
    }
};

