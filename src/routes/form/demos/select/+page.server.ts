import {
  deleteDemoCookie,
  getDemoCookie,
  setDemoCookie
} from '$demo/demo-cookies.js';
import { ServerFormHandler } from 'skimpleton';
import type { RequestEvent, Actions } from './$types.js';
import { selectFormSchema } from './schema.js';
import z from 'zod';
export const load = (event: RequestEvent) => {
  return {
    saved: getDemoCookie(event, selectFormSchema)
  };
};
export const actions: Actions = {
  selectDemo: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      selectFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    // arbitrary server error...
    if (handler.data.state === 'NE') {
      return handler.fail({
        state: 'Too many users in Nebraska.'
      });
    }
    setDemoCookie(event, selectFormSchema, handler.data);
    return handler.succeed({
      message: `You chose ${handler.data.state}.`,
      randomNum: Math.random()
    });
  },
  deleteSaved: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(z.object({}), new FormData(), event);
    deleteDemoCookie(event);
    return handler.succeed({ message: 'Deleted saved data.' });
  }
};
