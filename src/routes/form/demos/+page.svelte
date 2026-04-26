<script lang="ts">
  import { resolve } from '$app/paths';
  import Route from '$demo/components/Route.svelte';
</script>

<Route
  pageTitle="Form Demos"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' }
  ]}
>
  <ul>
    <li><a href={resolve('/form/demos/text')}>Text Fields</a></li>
    <li>
      <a href={resolve('/form/demos/string-multiple-choice')}
        >String Multiple Choice</a
      >
    </li>
    <li><a href={resolve('/form/demos/boolean')}>Boolean Fields</a></li>
    <li><a href={resolve('/form/demos/numeric')}>Numeric Fields</a></li>
    <li>
      <a href={resolve('/form/demos/numeric-multiple-choice')}
        >Numeric Multiple Choice</a
      >
    </li>
    <li><a href={resolve('/form/demos/file')}>File Fields</a></li>
    <li><a href={resolve('/form/demos/redirect')}>Redirect Forms</a></li>
  </ul>
</Route>
