<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import documentation from './documentation.md?raw';
  import Markdown from '$demo/components/Markdown.svelte';
  import Dropdown from '$demo/components/Dropdown.svelte';
  import { uniqueId } from '$demo/utils.js';
  let { data } = $props();
</script>

<Route
  fullWidth
  pageTitle="Redirect Forms"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    { href: resolve('/form/demos/redirect'), label: 'Redirect' }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div class="prose dark:prose-invert">
      <div class="flex items-end justify-between">
        <p>
          {data.records.length} record{`${data.records.length === 1 ? '' : 's'}`}
        </p>
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
            {@const dropdownId = uniqueId()}
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
                <div class="not-prose">
                  <Dropdown id={dropdownId}>
                    <ul class="vertical-menu">
                      <li>
                        <a
                          href={resolve(
                            '/form/demos/redirect/[recordId]/edit',
                            {
                              recordId: record.id
                            }
                          )}
                        >
                          <span class="icon-[bi--pencil]"></span>
                          Edit Record
                        </a>
                      </li>
                      <li>
                        <a
                          href={resolve(
                            '/form/demos/redirect/[recordId]/delete',
                            {
                              recordId: record.id
                            }
                          )}
                        >
                          <span class="icon-[bi--trash]"></span>
                          Delete Record
                        </a>
                      </li>
                    </ul>
                  </Dropdown>
                  <button
                    class="button ghost"
                    popovertarget={dropdownId}
                    style="anchor-name: --{dropdownId}-anchor"
                    aria-label="Actions"
                  >
                    <span class="icon-[bi--three-dots-vertical]"></span>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div>
      <Markdown markdown={documentation} />
    </div>
  </div>
</Route>
