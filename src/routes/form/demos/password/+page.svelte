<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import PasswordForm from './PasswordForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';
  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Password Input"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/password'), label: 'Password' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div><PasswordForm actionData={form} savedData={data.saved} /></div>
    <div><CodeTabs tabs={data.code} /></div>
  </div>
</Route>
