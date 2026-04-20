<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { fileMultipleFormSchema, type FileMultipleFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: FileMultipleFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    fileMultipleFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <label for={form.field('files').id}>Files</label>
        <input
          {...form.field('files').attributes()}
          class="control"
          class:invalid={form.shownErrors['files']}
        />

        <div id={form.field('files').id + 'desc'}>
          {#if form.shownErrors['files']}
            <div class="text-red-600">
              {form.shownErrors['files']}
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
