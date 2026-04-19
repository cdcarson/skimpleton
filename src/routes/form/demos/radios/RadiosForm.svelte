<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { PLANETS, radiosFormSchema, type RadiosFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: RadiosFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    radiosFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 font-semibold px-4 py-2">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <fieldset class="space-y-1">
        <legend>What planet are you from?</legend>
        <div class="grid grid-cols-2 sm:grid-cols-3">
          {#each PLANETS as opt (opt)}
            <label class="flex items-center gap-2">
              <input {...form.field('whatPlanetFrom').radioAttributes(opt)} />
              {opt}
            </label>
          {/each}
        </div>

        <div id={form.field('whatPlanetFrom').id + '-description'}>
          {#if form.shownErrors['whatPlanetFrom']}
            <div class="text-red-600">
              {form.shownErrors['whatPlanetFrom']}
            </div>
          {/if}
          <div class="text-xs text-gray-600">
            Choose <strong>Pluto</strong> to trigger a server-side form error.
          </div>
        </div>
      </fieldset>

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
