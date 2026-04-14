<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import KitchenSinkForm from './KitchenSinkForm.svelte';

  let { form } = $props();
</script>

<Route
  pageTitle="Kitchen Sink"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/kitchen-sink'), label: 'Kitchen Sink' }
  ]}
>
  <KitchenSinkForm actionData={form} />
</Route>
