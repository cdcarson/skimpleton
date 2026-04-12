<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { bigintFormSchema } from './schema.js';
  import type { ActionData } from './$types.js';

  import type { BigintFormData } from './schema.js';
  type Props = { actionData: ActionData; savedData?: BigintFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    bigintFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <div class="space-y-1">
      <label for={form.field('amount').id}>Amount</label>
      <input
        {...form.field('amount').attributes({ as: 'number' })}
        class="control"
        step="1"
      />
    </div>
    <div>
      <button class="button primary w-full" type="submit">Save</button>
    </div>
  </form>

  <section>
    <h2 class="font-bold">Data</h2>
    <pre>{JSON.stringify(form.data, (_, v) => typeof v === 'bigint' ? `${v}n` : v, 2)}</pre>
  </section>

  <section>
    <h2 class="font-bold">Errors</h2>
    <pre>{JSON.stringify(form.errors, null, 2)}</pre>
  </section>
</div>
