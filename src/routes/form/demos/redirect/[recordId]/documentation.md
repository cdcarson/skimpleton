### Record Detail

A read-only view of a single record. This is the landing page after a successful add or edit — `handler.redirect()` sends the user here with a flash message.

#### Server (`+page.server.ts`)

The `load` function looks up the record by `recordId` param and throws a 404 if not found. There is no form action on this route.

```ts
export const load = async (event: RequestEvent) => {
  const record = records.find((r) => r.id === event.params.recordId);
  if (!record) error(404, 'Record not found!');
  return { record };
};
```
