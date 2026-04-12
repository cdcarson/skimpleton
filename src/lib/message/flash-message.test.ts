import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FlashMessage,
  DEFAULT_FLASH_MESSAGE_SETTINGS,
  type FlashMessageOptions
} from './flash-message.js';
import type { RequestEvent } from '@sveltejs/kit';

function makeMockEvent(cookieValue?: string): RequestEvent {
  return {
    cookies: {
      get: vi.fn().mockReturnValue(cookieValue),
      set: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn().mockReturnValue([]),
      serialize: vi.fn()
    }
  } as unknown as RequestEvent;
}

describe('FlashMessage', () => {
  beforeEach(() => {
    FlashMessage.settings = structuredClone(DEFAULT_FLASH_MESSAGE_SETTINGS);
  });

  describe('static settings', () => {
    it('has correct default settings', () => {
      expect(FlashMessage.settings).toEqual(DEFAULT_FLASH_MESSAGE_SETTINGS);
    });

    it('allows cookieName to be changed', () => {
      FlashMessage.settings.cookieName = 'my-flash';
      expect(FlashMessage.settings.cookieName).toBe('my-flash');
    });

    it('allows cookieOptions to be replaced', () => {
      const custom = {
        path: '/app',
        maxAge: 120,
        httpOnly: false,
        secure: false,
        sameSite: 'strict' as const
      };
      FlashMessage.settings.cookieOptions = custom;
      expect(FlashMessage.settings.cookieOptions).toEqual(custom);
    });

    it('allows entire settings object to be replaced', () => {
      const custom: FlashMessageOptions = {
        cookieName: 'custom-flash',
        cookieOptions: {
          path: '/custom',
          maxAge: 30,
          httpOnly: false,
          secure: false,
          sameSite: 'none'
        }
      };
      FlashMessage.settings = custom;
      expect(FlashMessage.settings).toEqual(custom);
    });
  });

  describe('set', () => {
    it('uses default cookieName and cookieOptions', () => {
      const event = makeMockEvent();
      const message = { type: 'success' as const, message: 'Saved!' };
      FlashMessage.set(event, message);
      expect(event.cookies.set).toHaveBeenCalledWith(
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieName,
        JSON.stringify(message),
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieOptions
      );
    });

    it('uses custom cookieName', () => {
      FlashMessage.settings.cookieName = 'app-flash';
      const event = makeMockEvent();
      FlashMessage.set(event, { type: 'error', message: 'Oops' });
      expect(event.cookies.set).toHaveBeenCalledWith(
        'app-flash',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('uses custom cookieOptions', () => {
      const opts = {
        path: '/app',
        maxAge: 10,
        httpOnly: false,
        secure: false,
        sameSite: 'strict' as const
      };
      FlashMessage.settings.cookieOptions = opts;
      const event = makeMockEvent();
      FlashMessage.set(event, { type: 'wait', message: 'Loading' });
      expect(event.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        opts
      );
    });
  });

  describe('delete', () => {
    it('uses default cookieName and cookieOptions', () => {
      const event = makeMockEvent();
      FlashMessage.delete(event);
      expect(event.cookies.delete).toHaveBeenCalledWith(
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieName,
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieOptions
      );
    });

    it('uses custom cookieName', () => {
      FlashMessage.settings.cookieName = 'app-flash';
      const event = makeMockEvent();
      FlashMessage.delete(event);
      expect(event.cookies.delete).toHaveBeenCalledWith(
        'app-flash',
        expect.any(Object)
      );
    });
  });

  describe('get', () => {
    it('returns undefined when cookie is absent', () => {
      const event = makeMockEvent(undefined);
      expect(FlashMessage.get(event)).toBeUndefined();
    });

    it('returns parsed message when cookie is valid', () => {
      const message = { type: 'success' as const, message: 'Done' };
      const event = makeMockEvent(JSON.stringify(message));
      expect(FlashMessage.get(event)).toEqual(message);
    });

    it('deletes the cookie after reading it', () => {
      const event = makeMockEvent(
        JSON.stringify({ type: 'success', message: 'Done' })
      );
      FlashMessage.get(event);
      expect(event.cookies.delete).toHaveBeenCalledWith(
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieName,
        DEFAULT_FLASH_MESSAGE_SETTINGS.cookieOptions
      );
    });

    it('reads cookie using custom cookieName', () => {
      FlashMessage.settings.cookieName = 'app-flash';
      const event = makeMockEvent(
        JSON.stringify({ type: 'success', message: 'Hi' })
      );
      FlashMessage.get(event);
      expect(event.cookies.get).toHaveBeenCalledWith('app-flash');
    });

    it('returns undefined for invalid JSON', () => {
      const event = makeMockEvent('not-json');
      expect(FlashMessage.get(event)).toBeUndefined();
    });

    it('returns undefined for JSON that fails schema validation', () => {
      const event = makeMockEvent(
        JSON.stringify({ type: 'unknown', message: 123 })
      );
      expect(FlashMessage.get(event)).toBeUndefined();
    });
  });
});
