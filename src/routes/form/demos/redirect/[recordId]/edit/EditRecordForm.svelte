<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { contactFormSchema, type ContactRecord } from '../../schema.js';
  import type { ActionData } from './$types.js';
  type Props = {
    record: ContactRecord;
    actionData: ActionData;
    conflictingEmail?: string;
  };
  let { actionData, record, conflictingEmail }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    contactFormSchema,
    actionData
      ? actionData
      : { data: { name: record.name, email: record.email } }
  );
</script>

<form {...form.attributes()} class="space-y-4 p-4">
  <div class="space-y-1">
    <label class="block" for={form.field('name').id}>Name</label>
    <input {...form.field('name').inputAttributes('text')} class="control" />
    {#if form.shownErrors['name']}
      <div class="text-red-600">{form.shownErrors['name']}</div>
    {/if}
  </div>

  <div class="space-y-1">
    <label class="block" for={form.field('email').id}>Email</label>
    <input {...form.field('email').inputAttributes('email')} class="control" />
    {#if form.shownErrors['email']}
      <div class="text-red-600">{form.shownErrors['email']}</div>
    {/if}
    {#if conflictingEmail}
      <div class="text-xs text-gray-600">
        Try entering <kbd>{conflictingEmail}</kbd> to trigger a server error. (That
        email already exists.)
      </div>
    {/if}
  </div>

  <div class="flex justify-end">
    <button class="button primary" type="submit">
      <span class="icon-[bi--save]"></span>
      Save
    </button>
  </div>
</form>
