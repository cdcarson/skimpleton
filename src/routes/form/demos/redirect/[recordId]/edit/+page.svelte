<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import EditRecordForm from './EditRecordForm.svelte';
  import Markdown from '$demo/components/Markdown.svelte';
  import documentation from './documentation.md?raw';

  let { data, form } = $props();
  let record = $derived(data.record);
  let conflictingEmail = $derived(data.records.find(r => r.id !== record.id)?.email)
</script>

<Route
  fullWidth
  pageTitle={`Record: ${record.name}`}
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/redirect'), label: 'Redirect' },
    {
      href: resolve('/form/demos/redirect/[recordId]', { recordId: record.id }),
      label: record.name
    },
    {
      href: resolve('/form/demos/redirect/[recordId]/edit', {
        recordId: record.id
      }),
      label: 'Edit'
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <EditRecordForm record={data.record} actionData={form} {conflictingEmail} />
    </div>
    <div>
      <Markdown markdown={documentation} />
    </div>
  </div>
</Route>
