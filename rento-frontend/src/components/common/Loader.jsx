import { Loader2 } from 'lucide-react';

const Loader = ({ 
  variant = 'spinner',
  size = 'md', 
  color = 'primary-600',
  fullScreen = false,
  message = 'Loading...',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const dotSizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const spinnerVariant = (
    <Loader2 className={`${sizeMap[size]} text-${color} animate-spin`} />
  );

  const dotsVariant = (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSizeMap[size]} bg-${color} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );

  const pulseVariant = (
    <div className={`${sizeMap[size]} bg-${color} rounded-full animate-pulse`} />
  );

  const skeletonVariant = (
    <div className="space-y-3 w-full">
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-lg animate-shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-lg w-5/6 animate-shimmer" style={{ animationDelay: '100ms' }} />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-lg w-4/6 animate-shimmer" style={{ animationDelay: '200ms' }} />
    </div>
  );

  const loaderContent = {
    spinner: spinnerVariant,
    dots: dotsVariant,
    pulse: pulseVariant,
    skeleton: skeletonVariant,
  }[variant];

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-neutral-900 z-50 flex items-center justify-center">
        <div className="text-center">
          {loaderContent}
          {message && variant !== 'skeleton' && (
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-4">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="w-full space-y-3">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
      {loaderContent}
      {message && (
        <p className="text-gray-600 dark:text-gray-300 font-medium mt-4">{message}</p>
      )}
    </div>
  );
};

export default Loader;