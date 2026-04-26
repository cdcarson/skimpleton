<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import AddRecordForm from './AddRecordForm.svelte';
  import Markdown from '$demo/components/Markdown.svelte';
  import documentation from './documentation.md?raw';

  let { form, data } = $props();
  let conflictingEmail = $derived(data.records.at(0)?.email);
</script>

<Route
  fullWidth
  pageTitle="Add Record"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/redirect'), label: 'Redirect' },
    {
      href: resolve('/form/demos/redirect/add'),
      label: 'Add'
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <AddRecordForm actionData={form} {conflictingEmail} />
    </div>
    <div>
      <Markdown markdown={documentation} />
    </div>
  </div>
</Route>
