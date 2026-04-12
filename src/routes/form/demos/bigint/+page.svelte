<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import BigintForm from './BigintForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="BigInt"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/bigint'), label: 'BigInt' }
  ]}
>
  <BigintForm actionData={form} savedData={data.saved} />
</Route>
