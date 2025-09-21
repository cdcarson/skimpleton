<script lang="ts">
  import { resolve } from '$app/paths';
  import RedirectActionForm from './RedirectActionForm.svelte';
  import Page from '$lib/ui/layout/Page.svelte';
  let { data, form } = $props();
  let actionData: any = $derived(form);
  
</script>

<Page
  title="Edit Form"
  breadcrumbs={[
    { label: 'Home', href: resolve('/') },
    { label: 'Forms', href: resolve('/forms') },
    { label: 'Demos', href: resolve('/forms/demos') },
    {
      label: 'Redirect Actions',
      href: resolve('/forms/demos/redirect-action')
    },
    { label: 'Edit', href: resolve('/forms/demos/redirect-action/edit') }
  ]}
>
  <div class="prose"></div>

  <div>
    <pre>{JSON.stringify(data.data, null, 2)}</pre>
  </div>
  <div>
    <RedirectActionForm {data} {actionData} />
  </div>
</Page>
