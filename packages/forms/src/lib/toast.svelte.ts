import { browser, dev } from '$app/environment';
import type {
  ToastMessageData,
  ToastMessageConfig,
  ToastMessageService
} from './toast.shared.js';

/**
 * Client-side app message service using Svelte runes for reactive state management.
 *
 * Provides:
 * - Current message state for displaying active notifications
 * - History of recent messages (configurable, default 20) for providing an aria-live region for screen readers, separate from displaying the message to sighted users
 * - Methods to add success, error, and wait messages
 * - Singleton pattern with SSR-safe instantiation
 * - Configurable message history limit
 *
 * Usage:
 * ```ts
 * // Basic usage
 * const msg = AppMessageService.get();
 * msg.wait('Please wait...');
 * msg.success('Operation completed');
 * msg.error('Something went wrong');
 * msg.setMessage({ type: 'success', message: 'Custom message' });
 * msg.clear(); // Clear current message
 *
 * // With custom configuration
 * AppMessageService.configure({ maxRecentMessages: 50 });
 * const msg = AppMessageService.get();
 * ```
 */
export class ToastService implements ToastMessageService {
  private static _instance: ToastService | undefined;
  private static _config: ToastMessageConfig = {
    maxRecentMessages: 20,
    successTimeout: 5000,
    errorTimeout: 8000
  };

  private _current = $state<ToastMessageData | undefined>(undefined);
  private _mostRecent = $state<ToastMessageData[]>([]);
  private _currentTimeout: ReturnType<typeof setTimeout> | undefined;

  private constructor() {}

  /**
   * Configure the AppMessageService with custom options.
   * Must be called before the first call to get() to take effect.
   */
  static configure(config: ToastMessageConfig): void {
    ToastService._config = {
      ...ToastService._config,
      ...config
    };
  }

  static get(): ToastService {
    if (!browser) {
      // Always return a clean instance during SSR
      return new ToastService();
    }

    if (!ToastService._instance) {
      ToastService._instance = new ToastService();
    }
    return ToastService._instance;
  }

  get current(): ToastMessageData | undefined {
    return this._current;
  }

  get mostRecent(): ToastMessageData[] {
    return this._mostRecent;
  }

  success(message: string): void {
    this.setMessage({ type: 'success', message });
  }

  error(message: string): void {
    this.setMessage({ type: 'error', message });
  }

  wait(message: string): void {
    this.setMessage({ type: 'wait', message });
  }

  setMessage(appMessage: ToastMessageData): void {
    this._addMessage(appMessage);
  }

  clear(): void {
    // Clear any existing timeout
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = undefined;
    }
    this._current = undefined;
  }

  private _addMessage(appMessage: ToastMessageData): void {
    if (!browser) {
      // Prevent messages from being added during SSR
      if (dev) {
        console.warn(
          'AppMessageService: Attempted to add message during SSR:',
          appMessage
        );
      }
      return;
    }

    // Clear any existing timeout
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = undefined;
    }

    this._current = appMessage;

    // Only add success and error messages to mostRecent, not wait messages
    if (appMessage.type !== 'wait') {
      this._mostRecent.unshift(appMessage);

      const maxMessages = ToastService._config.maxRecentMessages ?? 20;
      if (this._mostRecent.length > maxMessages) {
        this._mostRecent.splice(maxMessages);
      }
    }

    // Set timeout for success and error messages only
    if (appMessage.type === 'success' || appMessage.type === 'error') {
      const timeoutDuration =
        appMessage.type === 'success'
          ? (ToastService._config.successTimeout ?? 5000)
          : (ToastService._config.errorTimeout ?? 8000);

      this._currentTimeout = setTimeout(() => {
        this._current = undefined;
        this._currentTimeout = undefined;
      }, timeoutDuration);
    }
  }
}
