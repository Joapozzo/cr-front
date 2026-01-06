
'use client';

import { WHATSAPP_NUMBER, getWhatsAppLink as getLink } from '@/constants/contact';
import { useTenant } from '@/app/contexts/TenantContext';

export const useWhatsApp = () => {
    const tenant = useTenant();
    const whatsappNumber = WHATSAPP_NUMBER;
    const getWhatsAppLink = (message?: string) => getLink(message, tenant.nombre_empresa);

    return {
        whatsappNumber,
        getWhatsAppLink
    };
};
