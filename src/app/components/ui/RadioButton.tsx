'use client';

import clsx from 'clsx';

interface RadioButtonProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    label: string;
    disabled?: boolean;
}

export default function RadioButton({
    name,
    value,
    checked,
    onChange,
    label,
    disabled = false
}: RadioButtonProps) {
    return (
        <label
            className={clsx(
                'flex items-center cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
        >
            <div className="relative flex items-center">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={clsx(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                        checked
                            ? 'border-[var(--green)] bg-[var(--green)]'
                            : 'border-[var(--gray-300)] bg-transparent',
                        !disabled && 'hover:border-[var(--green)]'
                    )}
                    onClick={!disabled ? onChange : undefined}
                >
                    {checked && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                </div>
            </div>
            <span className="ml-2 text-sm text-[var(--white)]">{label}</span>
        </label>
    );
}

