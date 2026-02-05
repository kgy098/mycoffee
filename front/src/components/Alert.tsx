"use client";

import { useEffect } from "react";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export default function Alert({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  showCancel = false,
}: AlertProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: isOpen ? "rgba(0, 0, 0, 0.50)" : "rgba(0, 0, 0, 0)",
        }}
        onClick={onClose}
      />

      {/* Alert Box - Slide up from bottom */}
      <div
        className={`relative bg-white rounded-t-2xl p-6 w-full max-w-lg shadow-xl transform transition-all duration-300 ease-out ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {title && (
          <h3 className="text-lg font-bold text-gray-0 mb-3 text-center">
            {title}
          </h3>
        )}
        
        <p className="text-sm text-gray-0 mb-6 text-center whitespace-pre-line">
          {message}
        </p>

        {/* Buttons */}
        <div className={`flex gap-2 ${showCancel ? 'flex-row' : 'flex-col'}`}>
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`${showCancel ? 'flex-1' : 'w-full'} py-3 px-4 bg-[#4E2A18] text-white rounded-lg font-bold text-sm hover:bg-[#3d2113] transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
