<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { emptySchema, type ContactRecord } from '../../schema.ts';
  import { resolve } from '$app/paths';
  type Props = {
    record: ContactRecord;
  };
  let { record }: Props = $props();
  const form = new ClientFormHandler(emptySchema);
</script>

<form {...form.attributes()} class="space-y-4 p-4">
  <div class="space-y-1 border rounded-md border-red-500 p-4 text-red-700">
    <p>
      Are you sure you want to delete the record for
      <strong>{record.name}</strong>?
    </p>
    <p>This action is not undoable!</p>
  </div>

  <div class="flex justify-between">
    <a
      class="button"
      href={resolve('/form/demos/redirect/[recordId]', { recordId: record.id })}
      >Cancel</a
    >
    <button class="button destructive" type="submit">
      <span class="icon-[bi--trash]"></span>
      Delete
    </button>
  </div>
</form>
