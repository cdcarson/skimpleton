<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import NumericForm from './NumericForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Numeric Fields"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/numeric'), label: 'Numeric' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <NumericForm actionData={form} savedData={data.saved} />
    </div>
    <div>
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>
