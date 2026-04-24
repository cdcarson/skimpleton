import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { numericFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './NumericForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, numericFormSchema),
    code: [
      { label: 'schema.ts', language: 'typescript', code: schemaTs },
      { label: 'NumericForm.svelte', language: 'html', code: formSvelte },
      { label: '+page.svelte', language: 'html', code: pageSvelte },
      { label: '+page.server.ts', language: 'typescript', code: pageServerTs }
    ]
  };
};

export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      numericFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // Arbitrary server error: age restriction business rule
    if (handler.data.age < 18) {
      return handler.fail({ age: 'You must be 18 or older.' });
    }
    setDemoCookie(event, numericFormSchema, handler.data);
    return handler.succeed({
      message: `Saved. Age: ${handler.data.age}, rating: ${handler.data.rating}.`
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
