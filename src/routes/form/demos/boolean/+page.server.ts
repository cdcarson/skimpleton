import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { booleanFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './BooleanForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, booleanFormSchema),
    code: [
      {
        label: 'schema.ts',
        language: 'typescript',
        code: schemaTs
      },
      {
        label: 'BooleanForm.svelte',
        language: 'html',
        code: formSvelte
      },
      {
        label: '+page.svelte',
        language: 'html',
        code: pageSvelte
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
      booleanFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // arbitrary server error...
    if (handler.data.iLikeCats && !handler.data.iOwnACat) {
      return handler.fail({
        iOwnACat: 'If you like cats you must own one.'
      });
    } else if (!handler.data.iLikeCats && handler.data.iOwnACat) {
      return handler.fail({
        iOwnACat: 'If you don’t like cats you shouldn’t be a cat owner.'
      });
    }
    // handler.data.demoHiddenBoolean = Math.random() < .5;

    setDemoCookie(event, booleanFormSchema, handler.data);
    return handler.succeed({
      message: `You ${handler.data.iLikeCats ? 'like' : 'don’t like'} cats.`,
      randomNum: Math.random()
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
