import { getDemoCookie, setDemoCookie } from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { schema } from './schema.js';
export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, schema)
  };
};
export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      schema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    setDemoCookie(event, schema, handler.data);
    return handler.succeed({ message: `You chose ${handler.data.state}.`, randomNum: Math.random() });
  }
};
