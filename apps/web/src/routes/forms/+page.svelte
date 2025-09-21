<script lang="ts">
  import { processMarkdown } from '$lib/markdown/process';
  import content from './content.md?raw';
  import Page from '$lib/ui/layout/Page.svelte';
  import { resolve } from '$app/paths';
</script>


<Page
  title="Forms"
  breadcrumbs={[
    { label: 'Home', href: resolve('/') },
    { label: 'Forms', href: resolve('/forms') }
  ]}
>
  <div class="prose">{@html processMarkdown(content)}</div>
  <div>
    <a class="button" href={resolve('/forms/demos')}>Demos</a>
  </div>
</Page>
