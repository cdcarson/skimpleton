<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import {
    PLANETS,
    selectMultipleFormSchema,
    type SelectMultipleFormFormData
  } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: SelectMultipleFormFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    selectMultipleFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <label class="block" for={form.field('planetsVisited').id}
          >Planets Visited</label
        >
        <select
          {...form.field('planetsVisited').selectAttributes()}
          class="control"
          class:invalid={form.shownErrors['planetsVisited']}
          aria-describedby={form.field('planetsVisited').id + 'desc'}
        >
          {#each PLANETS as o (o)}
            <option {...form.field('planetsVisited').optionAttributes(o)}>
              {o}
            </option>
          {/each}
        </select>
        <div id={form.field('planetsVisited').id + 'desc'}>
          {#if form.shownErrors['planetsVisited']}
            <div class="text-red-600">
              {form.shownErrors['planetsVisited']}
            </div>
          {/if}
          <div class="text-sm text-gray-600">
            Choose <strong>Pluto</strong> to trigger a server-side form error.
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="button primary" type="submit">
          <span class="icon-[bi--save]"></span>
          Save
        </button>
      </div>
    </form>
  </div>

  <DemoFormData handler={form} {savedData} />
</div>
