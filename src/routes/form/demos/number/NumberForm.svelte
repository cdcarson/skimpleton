<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { numberFormSchema, type NumberFormData } from './schema.js';
  import type { ActionData } from './$types.js';

  type Props = { actionData: ActionData; savedData?: NumberFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    numberFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <div class="space-y-1">
      <label for={form.field('quantity').id}>Quantity</label>
      <input
        {...form.field('quantity').attributes({ as: 'number' })}
        class="control"
        min="1"
        max="100"
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
