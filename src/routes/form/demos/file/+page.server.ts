import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { fileFormSchema } from './schema.js';
import z from 'zod';

import schemaTs from './schema.ts?raw';
import pageServerTs from './+page.server.ts?raw';
import pageSvelte from './+page.svelte?raw';
import formSvelte from './FileForm.svelte?raw';

export const load = () => {
  return {
    code: [
      { label: 'schema.ts', language: 'typescript', code: schemaTs },
      { label: 'FileForm.svelte', language: 'html', code: formSvelte },
      { label: '+page.svelte', language: 'html', code: pageSvelte },
      { label: '+page.server.ts', language: 'typescript', code: pageServerTs }
    ]
  };
};

export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      fileFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // Arbitrary server error: avatar size limit (2 MB)
    if (handler.data.avatar.size > 2 * 1024 * 1024) {
      return handler.fail({ avatar: 'Avatar must be 2 MB or smaller.' });
    }
    return handler.succeed({
      message: `Received avatar "${handler.data.avatar.name}" (${handler.data.attachments.length} attachment(s)).`
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    return handler.succeed({ message: 'Nothing to delete.' });
  }
};
