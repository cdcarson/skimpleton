import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { selectFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import selectFormSvelte from './SelectForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, selectFormSchema),
    code: [
      {
        label: 'schema.ts',
        language: 'typescript',
        code: schemaTs
      },
      {
        label: 'SelectForm.svelte',
        language: 'html',
        code: selectFormSvelte
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
      selectFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // arbitrary server error...
    if (handler.data.favoriteColor === 'indigo') {
      return handler.fail({
        favoriteColor: 'Sorry. All out of indigo.'
      });
    }
    setDemoCookie(event, selectFormSchema, handler.data);
    return handler.succeed({
      message: `You chose ${handler.data.favoriteColor}.`,
      randomNum: Math.random()
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
