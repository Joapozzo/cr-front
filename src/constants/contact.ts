export const WHATSAPP_NUMBER = "5493516XXXXXX"; // Reemplazar con el número real

export const getWhatsAppLink = (message?: string) => {
    const defaultMessage = "Hola! Quiero información sobre cómo inscribir mi equipo en Copa Relámpago";
    const finalMessage = encodeURIComponent(message || defaultMessage);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${finalMessage}`;
};
