import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

type ButtonSizes = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

type ButtonProps = {
  variant?: 'primary' | 'outline' | 'transparent' | 'danger';
  loading?: boolean;
  size?: ButtonSizes;
  className?: string;
  type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>['type'];
  children: ReactNode;
};

const ButtonSize: Record<ButtonSizes, string> = {
  xs: 'px-3 py-1 leading-5 text-sm',
  sm: ' px-3 py-2 leading-5 text-sm',
  base: 'px-4 py-2',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

const ButtonVariants = {
  primary: 'bg-gray-700 text-gray-50 hover:bg-gray-600',
  transparent: 'rhover:bg-gray-100',
  outline: 'border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-gray-100',
  danger: 'bg-red-700 text-red-100 hover:bg-red-600',
};

export function Button({
  children,
  variant = 'primary',
  loading = false,
  size = 'base',
  className,
  ...props
}: ButtonProps) {
  const sizeStyles = ButtonSize[size] || ButtonSize.base;
  const variantStyles = ButtonVariants[variant] || 'primary';

  return (
    <button
      type="button"
      className={clsx(
        'cursor-pointer rounded-md font-normal inline-flex justify-center items-center focus:outline-none',
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
      {loading && (
        <svg className="w-5 h-5 ml-2 fill-current animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z" />
        </svg>
      )}
    </button>
  );
}
