<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';

  let { data } = $props();
  let record = $derived(data.record);
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
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div class="flex items-start justify-between gap-x-8">
      <div>
        <dl class="horizontal">
          <dt>ID</dt>
          <dd>{record.id}</dd>
          <dt>Name</dt>
          <dd>{record.name}</dd>
          <dt>Email</dt>
          <dd>{record.email}</dd>
        </dl>
      </div>
      <div class="grid gap-y-4">
        <a
          class="button"
          href={resolve('/form/demos/redirect/[recordId]/edit', {
            recordId: record.id
          })}
        >
          <span class="icon-[bi--pencil]"></span>
          Edit Record
        </a>
        <a
          class="button"
          href={resolve('/form/demos/redirect/[recordId]/delete', {
            recordId: record.id
          })}
        >
          <span class="icon-[bi--trash]"></span>
          Delete Record
        </a>
      </div>
    </div>
    <div>Docs here</div>
  </div>
</Route>
