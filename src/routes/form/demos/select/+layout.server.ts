import schemaTs from './schema.ts?raw';
import formSvelte from './SelectForm.svelte?raw';
import pageServerTs from './+page.server.ts?raw';

export const load = () => {
  return {
    DEMO_FILES: {
      schemaTs,
      pageServerTs,
      formSvelte
    }
  };
};
