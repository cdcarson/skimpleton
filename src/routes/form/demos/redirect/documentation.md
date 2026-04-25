### Redirect Demo

This demo shows a simple CRUD flow where successful form submissions redirect the user to another route. Data is stored in a session cookie (not a real database).

The key method is `ServerFormHandler.redirect()`, which validates the form, then redirects on success — optionally with a flash message.

```ts
export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const handler = new ServerFormHandler(
      someSchema,
      await event.request.formData(),
      event
    );
    //...
    return handler.redirect(resolve('/some/other/path'), 'Success message!');
  }
};
```

Each sub-route covers a specific operation: listing, adding, viewing, editing, and deleting records. See the individual pages for implementation details.
