<script lang="ts" generics="T extends FormShape">
  import type { ClientFormHandler, FormShape } from 'skimpleton';
  import HighlightedCode from './HighlightedCode.svelte';
  import { uniqueId } from '$demo/utils.js';

  type Props = {
    handler: ClientFormHandler<T>;
  };
  let { handler }: Props = $props();
  const detailsName = uniqueId();
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
</div>
