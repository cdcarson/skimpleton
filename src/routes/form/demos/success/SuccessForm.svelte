<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import { successFormSchema, type SuccessFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: SuccessFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    successFormSchema,
    actionData
      ? (actionData as Partial<FormState<SuccessFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/save" class="space-y-4 p-4">
      <div class="space-y-1">
        <label class="block" for={form.field('name').id}>Name</label>
        <input
          {...form.field('name').inputAttributes('text')}
          class="control"
        />
        {#if form.shownErrors['name']}
          <div class="text-red-600">{form.shownErrors['name']}</div>
        {/if}
      </div>

      <div class="space-y-1">
        <label class="block" for={form.field('email').id}>Email</label>
        <input
          {...form.field('email').inputAttributes('email')}
          class="control"
        />
        {#if form.shownErrors['email']}
          <div class="text-red-600">{form.shownErrors['email']}</div>
        {/if}
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
