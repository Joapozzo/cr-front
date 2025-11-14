/**
 * Formatea una fecha a un formato corto y legible
 * @param fecha - Fecha en formato ISO (YYYY-MM-DD) o string
 * @returns Fecha formateada (ej: "15 Mar" o "Mar 15")
 */
export const formatearFechaCorta = (fecha: string | null): string => {
    if (!fecha) return '';

    try {
        const date = new Date(fecha);

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) return fecha;

        const dia = date.getDate();
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mes = meses[date.getMonth()];

        return `${dia} ${mes}`;
    } catch (error) {
        return fecha;
    }
};

/**
 * Formatea una hora a formato corto (HH:MM)
 * @param hora - Hora en formato string
 * @returns Hora formateada
 */
export const formatearHoraCorta = (hora: string | null): string => {
    if (!hora) return '';

    try {
        // Si ya está en formato HH:MM, devolverla tal cual
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
            return hora.substring(0, 5); // Solo tomar HH:MM
        }

        return hora;
    } catch (error) {
        return hora;
    }
};

/**
 * Formatea fecha y hora juntas
 * @param fecha - Fecha en formato ISO
 * @param hora - Hora en formato string
 * @returns Fecha y hora formateadas (ej: "15 Mar - 18:00")
 */
export const formatearFechaHora = (fecha: string | null, hora: string | null): string => {
    const fechaFormateada = formatearFechaCorta(fecha);
    const horaFormateada = formatearHoraCorta(hora);

    if (fechaFormateada && horaFormateada) {
        return `${fechaFormateada} - ${horaFormateada}`;
    }

    return fechaFormateada || horaFormateada || '';
};

// Convierte "2025-11-08T00:00:00.000Z" a "2025-11-08"
export const formatISOToDateInput = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
        // 'sv-SE' (Suecia) es un truco para obtener el formato YYYY-MM-DD
        return new Date(isoString).toLocaleDateString('sv-SE');
    } catch (e) {
        return "";
    }
};

// Convierte "2025-11-08" a "2025-11-08T00:00:00.000Z"
export const convertDateToISO = (dateString?: string) => {
    if (!dateString) return undefined; // Enviar undefined para no actualizar
    // Añadimos la hora UTC para que pase la validación .datetime()
    return `${dateString}T00:00:00.000Z`;
};

export const formatearFechaNoticia = (fecha: Date | string) => {
    const ahora = new Date();
    const fechaNoticia = new Date(fecha);
    const diferencia = ahora.getTime() - fechaNoticia.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);

    if (dias > 7) {
        return fechaNoticia.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short'
        });
    }
    if (dias > 0) return `Hace ${dias}d`;
    if (horas > 0) return `Hace ${horas}h`;
    return 'Reciente';
};

export const formatearFechaCompleta = (fecha: string) => {
    const date = new Date(fecha);
    const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    
    const diaSemana = dias[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    
    return `${diaSemana}, ${dia} ${mes}`;
  };