export const WHATSAPP_NUMBER = "5493516829820";

// Esta función ahora debe recibir el nombre del tenant como parámetro
// O usar useTenant() en componentes del cliente
export const getWhatsAppLink = (message?: string, tenantName?: string) => {
    const defaultMessage = tenantName 
        ? `Hola! Quiero información sobre cómo inscribir mi equipo en ${tenantName}`
        : "Hola! Quiero información sobre cómo inscribir mi equipo";
    const finalMessage = encodeURIComponent(message || defaultMessage);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${finalMessage}`;
};
