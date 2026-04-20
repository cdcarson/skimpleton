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
    <li><a href={resolve('/form/demos/text')}>Text</a></li>
    <li><a href={resolve('/form/demos/email')}>Email</a></li>
    <li><a href={resolve('/form/demos/password')}>Password</a></li>
    <li><a href={resolve('/form/demos/search')}>Search</a></li>
    <li><a href={resolve('/form/demos/tel')}>Tel</a></li>
    <li><a href={resolve('/form/demos/url')}>URL</a></li>
    <li><a href={resolve('/form/demos/date')}>Date</a></li>
    <li><a href={resolve('/form/demos/time')}>Time</a></li>
    <li><a href={resolve('/form/demos/datetime-local')}>Datetime-Local</a></li>
    <li><a href={resolve('/form/demos/month')}>Month</a></li>
    <li><a href={resolve('/form/demos/week')}>Week</a></li>
    <li><a href={resolve('/form/demos/color')}>Color</a></li>
    <li><a href={resolve('/form/demos/textarea')}>Textarea</a></li>
    <li><a href={resolve('/form/demos/boolean')}>Boolean</a></li>
    <li><a href={resolve('/form/demos/select')}>Select</a></li>
    <li><a href={resolve('/form/demos/radios')}>Radios</a></li>
    <li><a href={resolve('/form/demos/select-multiple')}>Select (multiple)</a></li>
    <li><a href={resolve('/form/demos/checkboxes')}>Checkboxes</a></li>
    <li><a href={resolve('/form/demos/file')}>File (single)</a></li>
    <li><a href={resolve('/form/demos/file-multiple')}>File (multiple)</a></li>
  </ul>
</Route>
