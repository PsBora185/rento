import { X } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  footer = null,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Focus trap
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector('[data-close-btn]');
        closeBtn?.focus();
      }, 0);
    } else {
      document.body.style.overflow = 'unset';
      previousActiveElement.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (closeOnEsc && e.key === 'Escape') {
      onClose();
    }
    // Tab trapping
    if (e.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;
      
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-screen',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        role="presentation"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={modalRef}
          className={`relative bg-white dark:bg-neutral-800 rounded-xl shadow-2xl ${sizes[size]} w-full animate-scale-in`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                data-close-btn
                className="p-2 ml-4 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;