import { error } from '@sveltejs/kit';
import { getRecords } from '../data.js';
import type { RequestEvent } from './$types.js';

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
