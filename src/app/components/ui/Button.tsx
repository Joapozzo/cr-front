import React from 'react';

function classNames(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'more' | 'footer' | 'success' | 'danger' | 'import' | 'export' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseClasses = `
    min-w-[100px] 
    rounded-[20px] 
    font-semibold 
    text-sm 
    cursor-pointer 
    transition-all 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
    flex items-center justify-center
  `;

  const sizeClasses = {
    sm: 'h-9 px-4 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    default: `
      bg-transparent 
      border 
      border-[#2D2F30] 
      text-[#65656B] 
      hover:bg-[#2D2F30] 
      hover:text-white
    `,
    more: `
      bg-[#2D2F30] 
      border 
      border-[#2D2F30] 
      text-white 
      hover:bg-transparent 
      hover:text-[#65656B]
    `,
    footer: `
      bg-[var(--color-primary)] 
      text-[var(--black)] 
      hover:bg-transparent 
      border
      hover:border-[var(--color-primary)] 
      hover:text-[var(--color-primary)] 
    `,
    success: `
      bg-[var(--color-primary)] 
      border 
      border-[var(--color-primary)] 
      text-white 
      hover:bg-transparent 
      hover:text-[var(--color-primary)] 
    `,
    danger: `
      bg-[var(--color-danger)] 
      border 
      border-[var(--color-danger)] 
      text-white 
      hover:bg-transparent 
      hover:text-[var(--color-danger)]
    `,
    import: `
      bg-[#6366F1] 
      border 
      border-[#6366F1] 
      text-white 
      hover:bg-transparent 
      hover:text-[#6366F1]
    `,
    export: `
      bg-[#A855F7] 
      border 
      border-[#A855F7] 
      text-white 
      hover:bg-transparent 
      hover:text-[#A855F7]
    `,
    ghost: `
      bg-transparent 
      border-none 
      text-inherit 
      hover:bg-transparent 
      hover:text-inherit
    `,
    secondary: `
      bg-transparent 
      text-[var(--color-primary)] 
      border 
      border-[var(--color-primary)] 
      hover:bg-[var(--color-primary)] 
      hover:text-[var(--black)]
    `,

  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={classNames(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        widthClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};