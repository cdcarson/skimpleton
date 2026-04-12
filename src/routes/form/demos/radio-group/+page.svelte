<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import RadioGroupForm from './RadioGroupForm.svelte';

  let { data, form } = $props();
</script>

<Route
  pageTitle="Radio Group"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/radio-group'), label: 'Radio Group' }
  ]}
>
  <RadioGroupForm actionData={form} savedData={data.saved} />
</Route>
