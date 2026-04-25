import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientFormHandler } from './client-form-handler.svelte.js';
import z from 'zod';

// SvelteKit browser modules are not available in the test environment;
// mock them so the constructor can run without errors.
vi.mock('$app/forms', () => ({ enhance: vi.fn() }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
vi.mock('$lib/message/message.svelte.js', () => ({
  MessageService: {
    get: vi.fn(() => ({
      error: vi.fn(),
      wait: vi.fn(),
      success: vi.fn(),
      clear: vi.fn()
    }))
  }
}));

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const simpleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string()
});

const richSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  age: z.number(),
  tags: z.array(z.string()),
  avatar: z.file().optional()
});

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

describe('ClientFormHandler — constructor', () => {
  it('generates a formId matching skf-* pattern', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.formId).toMatch(/^skf-[a-z0-9]+$/);
  });

  it('initialises formData from initialState.data', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      data: { name: 'Alice', bio: 'Hello' }
    });
    expect(handler.formData.get('name')).toBe('Alice');
    expect(handler.formData.get('bio')).toBe('Hello');
  });

  it('uses schema defaults when no initialState is provided', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.formData.get('name')).toBe('');
    expect(handler.formData.get('bio')).toBe('');
  });

  it('pre-touches fields that have errors in initialState', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      errors: { name: 'Too short' }
    });
    expect(handler.touched.name).toBe(true);
    expect(handler.touched.bio).toBeUndefined();
  });

  it('sets externalErrors from initialState.errors', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      errors: { name: 'Server error' }
    });
    expect(handler.externalErrors.name).toBe('Server error');
  });

  it('sets success from initialState.success', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      success: { isRedirect: false, message: 'Saved!' }
    });
    expect(handler.success).toMatchObject({ message: 'Saved!' });
  });

  it('builds fieldDefinitions for every schema field', () => {
    const handler = new ClientFormHandler(richSchema);
    expect(handler.fieldDefinitions.has('name')).toBe(true);
    expect(handler.fieldDefinitions.has('active')).toBe(true);
    expect(handler.fieldDefinitions.has('age')).toBe(true);
    expect(handler.fieldDefinitions.has('tags')).toBe(true);
    expect(handler.fieldDefinitions.has('avatar')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Touch tracking
// ---------------------------------------------------------------------------

describe('ClientFormHandler — touch tracking', () => {
  let handler: ClientFormHandler<typeof simpleSchema._output>;

  beforeEach(() => {
    handler = new ClientFormHandler(simpleSchema);
  });

  it('touch() marks a single field as touched', () => {
    handler.touch('name');
    expect(handler.touched.name).toBe(true);
    expect(handler.touched.bio).toBeUndefined();
  });

  it('touchAll() marks every field as touched', () => {
    handler.touchAll();
    expect(handler.touched.name).toBe(true);
    expect(handler.touched.bio).toBe(true);
  });

  it('untouch() removes touch for a single field', () => {
    handler.touchAll();
    handler.untouch('name');
    expect(handler.touched.name).toBeUndefined();
    expect(handler.touched.bio).toBe(true);
  });

  it('untouchAll() clears all touches', () => {
    handler.touchAll();
    handler.untouchAll();
    expect(Object.keys(handler.touched).length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// errors / shownErrors / valid
// ---------------------------------------------------------------------------

describe('ClientFormHandler — errors, shownErrors, valid', () => {
  it('valid is false when required fields are empty', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.valid).toBe(false);
  });

  it('valid is true when all fields satisfy the schema', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      data: { name: 'Alice', bio: '' }
    });
    expect(handler.valid).toBe(true);
  });

  it('shownErrors is empty when nothing is touched', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.shownErrors).toEqual({});
  });

  it('shownErrors surfaces errors for touched fields', () => {
    const handler = new ClientFormHandler(simpleSchema);
    handler.touch('name');
    expect(handler.shownErrors.name).toBe('Name is required');
    expect(handler.shownErrors.bio).toBeUndefined(); // not touched
  });

  it('shownErrors surfaces all errors after touchAll()', () => {
    const handler = new ClientFormHandler(simpleSchema);
    handler.touchAll();
    expect(handler.shownErrors.name).toBe('Name is required');
  });

  it('externalErrors merge on top of computed errors', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      errors: { bio: 'Server says bio is invalid' }
    });
    handler.touch('bio');
    // bio passes schema validation (empty string is ok) but has an external error
    expect(handler.shownErrors.bio).toBe('Server says bio is invalid');
  });

  it('computedErrors reflects the current formData', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      data: { name: 'Alice', bio: '' }
    });
    // 'Alice' satisfies min(1) → no name error
    expect(handler.computedErrors.name).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// attributes()
// ---------------------------------------------------------------------------

describe('ClientFormHandler — attributes()', () => {
  it('always includes method="post"', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.attributes().method).toBe('post');
  });

  it('does not include enctype when there are no file fields', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.attributes().enctype).toBeUndefined();
  });

  it('includes enctype="multipart/form-data" when schema has a file field', () => {
    const handler = new ClientFormHandler(richSchema);
    expect(handler.attributes().enctype).toBe('multipart/form-data');
  });

  it('oninput clears externalErrors', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      errors: { name: 'Server error' }
    });
    expect(handler.externalErrors.name).toBe('Server error');

    const form = document.createElement('form');
    handler.attributes().oninput!({ currentTarget: form } as InputEvent & {
      currentTarget: HTMLFormElement;
    });
    expect(handler.externalErrors).toEqual({});
  });

  it('oninput does not clear externalErrors when there are none', () => {
    const handler = new ClientFormHandler(simpleSchema);
    const form = document.createElement('form');
    // Should not throw and externalErrors should remain empty
    handler.attributes().oninput!({ currentTarget: form } as InputEvent & {
      currentTarget: HTMLFormElement;
    });
    expect(handler.externalErrors).toEqual({});
  });

  it('onfocusout touches a non-file field', () => {
    const handler = new ClientFormHandler(simpleSchema);
    const input = document.createElement('input');
    input.name = 'name';
    expect(handler.touched.name).toBeUndefined();
    handler.attributes().onfocusout!({
      target: input
    } as unknown as FocusEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    });
    expect(handler.touched.name).toBe(true);
  });

  it('onfocusout does not touch a file field', () => {
    const handler = new ClientFormHandler(richSchema);
    const input = document.createElement('input');
    input.name = 'avatar';
    handler.attributes().onfocusout!({
      target: input
    } as unknown as FocusEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    });
    expect(handler.touched.avatar).toBeUndefined();
  });

  it('onchange touches a file field', () => {
    const handler = new ClientFormHandler(richSchema);
    const input = document.createElement('input');
    input.name = 'avatar';
    expect(handler.touched.avatar).toBeUndefined();
    handler.attributes().onchange!({ target: input } as unknown as Event & {
      currentTarget: EventTarget & HTMLFormElement;
    });
    expect(handler.touched.avatar).toBe(true);
  });

  it('onchange does not touch a non-file field', () => {
    const handler = new ClientFormHandler(richSchema);
    const input = document.createElement('input');
    input.name = 'name';
    handler.attributes().onchange!({ target: input } as unknown as Event & {
      currentTarget: EventTarget & HTMLFormElement;
    });
    expect(handler.touched.name).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// field() — type dispatch
// ---------------------------------------------------------------------------

describe('ClientFormHandler — field()', () => {
  const handler = new ClientFormHandler(richSchema);

  it('returns a StringField for a string field', () => {
    const field = handler.field('name');
    expect(typeof field.inputAttributes).toBe('function');
  });

  it('returns a BooleanField for a boolean field', () => {
    const field = handler.field('active');
    expect(typeof field.checkboxAttributes).toBe('function');
  });

  it('returns a NumericField for a number field', () => {
    const field = handler.field('age');
    expect(typeof field.inputAttributes).toBe('function');
  });

  it('returns a StringMultipleChoiceField for a string array field', () => {
    const field = handler.field('tags');
    expect(typeof field.checkboxAttributes).toBe('function');
    expect(typeof field.selectAttributes).toBe('function');
  });

  it('returns a FileField for a file field', () => {
    const field = handler.field('avatar');
    expect(typeof field.inputAttributes).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// Field attribute methods — spot checks
// ---------------------------------------------------------------------------

describe('ClientFormHandler — field attribute methods', () => {
  it('StringField.inputAttributes() returns correct name, id, type, and value', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      data: { name: 'Alice', bio: '' }
    });
    const attrs = handler.field('name').inputAttributes('text');
    expect(attrs.name).toBe('name');
    expect(attrs.id).toMatch(/^skf-.+-name$/);
    expect(attrs.type).toBe('text');
    expect(attrs.value).toBe('Alice');
  });

  it('StringField.inputAttributes() reflects updated formData value', () => {
    const handler = new ClientFormHandler(simpleSchema);
    expect(handler.field('name').inputAttributes('text').value).toBe('');
  });

  it('BooleanField.checkboxAttributes() reflects checked state', () => {
    const boolSchema = z.object({ active: z.boolean().default(true) });
    const handler = new ClientFormHandler(boolSchema);
    expect(handler.field('active').checkboxAttributes().checked).toBe(true);
  });

  it('BooleanField.checkboxAttributes() is unchecked when false', () => {
    const boolSchema = z.object({ active: z.boolean() });
    const handler = new ClientFormHandler(boolSchema);
    expect(handler.field('active').checkboxAttributes().checked).toBe(false);
  });

  it('NumericField.inputAttributes() returns value as string', () => {
    const numSchema = z.object({ age: z.number().default(25) });
    const handler = new ClientFormHandler(numSchema);
    const attrs = handler.field('age').inputAttributes('number');
    expect(attrs.value).toBe('25');
    expect(attrs.type).toBe('number');
  });

  it('StringMultipleChoiceField.checkboxAttributes() reflects checked state', () => {
    const arrSchema = z.object({
      tags: z.array(z.string()).default(['a', 'b'])
    });
    const handler = new ClientFormHandler(arrSchema);
    expect(handler.field('tags').checkboxAttributes('a').checked).toBe(true);
    expect(handler.field('tags').checkboxAttributes('c').checked).toBe(false);
  });

  it('FileField.inputAttributes() returns type=file and correct multiple flag', () => {
    const singleFileSchema = z.object({ doc: z.file().optional() });
    const multiFileSchema = z.object({ docs: z.array(z.file()).default([]) });

    const single = new ClientFormHandler(singleFileSchema);
    expect(single.field('doc').inputAttributes().type).toBe('file');
    expect(single.field('doc').inputAttributes().multiple).toBe(false);

    const multi = new ClientFormHandler(multiFileSchema);
    expect(multi.field('docs').inputAttributes().multiple).toBe(true);
  });

  it('BooleanField.radioAttributes() returns correct value and checked', () => {
    const boolSchema = z.object({ agreed: z.boolean().default(true) });
    const handler = new ClientFormHandler(boolSchema);
    const onAttrs = handler.field('agreed').radioAttributes(true);
    const offAttrs = handler.field('agreed').radioAttributes(false);
    expect(onAttrs.value).toBe('on');
    expect(onAttrs.checked).toBe(true);
    expect(offAttrs.value).toBe('');
    expect(offAttrs.checked).toBe(false);
  });

  it('StringField.textareaAttributes() returns value', () => {
    const handler = new ClientFormHandler(simpleSchema, {
      data: { name: 'Alice', bio: 'Hello world' }
    });
    expect(handler.field('bio').textareaAttributes().value).toBe('Hello world');
  });

  it('StringField.optionAttributes() returns selected=true for matching value', () => {
    const enumSchema = z.object({ color: z.enum(['red', 'green', 'blue']) });
    const handler = new ClientFormHandler(enumSchema, {
      data: { color: 'green' }
    });
    expect(handler.field('color').optionAttributes('green').selected).toBe(
      true
    );
    expect(handler.field('color').optionAttributes('red').selected).toBe(false);
  });

  it('field id uses formId as prefix', () => {
    const handler = new ClientFormHandler(simpleSchema);
    const field = handler.field('name');
    expect(field.id.startsWith(handler.formId)).toBe(true);
  });
});
