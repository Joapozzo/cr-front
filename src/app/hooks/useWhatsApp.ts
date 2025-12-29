
import { WHATSAPP_NUMBER, getWhatsAppLink as getLink } from '@/constants/contact';

export const useWhatsApp = () => {
    const whatsappNumber = WHATSAPP_NUMBER;
    const getWhatsAppLink = (message?: string) => getLink(message);

    return {
        whatsappNumber,
        getWhatsAppLink
    };
};
