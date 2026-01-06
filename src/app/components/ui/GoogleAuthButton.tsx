import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BsGoogle } from 'react-icons/bs';

interface GoogleAuthButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isPending?: boolean;
    isEmailExpanded?: boolean;
    label?: string;
}

export const GoogleAuthButton = ({
    onClick,
    disabled = false,
    isPending = false,
    isEmailExpanded = false,
    label = 'Ingresá con Google',
}: GoogleAuthButtonProps) => {
    return (
        <motion.button
            layout
            type="button"
            onClick={onClick}
            disabled={disabled || isPending}
            animate={{
                height: isEmailExpanded ? 80 : 180,
                paddingTop: isEmailExpanded ? 12 : 32,
                paddingBottom: isEmailExpanded ? 12 : 32,
                opacity: isEmailExpanded ? 0.5 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={!isEmailExpanded ? { scale: 1.02 } : {}}
            whileTap={!isEmailExpanded ? { scale: 0.98 } : {}}
            className={`
                relative group overflow-hidden 
                flex flex-col items-center justify-center gap-3 px-6
                bg-[var(--gray-400)] rounded-2xl 
                border transition-colors
                ${isPending
                    ? 'border-[var(--color-primary)] opacity-80 cursor-wait'
                    : 'border-[var(--gray-300)] hover:border-[var(--color-primary)] cursor-pointer text-white'}
                shadow-lg shadow-black/20
            `}
        >
            {isPending ? (
                <Loader2 className="animate-spin text-[var(--color-primary)] w-8 h-8" />
            ) : (
                <>
                    <div className="p-3 bg-white/5 rounded-full border border-white/5 shadow-inner">
                        <BsGoogle size={28} className="text-white" />
                    </div>
                    {!isEmailExpanded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-base font-medium text-white"
                        >
                            {label}
                        </motion.span>
                    )}
                </>
            )}
        </motion.button>
    );
};

