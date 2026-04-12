<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import TextForm from './TextForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="Text Fields"
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
      href: resolve('/form/demos/text'),
      label: 'Text'
    }
  ]}
>
  <TextForm actionData={form} savedData={data.saved} />
</Route>
