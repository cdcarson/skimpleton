import type { RequestEvent } from '@sveltejs/kit';
import type {
  ToastFlashMessageConfig,
  ToastFlashMessageGetterSetter,
  ToastMessageData
} from './toast.shared.js';
import { validateToastMessage } from './toast.shared.js';

export class ToastFlashMessageService implements ToastFlashMessageGetterSetter {
  private static _instance: ToastFlashMessageService | undefined;
  private static _config: Required<ToastFlashMessageConfig> = {
    cookieName: 'skimpleton-toast-flash-message',
    cookieOptions: {
      path: '/',
      maxAge: 60 * 5, // 5 minutes
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    }
  };
  private constructor() {}

  static get(): ToastFlashMessageService {
    if (!ToastFlashMessageService._instance) {
      ToastFlashMessageService._instance = new ToastFlashMessageService();
    }
    return ToastFlashMessageService._instance;
  }

  static configure(config: ToastFlashMessageConfig): void {
    ToastFlashMessageService._config = {
      ...ToastFlashMessageService._config,
      ...config
    };
  }

  setFlashMessage(event: RequestEvent, message: ToastMessageData): void {
    const serialized = JSON.stringify(message);
    event.cookies.set(
      ToastFlashMessageService._config.cookieName,
      serialized,
      ToastFlashMessageService._config.cookieOptions
    );
  }

  getFlashMessage(event: RequestEvent): ToastMessageData | null {
    const serialized = event.cookies.get(
      ToastFlashMessageService._config.cookieName
    );
    if (!serialized) {
      return null;
    }
    // Clear the cookie after reading
    event.cookies.delete(
      ToastFlashMessageService._config.cookieName,
      ToastFlashMessageService._config.cookieOptions
    );

    return validateToastMessage(JSON.parse(serialized));
  }
}
