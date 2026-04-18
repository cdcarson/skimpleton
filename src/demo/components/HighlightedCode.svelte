<script lang="ts">
  import { highlightCode } from '$demo/utils.js';

  type Props = {
    code: string;
    language: string;
  };
  let { code, language }: Props = $props();
  const highlighted = $derived(highlightCode(code, language));
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<pre class="border border-gray-200 text-sm"><code class="hljs"
    >{@html highlighted}</code
  ></pre>
<!-- eslint-enable svelte/no-at-html-tags -->
