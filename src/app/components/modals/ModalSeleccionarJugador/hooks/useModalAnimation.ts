import { useState, useEffect } from 'react';

interface UseModalAnimationProps {
    isOpen: boolean;
    animationDuration?: number;
}

/**
 * Hook que maneja la animación de entrada/salida del modal
 */
export const useModalAnimation = ({
    isOpen,
    animationDuration = 300,
}: UseModalAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Pequeño delay para permitir que el DOM se actualice
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, animationDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, animationDuration]);

    return {
        isVisible,
        isAnimating,
    };
};

