import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { checkboxesFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './CheckboxesForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, checkboxesFormSchema),
    code: [
      {
        label: 'schema.ts',
        language: 'typescript',
        code: schemaTs
      },
      {
        label: 'SelectMultipleForm.svelte',
        language: 'html',
        code: formSvelte
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
      checkboxesFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // arbitrary server error...
    if (handler.data.planetsVisited.includes('Pluto') ) {
      return handler.fail({
        planetsVisited: 'Sorry. Pluto has been recently discontinued as a planet.'
      });
    }
    setDemoCookie(event, checkboxesFormSchema, handler.data);
    return handler.succeed({
      message: `You have visited ${handler.data.planetsVisited.length} planet(s).`,
      randomNum: Math.random()
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
