interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Switch = ({
    checked,
    onChange,
    disabled = false,
    size = 'md',
    className = ''
}: SwitchProps) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    container: 'w-10 h-6',
                    thumb: 'w-4 h-4'
                };
            case 'lg':
                return {
                    container: 'w-14 h-8',
                    thumb: 'w-6 h-6'
                };
            default:
                return {
                    container: 'w-12 h-7',
                    thumb: 'w-5 h-5'
                };
        }
    };

    const sizeClasses = getSizeClasses();

    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`
                relative inline-flex ${sizeClasses.container} items-center rounded-full 
                transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 
                focus:ring-[var(--green)] focus:ring-offset-2 focus:ring-offset-[var(--gray-400)]
                ${checked
                    ? 'bg-[var(--green)]'
                    : 'bg-[var(--gray-200)]'
                }
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                }
                ${className}
            `}
        >
            <span
                className={`
                    ${sizeClasses.thumb} bg-white rounded-full shadow-lg transform transition-transform 
                    duration-300 ease-in-out flex items-center justify-center
                    ${checked
                        ? 'translate-x-full'
                        : 'translate-x-0.5'
                    }
                `}
            >
                {/* Indicador visual opcional */}
                <span
                    className={`
                        w-2 h-2 rounded-full transition-colors duration-200
                        ${checked
                            ? 'bg-[var(--green)]'
                            : 'bg-[var(--gray-200)]'
                        }
                    `}
                />
            </span>
        </button>
    );
};

export default Switch;