<script lang="ts" generics="T extends FormShape">
  import { ClientFormHandler, type FormShape } from 'skimpleton';
  import HighlightedCode from './HighlightedCode.svelte';
  import { uniqueId } from '$demo/utils.js';
  import z from 'zod';

  type Props = {
    handler: ClientFormHandler<T>;
    savedData?: T;
  };
  let { handler, savedData }: Props = $props();
  const detailsName = uniqueId();
  const form = new ClientFormHandler(z.object({}), { data: {} });
</script>

<div class="accordian">
  <details name={detailsName} open>
    <summary>Data</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.data, null, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details name={detailsName}>
    <summary>Errors</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.errors, null, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details name={detailsName}>
    <summary>Shown Errors</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.shownErrors, null, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details name={detailsName}>
    <summary>Success</summary>
    <div>
      {#if handler.success}
        <HighlightedCode
          code={JSON.stringify(handler.success, null, 2)}
          language="JSON"
        />
      {:else}
        <span class="text-gray-500">[undefined]</span>
      {/if}
    </div>
  </details>
  <details name={detailsName}>
    <summary>Initial / Saved Data</summary>
    <div class="space-y-2">
      <p class="text-sm text-gray-500">
        This form is saved to a cookie when you submit it successfully. On
        initialization, the form data is set to the saved values if the cookie
        exists.
      </p>
      {#if savedData}
        <HighlightedCode
          code={JSON.stringify(savedData, null, 2)}
          language="json"
        />
        <div>
          <form {...form.attributes()} action="?/deleteSaved">
            <button type="submit" class="button sm">Delete</button>
          </form>
        </div>
      {/if}
    </div>
  </details>
</div>
