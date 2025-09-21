<script lang="ts">
  import {
    ClientFormState,
    type ServerFormState,
    enhanceActionForm
  } from '@skimpleton/forms';
  import type { PageData } from './$types.js';
  import { demoSchema } from '../shared.js';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';

  type Props = {
    data: PageData;
    actionData: ServerFormState<typeof demoSchema>|null;
  };
  let {  data, actionData }: Props = $props();

  const form = new ClientFormState(
    demoSchema,
    { name: data.data?.name ?? '' },
    actionData ?? undefined
  );
</script>

<form
  method="POST"
  use:enhance={enhanceActionForm(form, {
    onSuccess: async () => {
      await invalidateAll();
    }
  })}
>
  <div class="space-y-4">
    <div class="space-y-1">
      <label for={form.controlId('name')} class="block">Name</label>
      <input
        type="text"
        name={form.controlName('name')}
        id={form.controlId('name')}
        bind:value={form.data.name}
        class="control"
        class:invalid={form.shownErrors.name}
        onblur={() => form.touch('name')}
        aria-describedby={form.controlId('name') + '-description'}
      />
      <div class="text-sm" id={form.controlId('name') + '-description'}>
        {#if form.shownErrors.name}
          <span class="text-red-700 dark:text-red-300">
            {form.shownErrors.name}
          </span>
        {/if}
      </div>
    </div>
    <div class="flex justify-between">
      
      <button type="submit" class="button button-primary">Save</button>
    </div>
  </div>
</form>
