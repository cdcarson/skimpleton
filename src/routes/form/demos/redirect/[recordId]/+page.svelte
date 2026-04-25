<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';

  let { data } = $props();
  let record = $derived(data.record);
</script>

<Route
  fullWidth
  pageTitle={`Record: ${record.name}`}
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/redirect'), label: 'Redirect' },
    {
      href: resolve('/form/demos/redirect/[recordId]', { recordId: record.id }),
      label: record.name
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <pre>{JSON.stringify(record, null, 2)}</pre>
    </div>
    <div>Documentation here</div>
  </div>
</Route>
