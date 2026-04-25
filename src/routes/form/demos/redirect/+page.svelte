<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';

  let { data } = $props();
</script>

<Route
  fullWidth
  pageTitle="handler.redirect()"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/redirect'), label: 'Redirect' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div class="prose dark:prose-invert">
      <div class="flex justify-between items-end">
        <p>{data.records.length} record{`${data.records.length === 1 ? '' : 's'}`}</p>
        <div class="not-prose">
          <a class="button primary" href={resolve('/form/demos/redirect/add')}>
            <span class="icon-[bi--plus-lg]"></span>
            Add Record
          </a>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each data.records as record (record.id)}
            <tr>
              <td>
                <a
                  href={resolve('/form/demos/redirect/[recordId]', {
                    recordId: record.id
                  })}
                >
                  {record.name}
                </a>
              </td>
              
              <td>
                {record.email}
              </td>
              <td>
                <a
                  href={resolve('/form/demos/redirect/[recordId]/edit', {
                    recordId: record.id
                  })}
                >
                  Edit
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div>Docs here</div>
  </div>
</Route>
