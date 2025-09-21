<script lang="ts">
  import Page from '$lib/ui/layout/Page.svelte';
  import { resolve } from '$app/paths';
  let { data } = $props();
</script>



<Page
  title="Redirect Actions"
  breadcrumbs={[
    { label: 'Home', href: resolve('/') },
    { label: 'Forms', href: resolve('/forms') },
    { label: 'Demos', href: resolve('/forms/demos') },
    { label: 'Redirect Actions', href: resolve('/forms/demos/redirect-action') }
  ]}
>
  <div class="prose"></div>

  <div>
    <pre>{JSON.stringify(data.data, null, 2)}</pre>
  </div>
  <div>
    <a class="button" href={resolve('/forms/demos/redirect-action/edit')}
      >
      Edit
      </a
    >
  </div>
</Page>
