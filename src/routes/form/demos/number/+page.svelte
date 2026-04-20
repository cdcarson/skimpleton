<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import NumberForm from './NumberForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';
  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Number Input"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/number'), label: 'Number' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div><NumberForm actionData={form} savedData={data.saved} /></div>
    <div><CodeTabs tabs={data.code} /></div>
  </div>
</Route>
