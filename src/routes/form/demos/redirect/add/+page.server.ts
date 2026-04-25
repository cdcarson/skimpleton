import { getRecords, updateRecords } from '../data.js';
import type { Actions, RequestEvent } from './$types.js';
import { contactFormSchema } from '../schema.js';
import { ServerFormHandler } from 'skimpleton';
import { resolve } from '$app/paths';

export const load = (event: RequestEvent) => {
  return {
    records: getRecords(event)
  };
};

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const records = getRecords(event);

    const handler = new ServerFormHandler(
      contactFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }

    const emailConflict = records.find(
      (r) => r.email.toLowerCase() === handler.data.email.toLowerCase()
    );
    if (emailConflict) {
      return handler.fail({
        email: `The email ${handler.data.email} is already in use by another account.`
      });
    }

    const id = crypto.randomUUID();
    const updated = [...records, { ...handler.data, id }];
    updateRecords(event, updated);
    return handler.redirect(
      resolve('/form/demos/redirect/[recordId]', { recordId: id }),
      'Record added!'
    );
  }
};
