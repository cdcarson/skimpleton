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
    <li>
      <a href={resolve('/form/demos/boolean')}>Boolean</a>
    </li>
    <li>
      <a href={resolve('/form/demos/select')}>Select</a>
    </li>
    <li>
      <a href={resolve('/form/demos/radios')}>Radios</a>
    </li>
    <li>
      <a href={resolve('/form/demos/select-multiple')}>Select (multiple)</a>
    </li>
     <li>
      <a href={resolve('/form/demos/checkboxes')}>Checkboxes</a>
    </li>
    
  </ul>
</Route>
