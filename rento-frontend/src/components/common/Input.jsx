import { useState } from 'react';
import { Eye, EyeOff, X, Check } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  success = false,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  helperText,
  clearable = false,
  variant = 'default',
  size = 'md',
  maxLength,
  rows = 3,
  showPasswordToggle = true,
  onClear,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isTextarea = type === 'textarea';
  const isCounted = type === 'textarea' && maxLength;

  const variantStyles = {
    default: 'bg-white border',
    filled: 'bg-gray-100 border-0',
    outlined: 'bg-transparent border',
  };

  const borderColor = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
    : success
    ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const inputClasses = `
    w-full ${sizeStyles[size]} ${variantStyles[variant]} rounded-lg text-gray-900 dark:bg-neutral-700 dark:text-white
    ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${(type === 'password' || clearable || success) && iconPosition === 'right' ? 'pr-11' : ''}
    ${borderColor}
    focus:outline-none focus:ring-2
    disabled:opacity-60 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange?.({ target: { value: '', name } });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={inputClasses}
            {...props}
          />
        )}
        
        {/* Right side icons */}
        {(type === 'password' || clearable || success || Icon && iconPosition === 'right') && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {success && !error && (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
            
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {type === 'password' && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}

            {Icon && iconPosition === 'right' && !type === 'password' && (
              <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}
          </div>
        )}
      </div>
      
      {isCounted && maxLength && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 text-right">
          {value?.length || 0} / {maxLength}
        </p>
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;