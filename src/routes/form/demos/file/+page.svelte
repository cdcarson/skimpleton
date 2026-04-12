<script lang="ts">
  import { resolve } from '$app/paths';
  import Route from '$demo/components/Route.svelte';
  import { ClientFormHandler } from 'skimpleton';
  import z from 'zod';
  // const roygbiv = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  // const pets = ['dog', 'cat', 'parrot', 'iguana'];
  const schema = z.object({
    files: z.array(z.file())
  });
  const form = new ClientFormHandler(schema, {
    data: {}
  });
</script>

<Route
  pageTitle="File Fields"
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
      href: resolve('/form/demos/file'),
      label: 'Files'
    }
  ]}
>
  <form {...form.attributes()} class="mx-auto w-sm">
    <div>
      <label for={form.field('files').id}>Upload some files...</label>
      <input {...form.field('files').attributes()} class="control" />
    </div>
  </form>

  <pre>{JSON.stringify(form.data, null, 2)}</pre>
  <pre>{JSON.stringify(form.errors, null, 2)}</pre>
</Route>
