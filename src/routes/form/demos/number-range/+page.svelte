<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import NumberRangeForm from './NumberRangeForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="Number Range"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/number-range'), label: 'Number Range' }
  ]}
>
  <NumberRangeForm actionData={form} savedData={data.saved} />
</Route>
