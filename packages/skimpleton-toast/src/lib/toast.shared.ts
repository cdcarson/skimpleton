import type { RequestEvent } from '@sveltejs/kit';
import type { SerializeOptions } from 'cookie';
export type ToastMessageData = {
  type: 'success' | 'error' | 'wait';
  message: string;
};

export type ToastMessageService = {
  readonly current: ToastMessageData | undefined;
  readonly mostRecent: ToastMessageData[];
  error: (message: string) => void;
  success: (message: string) => void;
  wait: (message: string) => void;
  clear: () => void;
};

export const validateToastMessage = (
  data: unknown
): ToastMessageData | null => {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const obj = data as Record<string, unknown>;

  if (
    typeof obj.type !== 'string' ||
    !['success', 'error', 'wait'].includes(obj.type)
  ) {
    return null;
  }

  if (typeof obj.message !== 'string') {
    return null;
  }

  return {
    type: obj.type as 'success' | 'error' | 'wait',
    message: obj.message
  };
};

export type ToastMessageConfig = {
  /**
   * Maximum number of messages to keep in the mostRecent history.
   * @default 20
   */
  maxRecentMessages?: number;
  /**
   * Time in milliseconds before success messages are automatically cleared.
   * @default 5000
   */
  successTimeout?: number;
  /**
   * Time in milliseconds before error messages are automatically cleared.
   * @default 8000
   */
  errorTimeout?: number;
};

export type ToastFlashMessageConfig = {
  cookieOptions?: SerializeOptions & { path: string };
  cookieName?: string;
};

export type ToastFlashMessageGetterSetter = {
  setFlashMessage: (event: RequestEvent, message: ToastMessageData) => void;
  getFlashMessage: (event: RequestEvent) => ToastMessageData | null;
};
