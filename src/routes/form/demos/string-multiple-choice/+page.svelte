<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import StringMultipleChoiceForm from './StringMultipleChoiceForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="String Multiple Choice"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    {
      href: resolve('/form/demos/string-multiple-choice'),
      label: 'String Multiple Choice'
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <StringMultipleChoiceForm actionData={form} savedData={data.saved} />
    </div>
    <div>
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>
