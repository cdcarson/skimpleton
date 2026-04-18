<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { deleteSavedFormSchema } from './schema.js';

  const form = new ClientFormHandler(deleteSavedFormSchema, { data: {} });
</script>

<form {...form.attributes()} action="?/deleteSaved">
  <button type="submit" class="button xs">Delete</button>
</form>
