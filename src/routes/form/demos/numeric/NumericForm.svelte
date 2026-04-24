<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import { numericFormSchema, type NumericFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: NumericFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    numericFormSchema,
    actionData
      ? (actionData as Partial<FormState<NumericFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <!-- age: inputAttributes('number') — z.number() -->
      <div class="space-y-1">
        <label class="block" for={form.field('age').id}>Age</label>
        <input
          {...form.field('age').inputAttributes('number')}
          aria-describedby={form.field('age').id + 'description'}
          class="control"
          min="0"
          max="120"
        />
        <div id={form.field('age').id + 'description'}>
          {#if form.shownErrors['age']}
            <div class="text-red-600">{form.shownErrors['age']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Enter a value under 18 to trigger a server-side error.
          </div>
        </div>
      </div>

      <!-- rating: inputAttributes('range') — z.number() -->
      <div class="space-y-1">
        <label class="block" for={form.field('rating').id}>
          Rating: {form.data.rating}
        </label>
        <input
          {...form.field('rating').inputAttributes('range')}
          aria-describedby={form.field('rating').id + 'description'}
          class="w-full"
          min="0"
          max="10"
          step="0.5"
        />
        <div id={form.field('rating').id + 'description'}>
          {#if form.shownErrors['rating']}
            <div class="text-red-600">{form.shownErrors['rating']}</div>
          {/if}
        </div>
      </div>

      <!-- accountId: inputAttributes('number') — z.bigint() -->
      <div class="space-y-1">
        <label class="block" for={form.field('accountId').id}>Account ID</label>
        <input
          {...form.field('accountId').inputAttributes('number')}
          aria-describedby={form.field('accountId').id + 'description'}
          class="control"
          min="0"
        />
        <div id={form.field('accountId').id + 'description'}>
          {#if form.shownErrors['accountId']}
            <div class="text-red-600">{form.shownErrors['accountId']}</div>
          {/if}
          <div class="text-sm text-gray-600">Stored as a bigint.</div>
        </div>
      </div>

      <!-- version: inputAttributes('hidden') — z.number() -->
      <input {...form.field('version').inputAttributes('hidden')} />

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
