import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  rounded = 'lg',
  className = '',
  ariaLabel,
}) => {
  const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 focus:ring-primary-300 shadow-md',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:scale-98 focus:ring-primary-300',
    ghost: 'text-primary-600 hover:bg-primary-50 active:scale-98 focus:ring-primary-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 focus:ring-red-300 shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 focus:ring-green-300 shadow-md',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const roundedStyles = {
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const content = loading ? (
    <>
      <Loader2 className={`${iconSize[size]} animate-spin`} />
      {children && <span>{children}</span>}
    </>
  ) : (
    <>
      {Icon && iconPosition === 'left' && <Icon className={iconSize[size]} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className={iconSize[size]} />}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {content}
    </button>
  );
};

export default Button;