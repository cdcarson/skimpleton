<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import Form from './Form.svelte';

  let { data, form } = $props();
</script>

<Route
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
  <Form actionData={form} savedData={data.saved} />
</Route>
