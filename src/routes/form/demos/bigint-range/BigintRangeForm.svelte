<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { bigintRangeFormSchema } from './schema.js';
  import type { ActionData } from './$types.js';

  import type { BigintRangeFormData } from './schema.js';
  type Props = { actionData: ActionData; savedData?: BigintRangeFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    bigintRangeFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <div class="space-y-2">
      <label for={form.field('level').id}>
        Level: {form.data.level ?? 9007199254740992n}
      </label>
      <input
        {...form.field('level').attributes({ as: 'range' })}
        class="w-full"
        min="9007199254740992"
        max="9007199254741092"
        step="1"
      />
    </div>
    <div>
      <button class="button primary w-full" type="submit">Save</button>
    </div>
  </form>

  <section>
    <h2 class="font-bold">Data</h2>
    <pre>{JSON.stringify(
        form.data,
        (_, v) => (typeof v === 'bigint' ? `${v}n` : v),
        2
      )}</pre>
  </section>

  <section>
    <h2 class="font-bold">Errors</h2>
    <pre>{JSON.stringify(form.errors, null, 2)}</pre>
  </section>
</div>
