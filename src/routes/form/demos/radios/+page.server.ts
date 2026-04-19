import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { radiosFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import radiosFormSvelte from './RadiosForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, radiosFormSchema),
    code: [
      {
        label: 'schema.ts',
        language: 'typescript',
        code: schemaTs
      },
      {
        label: 'RadiosForm.svelte',
        language: 'html',
        code: radiosFormSvelte
      },
      {
        label: '+page.svelte',
        language: 'html',
        code:  pageSvelte
      },
      {
        label: '+page.server.ts',
        language: 'typescript',
        code: pageServerTs
      }
    ]
  };
};
export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      radiosFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // arbitrary server error...
    if (handler.data.whatPlanetFrom === 'Pluto') {
      return handler.fail({
        whatPlanetFrom: 'Sorry. Pluto has been recently discontinued.'
      });
    }
    setDemoCookie(event, radiosFormSchema, handler.data);
    return handler.succeed({
      message: `You chose ${handler.data.whatPlanetFrom}.`,
      randomNum: Math.random()
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
