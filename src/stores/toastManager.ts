import { Toast } from '@base-ui/react/toast';

// A single global ToastManager that can be imported by any island
// to dispatch toasts without needing React Context or Prop Drilling.
export const toastManager = Toast.createToastManager();
