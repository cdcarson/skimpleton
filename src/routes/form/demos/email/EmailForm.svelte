<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { emailFormSchema, type EmailFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = { actionData: ActionData; savedData?: EmailFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    emailFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <label for={form.field('email').id}>Email</label>
        <input
          {...form.field('email').attributes({ as: 'email' })}
          class="control"
          class:invalid={form.shownErrors['email']}
          aria-describedby={form.field('email').id + 'desc'}
        />
        <div id={form.field('email').id + 'desc'}>
          {#if form.shownErrors['email']}
            <div class="text-red-600">{form.shownErrors['email']}</div>
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
