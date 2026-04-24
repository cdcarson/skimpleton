<script lang="ts" generics="T extends FormShape">
  import { ClientFormHandler, type FormShape } from 'skimpleton';
  import HighlightedCode from './HighlightedCode.svelte';
  import z from 'zod';

  type Props = {
    handler: ClientFormHandler<T>;
    savedData?: T;
  };
  let { handler, savedData }: Props = $props();
  const form = new ClientFormHandler(z.object({}), { data: {} });
  const replacer = (_key: string, value: unknown) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value;
</script>

<div class="accordian">
  <details open>
    <summary>Data</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.data, replacer, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details>
    <summary>Errors</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.errors, replacer, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details>
    <summary>Shown Errors</summary>
    <div>
      <HighlightedCode
        code={JSON.stringify(handler.shownErrors, replacer, 2)}
        language="JSON"
      />
    </div>
  </details>
  <details>
    <summary>Success</summary>
    <div>
      {#if handler.success}
        <HighlightedCode
          code={JSON.stringify(handler.success, replacer, 2)}
          language="JSON"
        />
      {:else}
        <span class="text-gray-500">[undefined]</span>
      {/if}
    </div>
  </details>
  <details>
    <summary>Initial / Saved Data</summary>
    <div class="space-y-2">
      <p class="text-sm text-gray-500">
        This form is saved to a cookie when you submit it successfully. On
        initialization, the form data is set to the saved values if the cookie
        exists.
      </p>
      {#if savedData}
        <HighlightedCode
          code={JSON.stringify(savedData, replacer, 2)}
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
