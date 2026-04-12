<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { textFormSchema, type TextFormData } from './schema.js';
  import type { ActionData } from './$types.js';
  type Props = {
    actionData: ActionData;
    savedData?: TextFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    textFormSchema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <div class="space-y-1">
      <label for={form.field('name').id}>Your Name</label>
      <input
        {...form.field('name').attributes()}
        class="control"
        autocomplete="name"
      />
    </div>
    <div class="space-y-1">
      <label for={form.field('email').id}>Email</label>
      <input
        {...form.field('email').attributes({ type: 'email' })}
        class="control"
        autocomplete="email"
      />
    </div>
    <div>
      <label for={form.field('bio').id}>Bio</label>
      <textarea
        {...form.field('bio').attributes({ element: 'textarea' })}
        class="control"
        rows="5"
      ></textarea>
    </div>
    <div>
      <button class="button primary w-full" type="submit"> Save </button>
    </div>
  </form>

  <section>
    <h2 class="font-bold">Data</h2>
    <pre>{JSON.stringify(form.data, null, 2)}</pre>
  </section>

  <section>
    <h2 class="font-bold">Errors</h2>
    <pre>{JSON.stringify(form.errors, null, 2)}</pre>
  </section>
</div>
