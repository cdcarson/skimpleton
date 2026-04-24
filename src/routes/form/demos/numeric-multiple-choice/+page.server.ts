import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { numericMultipleChoiceFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './NumericMultipleChoiceForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, numericMultipleChoiceFormSchema),
    code: [
      { label: 'schema.ts', language: 'typescript', code: schemaTs },
      {
        label: 'NumericMultipleChoiceForm.svelte',
        language: 'html',
        code: formSvelte
      },
      { label: '+page.svelte', language: 'html', code: pageSvelte },
      { label: '+page.server.ts', language: 'typescript', code: pageServerTs }
    ]
  };
};

export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      numericMultipleChoiceFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // Arbitrary server error: 1 and 5 are contradictory ratings
    if (handler.data.ratings.includes(1) && handler.data.ratings.includes(5)) {
      return handler.fail({
        ratings: 'You cannot select both 1 and 5 as ratings.'
      });
    }
    setDemoCookie(event, numericMultipleChoiceFormSchema, handler.data);
    return handler.succeed({ message: 'Selections saved.' });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
