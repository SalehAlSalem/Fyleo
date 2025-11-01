/**
 * Toast Notification Component
 * 
 * A reusable, animated toast notification component with auto-dismiss functionality.
 * Supports multiple types: success, error, info, warning
 * 
 * @component
 * @example
 * ```tsx
 * <Toast
 *   id="toast-1"
 *   type="success"
 *   title="Success!"
 *   message="Your action was completed successfully."
 *   onDismiss={(id) => removeToast(id)}
 * />
 * ```
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/**
 * Toast Props Interface
 */
interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Type of notification - determines color and icon */
  type: 'success' | 'error' | 'info' | 'warning';
  /** Main title text */
  title: string;
  /** Optional detailed message */
  message?: string;
  /** Callback function to dismiss the toast */
  onDismiss: (id: string) => void;
  /** Optional duration in milliseconds (default: 5000) */
  duration?: number;
}

/**
 * Configuration for each toast type
 */
const toastConfig = {
  success: {
    icon: '✅',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-500',
    textColor: 'text-green-800 dark:text-green-200',
    iconBg: 'bg-green-100 dark:bg-green-800',
  },
  error: {
    icon: '❌',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-500',
    textColor: 'text-red-800 dark:text-red-200',
    iconBg: 'bg-red-100 dark:bg-red-800',
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800 dark:text-blue-200',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800 dark:text-amber-200',
    iconBg: 'bg-amber-100 dark:bg-amber-800',
  },
};

/**
 * Framer Motion animation variants
 */
const toastVariants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Toast Component
 */
const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onDismiss,
  duration = 5000,
}) => {
  const config = toastConfig[type];

  /**
   * Auto-dismiss effect
   * Automatically calls onDismiss after the specified duration
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  /**
   * Manual dismiss handler
   */
  const handleDismiss = () => {
    onDismiss(id);
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={`
        relative w-full max-w-sm rounded-lg shadow-md p-4 
        border-l-4 ${config.borderColor} ${config.bgColor}
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-full 
            ${config.iconBg} 
            flex items-center justify-center text-xl
          `}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className={`font-semibold text-sm ${config.textColor} mb-1`}>
            {title}
          </h4>

          {/* Message (optional) */}
          {message && (
            <p className={`text-xs ${config.textColor} opacity-90`}>
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full 
            hover:bg-gray-200 dark:hover:bg-gray-700 
            flex items-center justify-center
            transition-colors duration-200
            ${config.textColor}
          `}
          aria-label="Dismiss notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar (optional visual indicator) */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${config.borderColor.replace('border', 'bg')} rounded-bl-lg`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default Toast;
