import React, { useState, forwardRef } from 'react';
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react';

// Función simple para combinar clases (reemplaza cn)
function classNames(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Flag para asegurar que los estilos de autocompletado solo se agreguen una vez
let autofillStylesAdded = false;

// Función para agregar estilos globales de autocompletado
function addAutofillStyles() {
    if (autofillStylesAdded) return;
    
    const style = document.createElement('style');
    style.id = 'input-autofill-styles';
    style.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-text-fill-color: #fafafa !important;
            transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s, -webkit-text-fill-color 5000s ease-in-out 0s;
        }
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
            -webkit-text-fill-color: #fafafa !important;
            transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s, -webkit-text-fill-color 5000s ease-in-out 0s;
        }
        input::placeholder,
        textarea::placeholder {
            color: #555555 !important;
            -webkit-text-fill-color: #555555 !important;
            opacity: 1 !important;
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
            color: #555555 !important;
            -webkit-text-fill-color: #555555 !important;
            opacity: 1 !important;
        }
        input::-moz-placeholder,
        textarea::-moz-placeholder {
            color: #555555 !important;
            opacity: 1 !important;
        }
        input:-ms-input-placeholder,
        textarea:-ms-input-placeholder {
            color: #555555 !important;
            opacity: 1 !important;
        }
        input:not(:placeholder-shown) {
            -webkit-text-fill-color: #fafafa !important;
        }
        input:placeholder-shown {
            -webkit-text-fill-color: #555555 !important;
        }
    `;
    document.head.appendChild(style);
    autofillStylesAdded = true;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    icon,
    fullWidth = true,
    className,
    type,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    // Agregar estilos globales para autocompletado (solo una vez)
    React.useEffect(() => {
        addAutofillStyles();
    }, []);
    const baseClasses = `
    px-4 
    py-2.5 
    border 
    border-[#2D2F30] 
    rounded-[20px]
    bg-[#1A1A1A] 
    text-[#fafafa] 
    placeholder-[#555555] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[var(--color-primary)] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    [&:-webkit-autofill]:bg-[#1A1A1A]
    [&:-webkit-autofill]:text-[#fafafa]
    [&:-webkit-autofill]:border-[#2D2F30]
    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:hover]:bg-[#1A1A1A]
    [&:-webkit-autofill:hover]:text-[#fafafa]
    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:bg-[#1A1A1A]
    [&:-webkit-autofill:focus]:text-[#fafafa]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:border-transparent
    [&:-webkit-autofill:focus]:ring-2
    [&:-webkit-autofill:focus]:ring-[var(--color-primary)]
    [&:-webkit-autofill]:transition-[background-color,color,-webkit-text-fill-color]
    [&:-webkit-autofill]:duration-[5000s]
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const iconClasses = icon ? 'pl-12' : '';
    const passwordClasses = isPassword ? 'pr-12' : '';
    const errorClasses = error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : '';

    return (
        <div className={classNames('flex flex-col gap-1', fullWidth ? 'w-full' : '')}>
            {label && (
                <label className="text-sm font-medium text-[#fafafa] mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-100)]">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={classNames(
                        baseClasses,
                        widthClasses,
                        iconClasses,
                        passwordClasses,
                        errorClasses,
                        className
                    )}
                    style={{
                        color: '#fafafa',
                        ...props.style,
                    } as React.CSSProperties}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-100)] hover:text-[var(--color-primary)] transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs text-[var(--color-danger)] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// ==================== TEXTAREA COMPONENT ====================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    fullWidth = true,
    className,
    ...props
}) => {
    const baseClasses = `
    px-4 
    py-2.5 
    border 
    border-[#2D2F30] 
    rounded-lg 
    bg-[#1A1A1A] 
    text-[#fafafa] 
    placeholder-[#555555] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[var(--color-primary)] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    resize-vertical
    min-h-[100px]
    [&:-webkit-autofill]:bg-[#1A1A1A]
    [&:-webkit-autofill]:text-[#fafafa]
    [&:-webkit-autofill]:border-[#2D2F30]
    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:hover]:bg-[#1A1A1A]
    [&:-webkit-autofill:hover]:text-[#fafafa]
    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:bg-[#1A1A1A]
    [&:-webkit-autofill:focus]:text-[#fafafa]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:border-transparent
    [&:-webkit-autofill:focus]:ring-2
    [&:-webkit-autofill:focus]:ring-[var(--color-primary)]
    [&:-webkit-autofill]:transition-[background-color,color,-webkit-text-fill-color]
    [&:-webkit-autofill]:duration-[5000s]
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : '';

    return (
        <div className={classNames('flex flex-col gap-1', fullWidth ? 'w-full' : '')}>
            {label && (
                <label className="text-sm font-medium text-[#fafafa] mb-1 text-start">
                    {label}
                </label>
            )}
            <textarea
                className={classNames(
                    baseClasses,
                    widthClasses,
                    errorClasses,
                    className
                )}
                style={{
                    color: '#fafafa',
                    ...props.style,
                } as React.CSSProperties}
                {...props}
            />
            {error && (
                <span className="text-xs text-[var(--color-danger)] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};

// ==================== DATE INPUT COMPONENT ====================
interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
    label,
    error,
    fullWidth = true,
    className,
    ...props
}) => {
    const baseClasses = `
    px-4 
    py-2.5 
    pr-10
    border 
    border-[#2D2F30] 
    rounded-[20px]
    bg-[#1A1A1A] 
    text-[#fafafa] 
    placeholder-[#555555] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[var(--color-primary)] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    [&::-webkit-calendar-picker-indicator]:hidden
    [&::-webkit-inner-spin-button]:hidden
    [&::-webkit-outer-spin-button]:hidden
    [&:-webkit-autofill]:bg-[#1A1A1A]
    [&:-webkit-autofill]:text-[#fafafa]
    [&:-webkit-autofill]:border-[#2D2F30]
    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:hover]:bg-[#1A1A1A]
    [&:-webkit-autofill:hover]:text-[#fafafa]
    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:bg-[#1A1A1A]
    [&:-webkit-autofill:focus]:text-[#fafafa]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:border-transparent
    [&:-webkit-autofill:focus]:ring-2
    [&:-webkit-autofill:focus]:ring-[var(--color-primary)]
    [&:-webkit-autofill]:transition-[background-color,color,-webkit-text-fill-color]
    [&:-webkit-autofill]:duration-[5000s]
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : '';

    return (
        <div className={classNames('flex flex-col gap-1', fullWidth ? 'w-full' : '')}>
            {label && (
                <label className="text-sm font-medium text-[#fafafa] mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="date"
                    className={classNames(
                        baseClasses,
                        widthClasses,
                        errorClasses,
                        className
                    )}
                    style={{
                        color: '#fafafa',
                        ...props.style,
                    } as React.CSSProperties}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => {
                        const input = document.querySelector(`input[type="date"][value="${props.value || ''}"]`) as HTMLInputElement;
                        if (input) {
                            input.showPicker?.();
                        }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-auto z-10 cursor-pointer hover:opacity-80 transition-opacity"
                    tabIndex={-1}
                >
                    <Calendar className="w-4 h-4 text-[#fafafa]" />
                </button>
            </div>
            {error && (
                <span className="text-xs text-[var(--color-danger)] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};

// ==================== TIME INPUT COMPONENT ====================
interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
    label,
    error,
    fullWidth = true,
    className,
    ...props
}) => {
    const baseClasses = `
    px-4 
    py-2.5 
    pr-10
    border 
    border-[#2D2F30] 
    rounded-[20px]
    bg-[#1A1A1A] 
    text-[#fafafa] 
    placeholder-[#555555] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[var(--color-primary)] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    [&::-webkit-calendar-picker-indicator]:opacity-0
    [&::-webkit-calendar-picker-indicator]:absolute
    [&::-webkit-calendar-picker-indicator]:w-full
    [&::-webkit-calendar-picker-indicator]:h-full
    [&::-webkit-calendar-picker-indicator]:left-0
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&:-webkit-autofill]:bg-[#1A1A1A]
    [&:-webkit-autofill]:text-[#fafafa]
    [&:-webkit-autofill]:border-[#2D2F30]
    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:hover]:bg-[#1A1A1A]
    [&:-webkit-autofill:hover]:text-[#fafafa]
    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:bg-[#1A1A1A]
    [&:-webkit-autofill:focus]:text-[#fafafa]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_#1A1A1A]
    [&:-webkit-autofill:focus]:border-transparent
    [&:-webkit-autofill:focus]:ring-2
    [&:-webkit-autofill:focus]:ring-[var(--color-primary)]
    [&:-webkit-autofill]:transition-[background-color,color,-webkit-text-fill-color]
    [&:-webkit-autofill]:duration-[5000s]
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : '';

    return (
        <div className={classNames('flex flex-col gap-1', fullWidth ? 'w-full' : '')}>
            {label && (
                <label className="text-sm font-medium text-[#fafafa] mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="time"
                    className={classNames(
                        baseClasses,
                        widthClasses,
                        errorClasses,
                        className
                    )}
                    style={{
                        color: '#fafafa',
                        ...props.style,
                    } as React.CSSProperties}
                    {...props}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Clock className="w-4 h-4 text-[#fafafa]" />
                </div>
            </div>
            {error && (
                <span className="text-xs text-[var(--color-danger)] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};