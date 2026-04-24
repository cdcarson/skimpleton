<script lang="ts">
  import { ClientFormHandler, type FormState } from 'skimpleton';
  import { booleanFormSchema, type BooleanFormFormData } from './schema.ts';
  import type { ActionData } from './$types.js';
  import DemoFormData from '$demo/components/DemoFormData.svelte';

  type Props = {
    actionData: ActionData;
    savedData?: BooleanFormFormData;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    booleanFormSchema,
    actionData
      ? (actionData as Partial<FormState<BooleanFormFormData>>)
      : savedData
        ? { data: savedData }
        : undefined
  );
</script>

<div class="space-y-8">
  <div class="border border-gray-200">
    <h3 class="bg-gray-200 px-4 py-2 font-semibold">Demo Form</h3>
    <form {...form.attributes()} action="?/selectDemo" class="space-y-4 p-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <input {...form.field('iLikeCats').checkboxAttributes()} />
          <label for={form.field('iLikeCats').id}>I like cats</label>
        </div>

        <div id={form.field('iLikeCats').id + 'desc'}>
          {#if form.shownErrors['iLikeCats']}
            <div class="text-red-600">
              {form.shownErrors['iLikeCats']}
            </div>
          {/if}
        </div>
      </div>

      <div class="space-y-1">
        <fieldset
          class="border border-gray-200 p-4"
          aria-describedby={form.field('iAgreeToTheOnerousTerms').id +
            '-description'}
        >
          <legend class="px-1">I agree to the onerous terms</legend>
          <div class="flex gap-x-8">
            <label class="flex items-center gap-2">
              <input
                {...form
                  .field('iAgreeToTheOnerousTerms')
                  .radioAttributes(false)}
              />
              No
            </label>
            <label class="flex items-center gap-2">
              <input
                {...form.field('iAgreeToTheOnerousTerms').radioAttributes(true)}
              />
              Yes
            </label>
          </div>
        </fieldset>
        <div id={form.field('iAgreeToTheOnerousTerms').id + '-description'}>
          {#if form.shownErrors['iAgreeToTheOnerousTerms']}
            <div class="text-red-600">
              {form.shownErrors['iAgreeToTheOnerousTerms']}
            </div>
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
