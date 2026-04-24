<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import FileForm from './FileForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="File Fields"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/file'), label: 'File' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <FileForm actionData={form} />
    </div>
    <div>
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>
