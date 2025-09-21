import { getDemoCookie, setDemoCookie, demoSchema } from '../shared';
import type { RequestEvent, Actions } from './$types';
import { ActionHandler } from '@skimpleton/forms/server';
export const load = async (event: RequestEvent) => {
  const data = getDemoCookie(event);
  return {
    data
  };
};
export const actions: Actions = {
  default: async (event) => {
    const form = new ActionHandler(demoSchema, await event.request.formData(), event);
    if (!form.valid) {
      return form.fail();
    }
    setDemoCookie(event, form.data);
    return form.redirect({
      message: 'Form submitted successfully',
      location: '/forms/demos/redirect-action'
    });
  }
};