// src/components/Common/FullPageSpinner.tsx
import React from 'react';

export const FullPageSpinner: React.FC = () => (
  <div
    className="
      fixed inset-0
      bg-white bg-opacity-80
      flex items-center justify-center
      z-50
    "
  >
    <div
      className="
        animate-spin
        rounded-full
        h-16 w-16
        border-t-4
        border-green-600
      "
    />
  </div>
);
