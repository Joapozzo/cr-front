import React, { useState } from 'react';
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react';

// Función simple para combinar clases (reemplaza cn)
function classNames(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    fullWidth = true,
    className,
    type,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const baseClasses = `
    px-4 
    py-2.5 
    border 
    border-[#2D2F30] 
    rounded-[20px]
    bg-[#1A1A1A] 
    text-[#fafafa] 
    placeholder-[#65656B] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#2AD174] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const iconClasses = icon ? 'pl-12' : '';
    const passwordClasses = isPassword ? 'pr-12' : '';
    const errorClasses = error ? 'border-[#EF4444] focus:ring-[#EF4444]' : '';

    return (
        <div className={classNames('flex flex-col gap-1', fullWidth ? 'w-full' : '')}>
            {label && (
                <label className="text-sm font-medium text-[#fafafa] mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#65656B]">
                        {icon}
                    </div>
                )}
                <input
                    type={inputType}
                    className={classNames(
                        baseClasses,
                        widthClasses,
                        iconClasses,
                        passwordClasses,
                        errorClasses,
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#65656B] hover:text-[#2AD174] transition-colors"
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
                <span className="text-xs text-[#EF4444] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};

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
    placeholder-[#65656B] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#2AD174] 
    focus:border-transparent 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    resize-vertical
    min-h-[100px]
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[#EF4444] focus:ring-[#EF4444]' : '';

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
                {...props}
            />
            {error && (
                <span className="text-xs text-[#EF4444] mt-1">
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
    placeholder-[#65656B] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#2AD174] 
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
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[#EF4444] focus:ring-[#EF4444]' : '';

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
                    {...props}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Calendar className="w-4 h-4 text-[#fafafa]" />
                </div>
            </div>
            {error && (
                <span className="text-xs text-[#EF4444] mt-1">
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
    placeholder-[#65656B] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#2AD174] 
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
  `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-[#EF4444] focus:ring-[#EF4444]' : '';

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
                    {...props}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Clock className="w-4 h-4 text-[#fafafa]" />
                </div>
            </div>
            {error && (
                <span className="text-xs text-[#EF4444] mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};