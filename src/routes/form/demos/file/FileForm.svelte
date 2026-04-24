<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import { fileFormSchema, type FileFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
  };
  let { actionData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    fileFormSchema,
    actionData ? (actionData as Partial<FormState<FileFormData>>) : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <!-- avatar: inputAttributes() — single file (multiple: false) -->
      <div class="space-y-1">
        <label class="block" for={form.field('avatar').id}>Avatar</label>
        <input
          {...form.field('avatar').inputAttributes()}
          aria-describedby={form.field('avatar').id + 'description'}
          class="control"
          accept="image/*"
        />
        <div id={form.field('avatar').id + 'description'}>
          {#if form.shownErrors['avatar']}
            <div class="text-red-600">{form.shownErrors['avatar']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Required. Upload a file larger than 2 MB to trigger a server-side
            error.
          </div>
        </div>
      </div>

      <!-- attachments: inputAttributes() — multiple files (multiple: true) -->
      <div class="space-y-1">
        <label class="block" for={form.field('attachments').id}>
          Attachments (optional)
        </label>
        <input
          {...form.field('attachments').inputAttributes()}
          aria-describedby={form.field('attachments').id + 'description'}
          class="control"
        />
        <div id={form.field('attachments').id + 'description'}>
          {#if form.shownErrors['attachments']}
            <div class="text-red-600">{form.shownErrors['attachments']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Multiple files allowed. The <code>multiple</code> attribute is set
            automatically because the field is
            <code>z.array(z.instanceof(File))</code>.
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="button primary" type="submit">
          <span class="icon-[bi--save]"></span>
          Upload
        </button>
      </div>
    </form>
  </div>

  <DemoFormData handler={form} />
</div>
