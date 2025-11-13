import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children, actions }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen && !isClosing) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else if (!isOpen && isVisible) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
            }, 200);
        }
    }, [isOpen, isVisible, isClosing]);

    const handleClose = () => {
        if (isClosing) return; // Evitar múltiples llamadas
        
        setIsClosing(true);
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    if (!isVisible) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4 transition-opacity duration-200 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleOverlayClick}
        >
            <div className={`
                bg-[#1a1a1a] rounded-[20px] shadow-xl border border-[#262626]
                w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col
                transform transition-all duration-200 ease-out
                ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-[#262626] rounded-lg transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-[#737373]" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>

                {actions && (
                    <div className="px-6 pb-6 pt-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaseModal;