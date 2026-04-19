<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import SelectForm from './SelectForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Select"
  breadcrumbs={[
    {
      href: resolve('/'),
      label: 'Home'
    },
    {
      href: resolve('/form'),
      label: 'Forms'
    },
    {
      href: resolve('/form/demos'),
      label: 'Demos'
    },
    {
      href: resolve('/form/demos/select'),
      label: 'Select'
    }
  ]}
>
  <div class="grid gap-16 lg:grid-cols-8">
    <div class="space-y-8 lg:col-span-3">
      <SelectForm actionData={form} savedData={data.saved} />
    </div>
    <div class="lg:col-span-5">
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>
