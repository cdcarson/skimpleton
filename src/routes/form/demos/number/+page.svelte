<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import NumberForm from './NumberForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="Number"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/number'), label: 'Number' }
  ]}
>
  <NumberForm actionData={form} savedData={data.saved} />
</Route>
