### Edit Record

Validates and saves changes to an existing record, then redirects back to the record detail page.

#### Server (`+page.server.ts`)

The `load` function fetches the current record and returns it for pre-populating the form. The action validates the submission, checks email uniqueness (excluding the current record), updates the session store, and redirects.

```ts
export const load = async (event: RequestEvent) => {
  const record = records.find((r) => r.id === event.params.recordId);
  if (!record) error(404, 'Record not found!');
  return { record };
};

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

    const emailConflict = records.find(
      (r) => r.email.toLowerCase() === handler.data.email.toLowerCase() && r.id !== record.id
    );
    if (emailConflict) {
      return handler.fail({
        email: `The email ${handler.data.email} is already in use by another account.`
      });
    }

    updateRecords(event, [...records.filter((r) => r.id !== record.id), { ...record, ...handler.data }]);
    return handler.redirect(
      resolve('/form/demos/redirect/[recordId]', { recordId: record.id }),
      'Record updated!'
    );
  }
};
```

#### Client (`EditRecordForm.svelte`)

The key difference from the add form is the initial data: when there's no `actionData` (i.e. the first page load), the existing record values are passed as `{ data: ... }` so the fields are pre-populated.

```svelte
<script lang="ts">
  let { actionData, record } = $props();
  const form = new ClientFormHandler(
    contactFormSchema,
    actionData ? actionData : { data: { name: record.name, email: record.email } }
  );
</script>
```
