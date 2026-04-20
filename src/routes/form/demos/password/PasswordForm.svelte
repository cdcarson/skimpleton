<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { passwordFormSchema, type PasswordFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = { actionData: ActionData; savedData?: PasswordFormData };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    passwordFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <label for={form.field('password').id}>Password</label>
        <input
          {...form.field('password').attributes({ as: 'password' })}
          class="control"
          class:invalid={form.shownErrors['password']}
          aria-describedby={form.field('password').id + 'desc'}
        />
        <div id={form.field('password').id + 'desc'}>
          {#if form.shownErrors['password']}
            <div class="text-red-600">{form.shownErrors['password']}</div>
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
