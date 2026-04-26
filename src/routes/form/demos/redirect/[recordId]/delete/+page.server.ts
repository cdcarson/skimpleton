import { error } from '@sveltejs/kit';
import { getRecords, updateRecords } from '../../data.js';
import type { Actions, RequestEvent } from './$types.js';
import { emptySchema } from '../../schema.js';
import { ServerFormHandler } from 'skimpleton';
import { resolve } from '$app/paths';

export const load = async (event: RequestEvent) => {
  const records = getRecords(event);
  const record = records.find((r) => r.id === event.params.recordId);
  if (!record) {
    error(404, 'Record not found!');
  }
  return {
    record
  };
};

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const records = getRecords(event);
    const record = records.find((r) => r.id === event.params.recordId);
    if (!record) {
      error(404, 'Record not found!');
    }
    const handler = new ServerFormHandler(emptySchema, new FormData(), event);
    if (!handler.valid) {
      return handler.fail();
    }
    const updated = [...records.filter((r) => r.id !== record.id)];
    updateRecords(event, updated);
    return handler.redirect(resolve('/form/demos/redirect'), 'Record deleted!');
  }
};
