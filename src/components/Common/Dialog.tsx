import React, { FC, ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export const Dialog: FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      <div
        className="relative z-10 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent: FC<DialogContentProps> = ({ children, className = '' }) => (
  <div
    className={`w-full w-[80vw] h-[85vh] bg-white rounded-lg shadow-lg overflow-auto ${className}`}
  >
    {children}
  </div>
);

export const DialogHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="px-6 pt-6 pb-2 border-b border-gray-200">
    {children}
  </div>
);

export const DialogTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

export const DialogFooter: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
    {children}
  </div>
);
