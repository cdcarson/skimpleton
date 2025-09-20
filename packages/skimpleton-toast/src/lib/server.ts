// Server-only exports

// Flash message utilities
export { ToastFlashMessageService } from './toast.server.js';

// Re-export types that might be needed on the server
export type {
  ToastMessageData,
  ToastFlashMessageConfig,
  ToastFlashMessageGetterSetter
} from './toast.shared.js';
