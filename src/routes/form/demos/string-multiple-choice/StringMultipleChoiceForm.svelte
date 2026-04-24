<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import {
    stringMultipleChoiceFormSchema,
    type StringMultipleChoiceFormData
  } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: StringMultipleChoiceFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    stringMultipleChoiceFormSchema,
    actionData
      ? (actionData as Partial<FormState<StringMultipleChoiceFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <!-- favoriteColors: checkboxAttributes(value) -->
      <div class="space-y-1">
        <fieldset
          class="border border-gray-200 p-4"
          aria-describedby={form.field('favoriteColors').id + '-description'}
        >
          <legend class="px-1">Favorite Colors</legend>
          <div class="flex flex-wrap gap-x-8 gap-y-2">
            {#each ['red', 'green', 'blue', 'yellow'] as color}
              <label class="flex items-center gap-2">
                <input
                  {...form.field('favoriteColors').checkboxAttributes(color)}
                />
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </label>
            {/each}
          </div>
        </fieldset>
        <div id={form.field('favoriteColors').id + '-description'}>
          {#if form.shownErrors['favoriteColors']}
            <div class="text-red-600">
              {form.shownErrors['favoriteColors']}
            </div>
          {/if}
          <div class="text-sm text-gray-600">
            Select both red and green to trigger a server-side error.
          </div>
        </div>
      </div>

      <!-- categories: selectAttributes() + optionAttributes(value) with multiple -->
      <div class="space-y-1">
        <label class="block" for={form.field('categories').id}>
          Categories
        </label>
        <select
          {...form.field('categories').selectAttributes()}
          aria-describedby={form.field('categories').id + 'description'}
          class="control"
          size="4"
        >
          <option {...form.field('categories').optionAttributes('news')}
            >News</option
          >
          <option {...form.field('categories').optionAttributes('sports')}
            >Sports</option
          >
          <option {...form.field('categories').optionAttributes('tech')}
            >Tech</option
          >
          <option {...form.field('categories').optionAttributes('arts')}
            >Arts</option
          >
        </select>
        <div id={form.field('categories').id + 'description'}>
          {#if form.shownErrors['categories']}
            <div class="text-red-600">{form.shownErrors['categories']}</div>
          {/if}
          <div class="text-sm text-gray-600">
            Hold Ctrl/Cmd to select multiple.
          </div>
        </div>
      </div>

      <!--
        hiddenAttributes(value) is also available for programmatically-set arrays,
        e.g. rendering one hidden input per selected item:
          {#each selectedItems as item}
            <input {...form.field('fieldName').hiddenAttributes(item)} />
          {/each}
      -->

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
