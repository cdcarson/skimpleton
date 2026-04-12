<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { booleanFormSchema } from './schema.js';
  import Route from '$demo/components/Route.svelte';
  import { resolve } from '$app/paths';

  let { data, form } = $props();

  // svelte-ignore state_referenced_locally
  const f = new ClientFormHandler(
    booleanFormSchema,
    form || {
      data: data.saved || {}
    }
  );
</script>

<Route
  pageTitle="Boolean Fields"
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
    },
    {
      href: resolve('/form/demos/boolean'),
      label: 'Booleans'
    }
  ]}
>
  <form {...f.attributes()} class="mx-auto w-sm space-y-6">
    <label class="switch">
      <input {...f.field('thinkTheEarthIsFlat').attributes()} />
      I think the Earth is flat.
    </label>
    <label class="switch">
      <input {...f.field('agreeToTerms').attributes()} />
      I agree to your onerous terms.
    </label>
    <div>
      <button class="button primary w-full" type="submit">
        Save
      </button>
    </div>
  </form>

  <pre>{JSON.stringify(f.data, null, 2)}</pre>
  <pre>{JSON.stringify(f.errors, null, 2)}</pre>
</Route>
