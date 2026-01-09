import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado de expansión del formulario de email
 * Mantiene el estado expandido incluso cuando falla el login para mejor UX
 */
export const useEmailExpansion = () => {
    const [isEmailExpanded, setIsEmailExpanded] = useState(false);

    /**
     * Expande el formulario de email
     */
    const expandEmail = useCallback(() => {
        setIsEmailExpanded(true);
    }, []);

    /**
     * Colapsa el formulario de email
     * Solo se usa cuando el login es exitoso (aunque en ese caso se redirige)
     */
    const collapseEmail = useCallback(() => {
        setIsEmailExpanded(false);
    }, []);

    return {
        isEmailExpanded,
        expandEmail,
        collapseEmail,
    };
};

