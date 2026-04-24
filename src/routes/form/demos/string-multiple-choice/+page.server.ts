import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { stringMultipleChoiceFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './StringMultipleChoiceForm.svelte?raw';

export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, stringMultipleChoiceFormSchema),
    code: [
      { label: 'schema.ts', language: 'typescript', code: schemaTs },
      {
        label: 'StringMultipleChoiceForm.svelte',
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
      stringMultipleChoiceFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // Arbitrary server error: red and green conflict
    if (
      handler.data.favoriteColors.includes('red') &&
      handler.data.favoriteColors.includes('green')
    ) {
      return handler.fail({
        favoriteColors: 'Red and green cannot be selected together.'
      });
    }
    setDemoCookie(event, stringMultipleChoiceFormSchema, handler.data);
    return handler.succeed({ message: 'Preferences saved.' });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
