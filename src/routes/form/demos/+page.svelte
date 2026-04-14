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
      <a href={resolve('/form/demos/text')}>Text Fields</a>
    </li>
    <li>
      <a href={resolve('/form/demos/boolean')}>Boolean Field</a>
    </li>
     <li>
      <a href={resolve('/form/demos/checkbox-group')}>Checkboxes</a>
    </li>
     <li>
      <a href={resolve('/form/demos/radio-group')}>Radios</a>
    </li>
    <li>
      <a href={resolve('/form/demos/file')}>File Field</a>
    </li>
    <li>
      <a href={resolve('/form/demos/number')}>Number</a>
    </li>
    <li>
      <a href={resolve('/form/demos/number-range')}>Number Range</a>
    </li>
    <li>
      <a href={resolve('/form/demos/bigint')}>BigInt</a>
    </li>
    <li>
      <a href={resolve('/form/demos/bigint-range')}>BigInt Range</a>
    </li>
    <li>
      <a href={resolve('/form/demos/kitchen-sink')}>Kitchen Sink</a>
    </li>
  </ul>
</Route>
