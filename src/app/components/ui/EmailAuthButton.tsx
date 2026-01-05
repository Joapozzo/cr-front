import { motion } from 'framer-motion';
import { MdEmail } from 'react-icons/md';

interface EmailAuthButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isEmailExpanded?: boolean;
    label?: string;
}

export const EmailAuthButton = ({
    onClick,
    disabled = false,
    isEmailExpanded = false,
    label = 'Ingresá con tu mail',
}: EmailAuthButtonProps) => {
    return (
        <motion.button
            layout
            type="button"
            onClick={onClick}
            disabled={disabled || isEmailExpanded}
            animate={{
                height: isEmailExpanded ? 80 : 180,
                paddingTop: isEmailExpanded ? 12 : 32,
                paddingBottom: isEmailExpanded ? 12 : 32,
                opacity: 1,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={!isEmailExpanded ? { scale: 1.02 } : {}}
            whileTap={!isEmailExpanded ? { scale: 0.98 } : {}}
            className={`
                relative flex flex-col items-center justify-center gap-3 px-6
                bg-[var(--gray-400)] rounded-2xl 
                border transition-colors
                ${isEmailExpanded
                    ? 'border-[var(--green)] ring-1 ring-[var(--green)]'
                    : 'border-[var(--gray-300)] hover:border-white cursor-pointer'}
                shadow-lg shadow-black/20
            `}
        >
            <div className={`p-3 rounded-full border border-white/5 shadow-inner transition-colors
                ${isEmailExpanded ? 'bg-[var(--green)]/10 text-[var(--green)]' : 'bg-white/5 text-[var(--gray-100)]'}
            `}>
                <MdEmail size={28} />
            </div>
            {!isEmailExpanded && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-base font-medium transition-colors
                        ${isEmailExpanded ? 'text-[var(--green)]' : 'text-[var(--gray-100)]'}
                    `}
                >
                    {label}
                </motion.span>
            )}
        </motion.button>
    );
};

