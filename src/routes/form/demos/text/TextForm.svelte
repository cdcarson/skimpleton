<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import { textFormSchema, type TextFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: TextFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    textFormSchema,
    actionData
      ? (actionData as Partial<FormState<TextFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <!-- username: inputAttributes('text') -->
      <div class="space-y-1">
        <label class="block" for={form.field('username').id}>Username</label>
        <input
          {...form.field('username').inputAttributes('text')}
          aria-describedby={form.field('username').id + 'description'}
          class="control"
        />
        <div id={form.field('username').id + 'description'}>
          {#if form.shownErrors['username']}
            <div class="text-red-600">{form.shownErrors['username']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Try "admin" to trigger a server-side error.
          </div>
        </div>
      </div>

      <!-- email: inputAttributes('email') -->
      <div class="space-y-1">
        <label class="block" for={form.field('email').id}>Email</label>
        <input
          {...form.field('email').inputAttributes('email')}
          aria-describedby={form.field('email').id + 'description'}
          class="control"
        />
        <div id={form.field('email').id + 'description'}>
          {#if form.shownErrors['email']}
            <div class="text-red-600">{form.shownErrors['email']}</div>
          {/if}
        </div>
      </div>

      <!-- bio: textareaAttributes() -->
      <div class="space-y-1">
        <label class="block" for={form.field('bio').id}>Bio (optional)</label>
        <textarea
          {...form.field('bio').textareaAttributes()}
          aria-describedby={form.field('bio').id + 'description'}
          class="control"
          rows="3"
        ></textarea>
        <div id={form.field('bio').id + 'description'}>
          {#if form.shownErrors['bio']}
            <div class="text-red-600">{form.shownErrors['bio']}</div>
          {/if}
          <div class="text-sm text-gray-600">Max 300 characters.</div>
        </div>
      </div>

      <!-- country: selectAttributes() + optionAttributes() -->
      <div class="space-y-1">
        <label class="block" for={form.field('country').id}>Country</label>
        <select
          {...form.field('country').selectAttributes()}
          aria-describedby={form.field('country').id + 'description'}
          class="control"
        >
          <option {...form.field('country').optionAttributes('us')}
            >United States</option
          >
          <option {...form.field('country').optionAttributes('ca')}
            >Canada</option
          >
          <option {...form.field('country').optionAttributes('gb')}
            >United Kingdom</option
          >
          <option {...form.field('country').optionAttributes('au')}
            >Australia</option
          >
        </select>
        <div id={form.field('country').id + 'description'}>
          {#if form.shownErrors['country']}
            <div class="text-red-600">{form.shownErrors['country']}</div>
          {/if}
        </div>
      </div>

      <!-- gender: radioAttributes() -->
      <div class="space-y-1">
        <fieldset
          class="border border-gray-200 p-4"
          aria-describedby={form.field('gender').id + '-description'}
        >
          <legend class="px-1">Gender</legend>
          <div class="flex flex-wrap gap-x-8 gap-y-2">
            <label class="flex items-center gap-2">
              <input {...form.field('gender').radioAttributes('male')} />
              Male
            </label>
            <label class="flex items-center gap-2">
              <input {...form.field('gender').radioAttributes('female')} />
              Female
            </label>
            <label class="flex items-center gap-2">
              <input {...form.field('gender').radioAttributes('nonbinary')} />
              Non-binary
            </label>
            <label class="flex items-center gap-2">
              <input {...form.field('gender').radioAttributes('prefer_not')} />
              Prefer not to say
            </label>
          </div>
        </fieldset>
        <div id={form.field('gender').id + '-description'}>
          {#if form.shownErrors['gender']}
            <div class="text-red-600">{form.shownErrors['gender']}</div>
          {/if}
        </div>
      </div>

      <!-- correlationId: inputAttributes('hidden') -->
      <input {...form.field('correlationId').inputAttributes('hidden')} />

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
