<script lang="ts">
  import { markdownToHtml } from '$demo/utils.js';

  type Props = {
    markdown: string;
  };
  let { markdown }: Props = $props();
  let htmlOut = $derived(markdownToHtml(markdown));
</script>

<div class="prose">
  <!-- eslint-disable svelte/no-at-html-tags -->
  {@html htmlOut}
  <!-- eslint-enable svelte/no-at-html-tags -->
</div>
