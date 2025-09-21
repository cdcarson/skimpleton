import type { LayoutServerLoadEvent } from './$types';
import { getDemoCookie } from './shared';

export const load = async (event: LayoutServerLoadEvent) => {
  const data = getDemoCookie(event);
  return {
    data
  };
};
