<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { booleanFormSchema, type BooleanFormFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: BooleanFormFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    booleanFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <input {...form.field('iLikeCats').attributes()} />
          <label for={form.field('iLikeCats').id}>I like cats</label>
        </div>

        <div id={form.field('iLikeCats').id + 'desc'}>
          {#if form.shownErrors['iLikeCats']}
            <div class="text-red-600">
              {form.shownErrors['iLikeCats']}
            </div>
          {/if}
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
