import type { RequestEvent } from '@sveltejs/kit';
import z from 'zod';
import { stringify, parse } from 'devalue';
import type { SerializeOptions } from 'cookie';

export const getDemoCookie = <S extends z.ZodObject>(
  event: RequestEvent,
  schema: S
): z.infer<S> | undefined => {
  try {
    return schema.parse(parse(event.cookies.get(getCookieName(event)) ?? ''));
  } catch {
    return undefined;
  }
};
export const setDemoCookie = <S extends z.ZodObject>(
  event: RequestEvent,
  schema: S,
  data: z.infer<S>
) => {
  try {
    const ser = stringify(schema.parse(data));
    event.cookies.set(getCookieName(event), ser, getCookieOpts(event));
  } catch (error) {
    console.log(error);
  }
};
export const deleteDemoCookie = (event: RequestEvent) => {
  event.cookies.delete(getCookieName(event), getCookieOpts(event));
};

const getCookieName = (event: RequestEvent): string => {
  return 'demo' + event.url.pathname.replaceAll('/', '-');
};
const getCookieOpts = (
  event: RequestEvent
): SerializeOptions & { path: string } => {
  return {
    path: event.url.pathname,
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  };
};
