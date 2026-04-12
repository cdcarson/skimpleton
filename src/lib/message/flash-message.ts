import type { SerializeOptions } from 'cookie';
import { messageSchema, type MessageData } from './types.js';
import type { RequestEvent } from '@sveltejs/kit';

export type FlashMessageOptions = {
  cookieName: string;
  cookieOptions: SerializeOptions & { path: string };
};

export const DEFAULT_FLASH_MESSAGE_SETTINGS: FlashMessageOptions = {
  cookieName: 'sk-flash',
  cookieOptions: {
    path: '/',
    maxAge: 60 * 5,
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  }
} as const;

export class FlashMessage {
  public static settings: FlashMessageOptions = structuredClone(
    DEFAULT_FLASH_MESSAGE_SETTINGS
  );
  public static get(event: RequestEvent): MessageData | undefined {
    const { cookieName } = FlashMessage.settings;
    const serialized = event.cookies.get(cookieName);
    if (serialized) {
      FlashMessage.delete(event);
      try {
        return messageSchema.parse(JSON.parse(serialized));
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
  public static set(event: RequestEvent, message: MessageData): void {
    const { cookieName, cookieOptions } = FlashMessage.settings;
    event.cookies.set(cookieName, JSON.stringify(message), cookieOptions);
  }
  public static delete(event: RequestEvent): void {
    const { cookieName, cookieOptions } = FlashMessage.settings;
    event.cookies.delete(cookieName, cookieOptions);
  }
}
