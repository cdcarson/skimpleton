<script lang="ts">
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';
  import NumericMultipleChoiceForm from './NumericMultipleChoiceForm.svelte';
  import CodeTabs from '$demo/components/CodeTabs.svelte';

  let { data, form } = $props();
</script>

<Route
  fullWidth
  pageTitle="Numeric Multiple Choice"
  breadcrumbs={[
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/form'), label: 'Forms' },
    { href: resolve('/form/demos'), label: 'Demos' },
    {
      href: resolve('/form/demos/numeric-multiple-choice'),
      label: 'Numeric Multiple Choice'
    }
  ]}
>
  <div class="grid items-start gap-16 lg:grid-cols-2">
    <div>
      <NumericMultipleChoiceForm actionData={form} savedData={data.saved} />
    </div>
    <div>
      <CodeTabs tabs={data.code} />
    </div>
  </div>
</Route>
