import { resolve } from '$app/paths';
import type { SerializeOptions } from 'cookie';
import { bigintFormSchema, type BigintFormData } from './schema.js';
import type { RequestEvent, Actions } from './$types.js';
import { ServerFormHandler } from 'skimpleton';

export const load = (event: RequestEvent) => {
  return { saved: getCookie(event) };
};

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      bigintFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) return handler.fail();
    setCookie(event, handler.data);
    return handler.succeed({ message: 'Saved.' });
  }
};

const COOKIE_NAME = 'data-form-demos-bigint';
const COOKIE_OPTS: SerializeOptions & { path: string } = {
  path: resolve('/form/demos/bigint'),
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
};

const replacer = (_: string, v: unknown) =>
  typeof v === 'bigint' ? { __bigint__: v.toString() } : v;

const reviver = (_: string, v: unknown) =>
  v && typeof v === 'object' && '__bigint__' in v
    ? BigInt((v as { __bigint__: string }).__bigint__)
    : v;

const setCookie = (event: RequestEvent, data: BigintFormData) => {
  event.cookies.set(COOKIE_NAME, JSON.stringify(data, replacer), COOKIE_OPTS);
};

const getCookie = (event: RequestEvent): BigintFormData | undefined => {
  try {
    return bigintFormSchema.parse(
      JSON.parse(event.cookies.get(COOKIE_NAME) || '', reviver)
    );
  } catch {
    return undefined;
  }
};
