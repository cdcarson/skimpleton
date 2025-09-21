import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';
import { resolve } from '$app/paths';

export const demoSchema = z.object({
  name: z.string(),
});

export const getDemoCookie = (
  event: RequestEvent
): z.infer<typeof demoSchema> | null => {
  const cookie = event.cookies.get('redirect-action-demo');
  if (!cookie) {
    return null;
  }
  try {
    const data = JSON.parse(cookie);
    return demoSchema.parse(data);
  } catch (error) {
    return null;
  }
};

export const setDemoCookie = (
  event: RequestEvent,
  data: z.infer<typeof demoSchema>
) => {
  event.cookies.set('redirect-action-demo', JSON.stringify(data), {
    path: resolve('/forms/demos/redirect-action'),
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
};
