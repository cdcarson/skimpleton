<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import CheckboxesForm from './CheckboxesForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Checkbox Group"
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
      href: resolve('/form/demos/radios'),
      label: 'Checkboxes'
    }
  ]}
>
  <div class="grid items-start lg:grid-cols-2 gap-16">
    <div>
      <CheckboxesForm actionData={form} savedData={data.saved} />
    </div>
    <div>
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>