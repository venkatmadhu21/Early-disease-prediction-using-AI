import React from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './ui/toast';
import { useToast } from '../hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return createPortal(
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}