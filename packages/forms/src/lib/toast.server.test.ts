import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastFlashMessageService } from './toast.server.js';
import type {
  ToastMessageData,
  ToastFlashMessageConfig
} from './toast.shared.js';
import type { RequestEvent } from '@sveltejs/kit';

type MockRequestEvent = RequestEvent & {
  cookies: {
    set: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    getAll: ReturnType<typeof vi.fn>;
    serialize: ReturnType<typeof vi.fn>;
  };
};

// Interface for accessing private static properties in tests
interface TestableToastFlashMessageService {
  _instance: ToastFlashMessageService | undefined;
  _config: Required<ToastFlashMessageConfig>;
  get(): ToastFlashMessageService;
  configure(config: ToastFlashMessageConfig): void;
}

// Mock RequestEvent with cookies
const createMockRequestEvent = (): MockRequestEvent => {
  const cookieStore = new Map<string, string>();
  const mockCookies = {
    set: vi.fn((name: string, value: string) => {
      cookieStore.set(name, value);
    }),
    get: vi.fn((name: string) => {
      return cookieStore.get(name);
    }),
    delete: vi.fn((name: string) => {
      cookieStore.delete(name);
    }),
    getAll: vi.fn(() => []),
    serialize: vi.fn()
  };

  return {
    cookies: mockCookies,
    fetch: vi.fn(),
    getClientAddress: vi.fn(),
    locals: {},
    params: {},
    platform: undefined,
    request: {} as Request,
    route: { id: null },
    setHeaders: vi.fn(),
    url: new URL('http://localhost'),
    isDataRequest: false,
    isSubRequest: false,
    isRemoteRequest: false
  } as unknown as MockRequestEvent;
};

describe('ToastFlashMessageService', () => {
  let mockEvent: MockRequestEvent;

  beforeEach(() => {
    mockEvent = createMockRequestEvent();
    // Reset the singleton instance and config
    const testableService =
      ToastFlashMessageService as unknown as TestableToastFlashMessageService;
    testableService._instance = undefined;
    testableService._config = {
      cookieName: 'skimpleton-toast-flash-message',
      cookieOptions: {
        path: '/',
        maxAge: 60 * 5,
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      }
    };
    vi.clearAllMocks();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ToastFlashMessageService.get();
      const instance2 = ToastFlashMessageService.get();
      expect(instance1).toBe(instance2);
    });

    it('should create instance on first call', () => {
      const testableService =
        ToastFlashMessageService as unknown as TestableToastFlashMessageService;
      expect(testableService._instance).toBeUndefined();
      const instance = ToastFlashMessageService.get();
      expect(instance).toBeInstanceOf(ToastFlashMessageService);
      expect(testableService._instance).toBe(instance);
    });
  });

  describe('configure', () => {
    it('should update config with provided values', () => {
      ToastFlashMessageService.configure({
        cookieName: 'custom-cookie',
        cookieOptions: {
          path: '/custom',
          maxAge: 120,
          httpOnly: false,
          secure: false,
          sameSite: 'strict'
        }
      });

      const testableService =
        ToastFlashMessageService as unknown as TestableToastFlashMessageService;
      const config = testableService._config;
      expect(config.cookieName).toBe('custom-cookie');
      expect(config.cookieOptions.path).toBe('/custom');
      expect(config.cookieOptions.maxAge).toBe(120);
      expect(config.cookieOptions.httpOnly).toBe(false);
      expect(config.cookieOptions.secure).toBe(false);
      expect(config.cookieOptions.sameSite).toBe('strict');
    });

    it('should merge config with defaults', () => {
      ToastFlashMessageService.configure({
        cookieName: 'partial-config'
      });

      const testableService =
        ToastFlashMessageService as unknown as TestableToastFlashMessageService;
      const config = testableService._config;
      expect(config.cookieName).toBe('partial-config');
      expect(config.cookieOptions.path).toBe('/');
      expect(config.cookieOptions.maxAge).toBe(300);
    });
  });

  describe('setFlashMessage', () => {
    it('should set cookie with serialized message', () => {
      const service = ToastFlashMessageService.get();
      const message: ToastMessageData = {
        type: 'success',
        message: 'Test success message'
      };

      service.setFlashMessage(mockEvent, message);

      expect(mockEvent.cookies.set).toHaveBeenCalledWith(
        'skimpleton-toast-flash-message',
        JSON.stringify(message),
        {
          path: '/',
          maxAge: 300,
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        }
      );
    });

    it('should use custom cookie name from config', () => {
      ToastFlashMessageService.configure({
        cookieName: 'custom-flash'
      });
      const service = ToastFlashMessageService.get();
      const message: ToastMessageData = {
        type: 'error',
        message: 'Test error'
      };

      service.setFlashMessage(mockEvent, message);

      expect(mockEvent.cookies.set).toHaveBeenCalledWith(
        'custom-flash',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should handle different message types', () => {
      const service = ToastFlashMessageService.get();
      const messages: ToastMessageData[] = [
        { type: 'success', message: 'Success!' },
        { type: 'error', message: 'Error!' },
        { type: 'wait', message: 'Please wait...' }
      ];

      messages.forEach((message) => {
        service.setFlashMessage(mockEvent, message);
        expect(mockEvent.cookies.set).toHaveBeenCalledWith(
          expect.any(String),
          JSON.stringify(message),
          expect.any(Object)
        );
      });
    });
  });

  describe('getFlashMessage', () => {
    it('should return null when no cookie exists', () => {
      const service = ToastFlashMessageService.get();
      mockEvent.cookies.get.mockReturnValue(undefined);

      const result = service.getFlashMessage(mockEvent);

      expect(result).toBeNull();
      expect(mockEvent.cookies.get).toHaveBeenCalledWith(
        'skimpleton-toast-flash-message'
      );
      expect(mockEvent.cookies.delete).not.toHaveBeenCalled();
    });

    it('should parse and return valid message from cookie', () => {
      const service = ToastFlashMessageService.get();
      const message: ToastMessageData = {
        type: 'success',
        message: 'Valid message'
      };
      mockEvent.cookies.get.mockReturnValue(JSON.stringify(message));

      const result = service.getFlashMessage(mockEvent);

      expect(result).toEqual(message);
      expect(mockEvent.cookies.get).toHaveBeenCalledWith(
        'skimpleton-toast-flash-message'
      );
    });

    it('should delete cookie after reading', () => {
      const service = ToastFlashMessageService.get();
      const message: ToastMessageData = {
        type: 'error',
        message: 'Error to clear'
      };
      mockEvent.cookies.get.mockReturnValue(JSON.stringify(message));

      service.getFlashMessage(mockEvent);

      expect(mockEvent.cookies.delete).toHaveBeenCalledWith(
        'skimpleton-toast-flash-message',
        {
          path: '/',
          maxAge: 300,
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        }
      );
    });

    it('should use custom cookie name from config', () => {
      ToastFlashMessageService.configure({
        cookieName: 'custom-name'
      });
      const service = ToastFlashMessageService.get();
      mockEvent.cookies.get.mockReturnValue(undefined);

      service.getFlashMessage(mockEvent);

      expect(mockEvent.cookies.get).toHaveBeenCalledWith('custom-name');
    });

    it('should validate parsed message', () => {
      const service = ToastFlashMessageService.get();
      const invalidData = { type: 'invalid', message: 'Test' };
      mockEvent.cookies.get.mockReturnValue(JSON.stringify(invalidData));

      const result = service.getFlashMessage(mockEvent);

      expect(result).toBeNull();
      expect(mockEvent.cookies.delete).toHaveBeenCalled();
    });

    it('should handle malformed JSON gracefully', () => {
      const service = ToastFlashMessageService.get();
      mockEvent.cookies.get.mockReturnValue('not-json');

      expect(() => service.getFlashMessage(mockEvent)).toThrow();
    });

    it('should delete cookie even when validation fails', () => {
      const service = ToastFlashMessageService.get();
      const invalidData = { notType: 'something' };
      mockEvent.cookies.get.mockReturnValue(JSON.stringify(invalidData));

      service.getFlashMessage(mockEvent);

      expect(mockEvent.cookies.delete).toHaveBeenCalledWith(
        'skimpleton-toast-flash-message',
        expect.any(Object)
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle full set and get cycle', () => {
      const service = ToastFlashMessageService.get();
      const message: ToastMessageData = {
        type: 'success',
        message: 'Full cycle test'
      };

      // Set message
      service.setFlashMessage(mockEvent, message);
      expect(mockEvent.cookies.set).toHaveBeenCalled();

      // Configure get to return the set value
      mockEvent.cookies.get.mockReturnValue(JSON.stringify(message));

      // Get message
      const retrieved = service.getFlashMessage(mockEvent);
      expect(retrieved).toEqual(message);
      expect(mockEvent.cookies.delete).toHaveBeenCalled();
    });

    it('should handle multiple messages sequentially', () => {
      const service = ToastFlashMessageService.get();
      const messages: ToastMessageData[] = [
        { type: 'success', message: 'First' },
        { type: 'error', message: 'Second' },
        { type: 'wait', message: 'Third' }
      ];

      messages.forEach((message, index) => {
        service.setFlashMessage(mockEvent, message);
        expect(mockEvent.cookies.set).toHaveBeenCalledTimes(index + 1);
      });
    });
  });
});
