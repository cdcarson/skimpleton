<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import CheckboxGroupForm from './CheckboxGroupForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="Checkbox Group"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/checkbox-group'), label: 'Checkbox Group' }
  ]}
>
  <CheckboxGroupForm actionData={form} savedData={data.saved} />
</Route>
