import * as React from 'react';
import { Toast } from '@base-ui/react/toast';
import { toastManager } from '../../../stores/toastManager';

export default function GlobalToastContainer() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full sm:w-auto min-w-[320px] max-w-[calc(100vw-32px)] z-9999 outline-none flex flex-col gap-3 pointer-events-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(100%) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        .animate-toast-slide-in {
          animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-toast-fade-out {
          animation: toastFadeOut 0.2s ease-in forwards;
        }
        
        .base-toast-root {
          /* Stacking layout */
          z-index: calc(1000 - var(--toast-index, 0));
          transform-origin: bottom center;
          /* Smoothly animate when indices change */
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        
        /* When there are multiple toasts, we stack them visually */
        .base-toast-root:not([data-expanded]) {
          transform: scale(calc(1 - 0.05 * var(--toast-index, 0))) translateY(calc(var(--toast-index, 0) * -16px));
        }

        /* Fade out toasts that are deep in the stack to reduce clutter */
        .base-toast-root:not([data-expanded]) .base-toast-content {
          opacity: calc(1 - 0.2 * var(--toast-index, 0));
        }
      `}</style>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <>
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.updateKey || toast.id}
          toast={toast}
          className="base-toast-root pointer-events-auto bg-white border border-black shadow-[4px_4px_0_#e5e7eb] p-4 flex gap-4 items-center justify-between w-full min-w-[300px] data-[state=open]:animate-toast-slide-in data-[state=closed]:animate-toast-fade-out"
        >
          {/* Text Content */}
          <Toast.Content className="base-toast-content flex-1 flex flex-col transition-opacity">
            <Toast.Title className="text-base font-bold text-black">
              {toast.title}
            </Toast.Title>
            {toast.description && (
              <Toast.Description className="text-base text-black mt-1">
                {toast.description}
              </Toast.Description>
            )}
          </Toast.Content>

          {/* Close Button */}
          <Toast.Close className="shrink-0 border border-black bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
            Dismiss
          </Toast.Close>
        </Toast.Root>
      ))}
    </>
  );
}
