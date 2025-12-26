"use client";
import { AlertTriangle, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";

type ModalVariant = 'success' | 'danger' | 'warning';

interface ConfirmActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ModalVariant;
    isLoading?: boolean;
    details?: React.ReactNode;
}

const variantConfig: Record<ModalVariant, {
    icon: React.ComponentType<{ className?: string }>;
    iconBgColor: string;
    iconColor: string;
    buttonVariant: 'success' | 'danger' | 'default';
}> = {
    success: {
        icon: Check,
        iconBgColor: 'bg-green-500/10',
        iconColor: 'text-green-400',
        buttonVariant: 'success'
    },
    danger: {
        icon: X,
        iconBgColor: 'bg-red-500/10',
        iconColor: 'text-red-400',
        buttonVariant: 'danger'
    },
    warning: {
        icon: AlertTriangle,
        iconBgColor: 'bg-yellow-500/10',
        iconColor: 'text-yellow-400',
        buttonVariant: 'default'
    }
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = 'warning',
    isLoading = false,
    details
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const config = variantConfig[variant];
    const IconComponent = config.icon;

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

    const handleConfirm = async () => {
        await onConfirm();
    };

    if (!isVisible) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            handleClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-1000 p-4 transition-opacity duration-200 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-[var(--gray-400)] rounded-2xl border border-[var(--gray-300)] w-full max-w-md transition-all duration-300 ${
                    isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${config.iconBgColor} rounded-lg`}>
                            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
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
                    <div className="text-center space-y-3">
                        <div className={`mx-auto w-16 h-16 ${config.iconBgColor} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
                        </div>

                        <div>
                            <p className="text-[var(--white)] font-medium text-base mb-2">
                                {message}
                            </p>

                            {details && (
                                <div className="bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg p-3">
                                    {details}
                                </div>
                            )}
                        </div>
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
                            variant={config.buttonVariant}
                            className="flex items-center gap-2 w-full justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <IconComponent className="w-4 h-4" />
                                    {confirmText}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmActionModal;
