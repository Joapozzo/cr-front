"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mensaje?: string) => void;
    title: string;
    description: string;
    confirmText: string;
    cancelText?: string;
    variant?: 'success' | 'danger' | 'default';
    icon?: React.ReactNode;
    isLoading?: boolean;
    children?: React.ReactNode;
    showTextarea?: boolean; // Nueva prop para mostrar textarea
    textareaPlaceholder?: string;
    textareaLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText = "Cancelar",
    variant = 'default',
    icon,
    isLoading = false,
    children,
    showTextarea = false,
    textareaPlaceholder = "Escribe un mensaje...",
    textareaLabel = "Mensaje opcional"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mensajeInterno, setMensajeInterno] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setMensajeInterno('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else if (isVisible) {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 200);
        }
    }, [isOpen, isVisible]);

    const handleClose = () => {
        if (isLoading) return;
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 200);
    };

    const handleConfirm = () => {
        onConfirm(mensajeInterno.trim() || undefined);
    };

    if (!isVisible) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            handleClose();
        }
    };

    const getVariantColors = () => {
        switch (variant) {
            case 'success':
                return {
                    iconBg: 'bg-green-500/10',
                    iconColor: 'text-green-400',
                    buttonVariant: 'success' as const
                };
            case 'danger':
                return {
                    iconBg: 'bg-red-500/10',
                    iconColor: 'text-red-400',
                    buttonVariant: 'danger' as const
                };
            default:
                return {
                    iconBg: 'bg-blue-500/10',
                    iconColor: 'text-blue-400',
                    buttonVariant: 'footer' as const
                };
        }
    };

    const colors = getVariantColors();

    return (
        <div
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleOverlayClick}
        >
            <div className={`bg-black rounded-2xl border border-[var(--gray-300)] w-full max-w-md transition-all duration-300 ${
                isAnimating
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4'
                
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                                <div className={colors.iconColor}>
                                    {icon}
                                </div>
                            </div>
                        )}
                        <h3 className="text-[var(--white)] font-bold text-lg">{title}</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-[var(--gray-300)] rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        <p className="text-[var(--white)] text-base text-start">
                            {description}
                        </p>

                        {children && (
                            <div className="bg-[var(--background)] border border-[var(--gray-300)] rounded-lg p-3">
                                {children}
                            </div>
                        )}

                        {showTextarea && (
                            <Textarea
                                label={textareaLabel}
                                placeholder={textareaPlaceholder}
                                value={mensajeInterno}
                                onChange={(e) => setMensajeInterno(e.target.value)}
                                rows={3}
                            />
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-0">
                    <div className="flex gap-3">
                        <Button
                            onClick={handleClose}
                            variant="default"
                            className="flex items-center gap-2 w-full justify-center"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant={colors.buttonVariant}
                            className="flex items-center gap-2 w-full justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;