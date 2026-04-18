<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { schema, type Shape } from './schema.js';
  import type { ActionData } from './$types.js';
  import { US_STATE_NAMES } from '$demo/data/states.js';
  import DemoFormWrapper from '$demo/components/DemoFormWrapper.svelte';
  type Props = {
    actionData: ActionData;
    savedData?: Shape;
  };
  let { actionData, savedData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    schema,
    actionData ? actionData : savedData ? { data: savedData } : { data: {} }
  );
</script>

<DemoFormWrapper handler={form}>
  <form {...form.attributes()} class="w-sm space-y-4">
    <div class="space-y-1">
      <label class="block" for={form.field('state').id}>State</label>
      <select {...form.field('state').selectAttributes()} class="control">
        <option value="">Please select...</option>
        {#each US_STATE_NAMES as o (o.value)}
          <option {...form.field('state').optionAttributes(o.value)}>
            {o.label}
          </option>
        {/each}
      </select>
    </div>

    <div>
      <button class="button primary w-full" type="submit"> Save </button>
    </div>
  </form>
</DemoFormWrapper>
