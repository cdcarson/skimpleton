<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { COLORS, selectFormSchema, type SelectFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
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
    <label class="block" for={form.field('favoriteColor').id}>Favorite Color</label>
    <select
      {...form.field('favoriteColor').selectAttributes()}
      class="control"
      class:invalid={form.shownErrors['favoriteColor']}
      aria-describedby={form.field('favoriteColor').id + 'desc'}
    >
      <option value="">Please select...</option>
      {#each COLORS as o (o)}
        <option {...form.field('favoriteColor').optionAttributes(o)}>
          {o}
        </option>
      {/each}
    </select>
    <div id={form.field('favoriteColor').id + 'desc'}>
      {#if form.shownErrors['favoriteColor']}
        <div class="text-red-600">
          {form.shownErrors['favoriteColor']}
        </div>
      {/if}
      <div class="text-sm text-gray-600">
        Choose <strong>indigo</strong> to trigger a server-side form error.
      </div>
    </div>
  </div>

  <div>
    <button class="button primary w-full" type="submit"> Save </button>
  </div>
</form>

<DemoFormData handler={form} {savedData} />
