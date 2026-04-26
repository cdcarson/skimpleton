### Delete Record

Confirms and deletes a record, then redirects back to the list.

#### Server (`+page.server.ts`)

There are no form fields, so the action uses `emptySchema` and passes a fresh `FormData()` directly — skipping form parsing entirely. `emptySchema` is defined in `schema.ts`:

```ts
export const emptySchema = z.object({});
```

```ts
const handler = new ServerFormHandler(emptySchema, new FormData(), event);
if (!handler.valid) {
  return handler.fail();
}
updateRecords(
  event,
  records.filter((r) => r.id !== record.id)
);
return handler.redirect(resolve('/form/demos/redirect'), 'Record deleted!');
```

#### Client (`DeleteRecordForm.svelte`)

`ClientFormHandler` is initialized with `emptySchema` and no `actionData` — it's only used here to generate the form attributes (method, action, novalidate).

```svelte
<script lang="ts">
  const form = new ClientFormHandler(emptySchema);
</script>

<form {...form.attributes()}>
  <!-- confirmation message -->
  <button class="button destructive" type="submit">Delete</button>
</form>
```
