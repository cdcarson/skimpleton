<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { radioGroupFormSchema, type RadioGroupFormData } from './schema.js';
  import type { ActionData } from './$types.js';

  type Props = {
    actionData: ActionData;
    savedData?: RadioGroupFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    radioGroupFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );

  const plan = form.field('plan');
  const contactPreference = form.field('contactPreference');
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <fieldset class="space-y-2">
      <legend>Plan (required)</legend>
      {#each plan.options as value (value)}
        <label class="flex items-center gap-2">
          <input {...plan.radioAttributes(value)} />
          {value}
        </label>
      {/each}
    </fieldset>

    <div class="space-y-1">
      <label for={contactPreference.id}>Contact Preference</label>
      <select {...contactPreference.selectAttributes()} class="control">
        {#each contactPreference.options as value (value)}
          <option {...contactPreference.optionAttributes(value)}>{value}</option>
        {/each}
      </select>
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
