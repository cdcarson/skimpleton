<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { numberRangeFormSchema, type NumberRangeFormData } from './schema.js';
  import type { ActionData } from './$types.js';

  type Props = { actionData: ActionData; savedData?: NumberRangeFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    numberRangeFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <div class="space-y-2">
      <label for={form.field('rating').id}>
        Rating: {form.data.rating ?? 5}
      </label>
      <input
        {...form.field('rating').attributes({ as: 'range' })}
        class="w-full"
        min="1"
        max="10"
        step="1"
      />
    </div>
    <div>
      <button class="button primary w-full" type="submit">Save</button>
    </div>
  </form>

  <section>
    <h2 class="font-bold">Data</h2>
    <pre>{JSON.stringify(form.data, null, 2)}</pre>
  </section>

  <section>
    <h2 class="font-bold">Errors</h2>
    <pre>{JSON.stringify(form.errors, null, 2)}</pre>
  </section>
</div>
