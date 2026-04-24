<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import {
    numericMultipleChoiceFormSchema,
    type NumericMultipleChoiceFormData
  } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: NumericMultipleChoiceFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    numericMultipleChoiceFormSchema,
    actionData
      ? (actionData as Partial<FormState<NumericMultipleChoiceFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );

  const priorityOptions = [1, 2, 3, 4, 5] as const;
  const allIds = [100n, 200n, 300n] as const;
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <!-- ratings: checkboxAttributes(value) — z.array(z.number()) -->
      <div class="space-y-1">
        <fieldset
          class="border border-gray-200 p-4"
          aria-describedby={form.field('ratings').id + '-description'}
        >
          <legend class="px-1">Ratings (1–5)</legend>
          <div class="flex flex-wrap gap-x-8 gap-y-2">
            {#each [1, 2, 3, 4, 5] as rating}
              <label class="flex items-center gap-2">
                <input {...form.field('ratings').checkboxAttributes(rating)} />
                {rating}
              </label>
            {/each}
          </div>
        </fieldset>
        <div id={form.field('ratings').id + '-description'}>
          {#if form.shownErrors['ratings']}
            <div class="text-red-600">{form.shownErrors['ratings']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Select both 1 and 5 to trigger a server-side error.
          </div>
        </div>
      </div>

      <!-- priorities: selectAttributes() + optionAttributes(value) with multiple -->
      <div class="space-y-1">
        <label class="block" for={form.field('priorities').id}>
          Priorities
        </label>
        <select
          {...form.field('priorities').selectAttributes()}
          aria-describedby={form.field('priorities').id + 'description'}
          class="control"
          size={priorityOptions.length}
        >
          {#each priorityOptions as p}
            <option {...form.field('priorities').optionAttributes(p)}>
              Priority {p}
            </option>
          {/each}
        </select>
        <div id={form.field('priorities').id + 'description'}>
          {#if form.shownErrors['priorities']}
            <div class="text-red-600">{form.shownErrors['priorities']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Hold Ctrl/Cmd to select multiple.
          </div>
        </div>
      </div>

      <!-- selectedIds: checkboxAttributes(value) — z.array(z.bigint()) -->
      <div class="space-y-1">
        <fieldset
          class="border border-gray-200 p-4"
          aria-describedby={form.field('selectedIds').id + '-description'}
        >
          <legend class="px-1">Selected IDs</legend>
          <div class="flex flex-wrap gap-x-8 gap-y-2">
            {#each allIds as id}
              <label class="flex items-center gap-2">
                <input {...form.field('selectedIds').checkboxAttributes(id)} />
                ID {id}
              </label>
            {/each}
          </div>
        </fieldset>
        <div id={form.field('selectedIds').id + '-description'}>
          {#if form.shownErrors['selectedIds']}
            <div class="text-red-600">{form.shownErrors['selectedIds']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Demonstrates <code>checkboxAttributes</code> with bigint values.
          </div>
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
