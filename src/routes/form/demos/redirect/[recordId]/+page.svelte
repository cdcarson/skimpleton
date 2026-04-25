<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import Dropdown from '$demo/components/Dropdown.svelte';
  import { uniqueId } from '$demo/utils.js';

  let { data } = $props();
  let record = $derived(data.record);
  let dropdownId = uniqueId();
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
    <div class="prose dark:prose-invert">
      <div class="flex items-end justify-between">
        <strong>{record.name}</strong>
        <div class="not-prose">
          <Dropdown id={dropdownId}>
            <ul class="vertical-menu">
              <li>
                <a
                  href={resolve('/form/demos/redirect/[recordId]/edit', {
                    recordId: record.id
                  })}
                >
                  <span class="icon-[bi--pencil]"></span>
                  Edit Record
                </a>
              </li>
              <li>
                <a
                  href={resolve('/form/demos/redirect/[recordId]/delete', {
                    recordId: record.id
                  })}
                >
                  <span class="icon-[bi--trash]"></span>
                  Delete Record
                </a>
              </li>
            </ul>
          </Dropdown>
          <button
            class="button"
            popovertarget={dropdownId}
            style="anchor-name: --{dropdownId}-anchor"
          >
            Actions
          </button>
        </div>
      </div>
      <dl>
        <dt>ID</dt>
        <dd>{record.id}</dd>
        <dt>Name</dt>
        <dd>{record.name}</dd>
        <dt>Email</dt>
        <dd>{record.email}</dd>
      </dl>
    </div>
    <div>Documentation here</div>
  </div>
</Route>
