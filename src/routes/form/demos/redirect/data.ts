import z from 'zod';
import { type ContactRecords, contactRecordsSchema } from './schema.js';
import type { RequestEvent } from '@sveltejs/kit';
import type { SerializeOptions } from 'cookie';
import { resolve } from '$app/paths';

const seedData: ContactRecords = [
  {
    name: 'Marlene D.',
    email: 'marlene.d@example.com',
    id: 'CB9B2118-FF61-4EF9-B99A-3283615DADE7'
  },
  {
    name: 'Hedy L.',
    email: 'hedy.l@example.com',
    id: 'ECB8E92E-8C69-4BB5-A521-552D58DFBFBB'
  },
  {
    name: 'Clara B.',
    email: 'clara.b@example.com',
    id: '9F524C35-2694-4C4C-ACA8-FE97DD56831C'
  }
];

const COOKIE_NAME = 'form-redirect-demo-data';
const COOKIE_OPTS: SerializeOptions & { path: string } = {
  path: resolve('/form/demos/redirect'),
  httpOnly: true,
  sameSite: 'lax',
  secure: true
};

export const getRecords = (event: RequestEvent): ContactRecords => {
  try {
    return contactRecordsSchema.parse(
      JSON.parse(event.cookies.get(COOKIE_NAME) || '')
    );
  } catch {
    return [...seedData];
  }
};

export const updateRecords = (
  event: RequestEvent,
  records: z.infer<typeof contactRecordsSchema>
) => {
  event.cookies.set(COOKIE_NAME, JSON.stringify(records), COOKIE_OPTS);
};
