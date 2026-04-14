import { kitchenSinkSchema } from './schema.js';
import type { RequestEvent, Actions } from './$types.js';
import { ServerFormHandler } from 'skimpleton';
import { resolve } from '$app/paths';

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      kitchenSinkSchema,
      await event.request.formData(),
      event
    );

    if (!handler.valid) {
      return handler.fail();
    }

    // Fake server-side error: "email already in use"
    if (handler.data.email === 'bob@example.com') {
      return handler.fail({ email: 'This email is already in use.' });
    }

    if (handler.data.resultMode === 'redirect') {
      return handler.redirect(resolve('/form/demos'), 'Redirected to demos listing.');
    }

    return handler.succeed({ message: 'Saved successfully.' });
  }
};
