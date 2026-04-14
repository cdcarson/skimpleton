<script lang="ts" generics="T extends FormShape">
  import type { ClientFormHandler, FormShape } from 'skimpleton';
  import type { Snippet } from 'svelte';
  import HighlightedCode from './HighlightedCode.svelte';

  type Props = {
    handler: ClientFormHandler<T>;
    children: Snippet;
  };
  let { handler, children }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
  <div>
    {@render children()}
  </div>
  <div class="space-y-4">
    <section class="space-y-1">
      <h2 class="text-sm font-bold">Data</h2>
      <HighlightedCode
        code={JSON.stringify(handler.data, null, 2)}
        language="JSON"
      ></HighlightedCode>
    </section>
    <section class="space-y-1">
      <h2 class="text-sm font-bold">Errors</h2>
      <HighlightedCode
        code={JSON.stringify(handler.errors, null, 2)}
        language="JSON"
      ></HighlightedCode>
    </section>
    <section class="space-y-1">
      <h2 class="text-sm font-bold">Success</h2>
      {#if handler.success}
        <HighlightedCode
          code={JSON.stringify(handler.success, null, 2)}
          language="JSON"
        ></HighlightedCode>
      {:else}
        [not defined]
      {/if}
    </section>
  </div>
</div>
