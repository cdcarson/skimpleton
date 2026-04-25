### Add Record

Validates and saves a new record, then redirects to the record detail page.

#### Server (`+page.server.ts`)

`ServerFormHandler` validates the submitted form data against `contactFormSchema`. On success, a new record is appended to the session store and the user is redirected.

```ts
export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      contactFormSchema,
      await event.request.formData(),
      event
    );
    if (!handler.valid) {
      return handler.fail();
    }
    const id = crypto.randomUUID();
    updateRecords(event, [...records, { ...handler.data, id }]);
    return handler.redirect(
      resolve('/form/demos/redirect/[recordId]', { recordId: id }),
      'Record added!'
    );
  }
};
```

#### Client (`AddRecordForm.svelte`)

`ClientFormHandler` takes the schema and the server's `actionData` to manage field attributes and validation errors. `form.attributes()` wires up the form element; `form.field(name)` provides the `id`, `name`, and `aria-*` attributes for each input.

```svelte
<script lang="ts">
  const form = new ClientFormHandler(contactFormSchema, actionData ?? undefined);
</script>

<form {...form.attributes()}>
  <label for={form.field('name').id}>Name</label>
  <input {...form.field('name').inputAttributes('text')} class="control" />
  {#if form.shownErrors['name']}
    <div class="text-red-600">{form.shownErrors['name']}</div>
  {/if}
</form>
```
