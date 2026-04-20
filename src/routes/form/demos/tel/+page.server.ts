import { deleteDemoCookie, getDemoCookie, setDemoCookie } from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { telFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './TelForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, telFormSchema),
    code: [
      { label: 'schema.ts', language: 'typescript', code: schemaTs },
      { label: 'TelForm.svelte', language: 'html', code: formSvelte },
      { label: '+page.svelte', language: 'html', code: pageSvelte },
      { label: '+page.server.ts', language: 'typescript', code: pageServerTs }
    ]
  };
};

export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(telFormSchema, await event.request.formData(), event);
    if (!handler.valid) return handler.fail();
    setDemoCookie(event, telFormSchema, handler.data);
    return handler.succeed({ message: `You entered "${handler.data.phone}".`, randomNum: Math.random() });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
