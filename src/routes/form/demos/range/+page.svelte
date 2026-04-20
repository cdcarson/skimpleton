<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import RangeForm from './RangeForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';
  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Range Input"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/range'), label: 'Range' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div><RangeForm actionData={form} savedData={data.saved} /></div>
    <div><CodeTabs tabs={data.code} /></div>
  </div>
</Route>
