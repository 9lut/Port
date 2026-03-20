'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ConfirmModalType = 'warning' | 'success' | 'info' | 'danger';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmModalType;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  // Configs based on modal type
  const config = {
    warning: {
      icon: <ExclamationTriangleIcon className="w-10 h-10 text-amber-500" />,
      iconBg: 'bg-amber-100',
      confirmColor: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
    },
    danger: {
      icon: <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />,
      iconBg: 'bg-red-100',
      confirmColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    success: {
      icon: <CheckCircleIcon className="w-10 h-10 text-green-500" />,
      iconBg: 'bg-green-100',
      confirmColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    info: {
      icon: <InformationCircleIcon className="w-10 h-10 text-blue-500" />,
      iconBg: 'bg-blue-100',
      confirmColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-md"
            onClick={isLoading ? undefined : onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden text-center"
            >
              <div className="p-6 md:p-8">
                {/* Icon Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                  className={`mx-auto w-20 h-20 rounded-full ${config.iconBg} flex items-center justify-center mb-6`}
                >
                  {config.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-anuphan">
                  {title}
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm md:text-base">
                  {message}
                </p>
              </div>

              <div className="bg-gray-50/50 px-6 py-4 md:px-8 md:py-6 border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`w-full sm:flex-1 py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${config.confirmColor} disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:flex-1 py-2.5 px-4 inline-flex justify-center items-center rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 disabled:opacity-50 text-sm md:text-base bg-white"
                >
                  {cancelText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
