import { resolve } from '$app/paths';
import type { SerializeOptions } from 'cookie';
import {
  checkboxGroupFormSchema,
  type CheckboxGroupFormData
} from './schema.js';
import type { RequestEvent, Actions } from './$types.js';
import { ServerFormHandler } from 'skimpleton';

export const load = (event: RequestEvent) => {
  return {
    saved: getCookie(event)
  };
};

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      checkboxGroupFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    setCookie(event, handler.data);
    return handler.succeed({ message: 'Preferences saved.' });
  }
};

const COOKIE_NAME = 'data-form-demos-checkbox-group';
const COOKIE_OPTS: SerializeOptions & { path: string } = {
  path: resolve('/form/demos/checkbox-group'),
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
};

const setCookie = (event: RequestEvent, data: CheckboxGroupFormData) => {
  event.cookies.set(COOKIE_NAME, JSON.stringify(data), COOKIE_OPTS);
};

const getCookie = (event: RequestEvent): CheckboxGroupFormData | undefined => {
  try {
    return checkboxGroupFormSchema.parse(
      JSON.parse(event.cookies.get(COOKIE_NAME) || '')
    );
  } catch {
    return undefined;
  }
};
