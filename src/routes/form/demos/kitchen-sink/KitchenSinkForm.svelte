<script lang="ts">
  import { ClientFormHandler } from 'skimpleton';
  import { kitchenSinkSchema, type KitchenSinkData } from './schema.js';
  import type { ActionData } from './$types.js';

  type Props = {
    actionData: ActionData;
  };
  let { actionData }: Props = $props();
  // svelte-ignore state_referenced_locally
  const form = new ClientFormHandler(
    kitchenSinkSchema,
    actionData ? actionData : { data: {} }
  );

  const plan = form.field('plan');
  const interests = form.field('interests');
  const resultMode = form.field('resultMode');
</script>

<div class="space-y-8">
  <form {...form.attributes()} class="w-sm space-y-6">
    <!-- StringField: text -->
    <div class="space-y-1">
      <label for={form.field('name').id}>Name</label>
      <input
        {...form.field('name').attributes({ as: 'text' })}
        class="control"
        autocomplete="name"
      />
    </div>

    <!-- StringField: email (enter bob@example.com to trigger a server error) -->
    <div class="space-y-1">
      <label for={form.field('email').id}>Email</label>
      <input
        {...form.field('email').attributes({ as: 'email' })}
        class="control"
        autocomplete="email"
      />
      <p class="text-xs opacity-60">
        Hint: enter <code>bob@example.com</code> to trigger a server-set error.
      </p>
    </div>

    <!-- StringField: textarea -->
    <div class="space-y-1">
      <label for={form.field('bio').id}>Bio</label>
      <textarea
        {...form.field('bio').attributes({ as: 'textarea' })}
        class="control"
        rows="3"
      ></textarea>
    </div>

    <!-- BooleanField: checkbox -->
    <div>
      <label class="flex items-center gap-2">
        <input {...form.field('agreeToTerms').attributes()} />
        Agree to terms
      </label>
    </div>

    <!-- NumericField: number input -->
    <div class="space-y-1">
      <label for={form.field('quantity').id}>Quantity (1–100)</label>
      <input
        {...form.field('quantity').attributes({ as: 'number' })}
        class="control"
        min="1"
        max="100"
        step="1"
      />
    </div>

    <!-- NumericField: range input (bigint) -->
    <div class="space-y-1">
      <label for={form.field('rating').id}
        >Rating (1–5): {form.data.rating ?? ''}</label
      >
      <input
        {...form.field('rating').attributes({ as: 'range' })}
        min="1"
        max="5"
        step="1"
      />
    </div>

    <!-- SingleChoiceField: radio group -->
    <fieldset class="space-y-2">
      <legend>Plan</legend>
      {#each plan.options as value (value)}
        <label class="flex items-center gap-2">
          <input {...plan.radioAttributes(value)} />
          {value}
        </label>
      {/each}
    </fieldset>

    <!-- MultipleChoiceField: checkbox group -->
    <fieldset class="space-y-2">
      <legend>Interests (pick at least one)</legend>
      {#each interests.options as value (value)}
        <label class="flex items-center gap-2">
          <input {...interests.checkboxAttributes(value)} />
          {value}
        </label>
      {/each}
    </fieldset>

    <!-- FileField: single file -->
    <div class="space-y-1">
      <label for={form.field('avatar').id}>Avatar</label>
      <input
        {...form.field('avatar').attributes()}
        class="control"
        accept="image/*"
      />
    </div>

    <!-- SingleChoiceField: result mode (controls server response path) -->
    <fieldset class="space-y-2">
      <legend>Server result mode</legend>
      {#each resultMode.options as value (value)}
        <label class="flex items-center gap-2">
          <input {...resultMode.radioAttributes(value)} />
          {value === 'succeed'
            ? 'succeed() — stay on page'
            : 'redirect() — go to /form/demos'}
        </label>
      {/each}
    </fieldset>

    <div>
      <button class="button primary w-full" type="submit">Submit</button>
    </div>
  </form>

  <section>
    <h2 class="font-bold">Data</h2>
    <pre>{JSON.stringify(
        form.data,
        (_, v) => (typeof v === 'bigint' ? `${v}n` : v),
        2
      )}</pre>
  </section>

  <section>
    <h2 class="font-bold">Errors</h2>
    <pre>{JSON.stringify(form.errors, null, 2)}</pre>
  </section>
</div>
