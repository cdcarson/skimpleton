<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { checkboxGroupFormSchema, type CheckboxGroupFormData } from './schema.js';
  import type { ActionData } from './$types.js';

  type Props = {
    actionData: ActionData;
    savedData?: CheckboxGroupFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    checkboxGroupFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );

  const interests = form.field('interests');
  const notifications = form.field('notifications');
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <fieldset class="space-y-2">
      <legend>Interests (required)</legend>
      {#each interests.options as value (value)}
        <label class="flex items-center gap-2">
          <input {...interests.checkboxAttributes(value)} />
          {value}
        </label>
      {/each}
    </fieldset>

    <div class="space-y-1">
      <label for={notifications.id}>Notifications</label>
      <select {...notifications.selectAttributes()} class="control">
        {#each notifications.options as value (value)}
          <option {...notifications.optionAttributes(value)}>{value}</option>
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
