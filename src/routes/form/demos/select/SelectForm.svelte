<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { selectFormSchema, type SelectFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import { US_STATE_NAMES } from '$demo/data/states.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';
  type Props = {
    actionData: ActionData;
    savedData?: SelectFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    selectFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<form {...form.attributes()} action="?/selectDemo" class="space-y-4">
  <div class="space-y-1">
    <label class="block" for={form.field('state').id}>State</label>
    <select
      {...form.field('state').selectAttributes()}
      class="control"
      aria-describedby={form.field('state').id + 'desc'}
    >
      <option value="">Please select...</option>
      {#each US_STATE_NAMES as o (o.value)}
        <option {...form.field('state').optionAttributes(o.value)}>
          {o.label}
        </option>
      {/each}
    </select>
    <div id={form.field('state').id + 'desc'}>
      {#if form.shownErrors['state']}
        <div class="text-red-600">
          {form.shownErrors['state']}
        </div>
      {/if}
      <div class="text-sm text-gray-600">
        Enter Nebraska to trigger a server-side form error.
      </div>
    </div>
  </div>

  <div>
    <button class="button primary w-full" type="submit"> Save </button>
  </div>
</form>

<DemoFormData handler={form} />
