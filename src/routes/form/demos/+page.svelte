<script lang="ts">
  import { resolve } from '$app/paths';
  import Route from '$demo/components/Route.svelte';
</script>

<Route
  pageTitle="Form Demos"
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
    }
  ]}
>
  <ul>
    <li><a href={resolve('/form/demos/boolean')}>Boolean</a></li>
  </ul>
</Route>
