<script lang="ts">
  import { processMarkdown } from '$lib/markdown/process';
  import Page from '$lib/ui/layout/Page.svelte';
  import { resolve } from '$app/paths';
</script>



<Page
  title="Form Demos"
  breadcrumbs={[
    { label: 'Home', href: resolve('/') },
    { label: 'Forms', href: resolve('/forms') },
    { label: 'Demos', href: resolve('/forms/demos') }
  ]}
>
  <div class="prose">
    <ul>
      <li>
        <a href={resolve('/forms/demos/redirect-action')}>Redirect Actions</a>
      </li>
    </ul>
  </div>
</Page>
