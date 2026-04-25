import type { RequestEvent } from './$types.js';
import { getRecords } from './data.js';

export const load = (event: RequestEvent) => {
  return {
    records: getRecords(event)
  };
};
