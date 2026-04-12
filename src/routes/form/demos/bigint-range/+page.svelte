<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import BigintRangeForm from './BigintRangeForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="BigInt Range"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/bigint-range'), label: 'BigInt Range' }
  ]}
>
  <BigintRangeForm actionData={form} savedData={data.saved} />
</Route>
