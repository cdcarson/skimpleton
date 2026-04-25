import { describe, it, expect } from 'vitest';
import {
  unwrapZodType,
  getFormFieldDefinitions,
  formDataToPojo,
  pojoToFormData,
  getDefaultData,
  getFormErrors,
  removeFiles,
  isFetchRequest,
  cloneFormData
} from './utils.js';
import z from 'zod';

describe('unwrapZodType', () => {
  it('returns non-wrapper types as-is', () => {
    const s = z.string();
    expect(unwrapZodType(s)).toBe(s);
  });

  it('returns non-wrapper object types as-is', () => {
    const s = z.object({ name: z.string() });
    expect(unwrapZodType(s)).toBe(s);
  });

  it('unwraps optional', () => {
    const inner = z.string();
    expect(unwrapZodType(z.optional(inner))).toBe(inner);
  });

  it('unwraps nullable', () => {
    const inner = z.string();
    expect(unwrapZodType(z.nullable(inner))).toBe(inner);
  });

  it('unwraps default', () => {
    const inner = z.string();
    expect(unwrapZodType(inner.default('hello'))).toBe(inner);
  });

  it('unwraps catch', () => {
    const inner = z.string();
    expect(unwrapZodType(inner.catch('fallback'))).toBe(inner);
  });

  it('unwraps readonly', () => {
    const inner = z.string();
    expect(unwrapZodType(z.readonly(inner))).toBe(inner);
  });

  it('unwraps pipe to the output side', () => {
    const out = z.string().min(1);
    expect(unwrapZodType(z.string().pipe(out))).toBe(out);
  });

  it('unwraps multiple layers', () => {
    const inner = z.string();
    expect(unwrapZodType(z.optional(z.nullable(inner)))).toBe(inner);
  });

  it('unwraps optional wrapping a default', () => {
    const inner = z.string();
    expect(unwrapZodType(inner.default('x').optional())).toBe(inner);
  });
});

describe('getFormFieldDefinitions', () => {
  it('is correct a nested primitive', () => {
    const schema = z.object({
      name: z.object({
        first: z.string(),
        last: z.string()
      })
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('name.first')).toEqual({
      name: 'name.first',
      castType: 'string',
      isArray: false
    });
    expect(defs.get('name.last')).toEqual({
      name: 'name.last',
      castType: 'string',
      isArray: false
    });
  });
  it('is correct for an array of string', () => {
    const schema = z.object({
      faves: z.array(z.string())
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves')).toEqual({
      name: 'faves',
      castType: 'string',
      isArray: true
    });
  });
  it('is correct for z.string()', () => {
    const schema = z.object({
      faves: z.string()
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves')).toEqual({
      name: 'faves',
      castType: 'string',
      isArray: false
    });
  });
  it('is correct for z.enum()', () => {
    const schema = z.object({
      faves: z.enum(['red', 'green', 'blue'])
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves')).toEqual({
      name: 'faves',
      castType: 'string',
      isArray: false
    });
  });
  it('is correct for z.array(z.enum())', () => {
    const schema = z.object({
      faves: z.array(z.enum(['red', 'green', 'blue']))
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves')).toEqual({
      name: 'faves',
      castType: 'string',
      isArray: true
    });
  });

  it('is correct for nested z.array(z.enum())', () => {
    const schema = z.object({
      faves: z.object({
        colors: z.array(z.enum(['red', 'green', 'blue']))
      })
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves.colors')).toEqual({
      name: 'faves.colors',
      castType: 'string',
      isArray: true
    });
  });

  it('is correct for z.literal()', () => {
    const schema = z.object({
      faves: z.literal('hop')
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('faves')).toEqual({
      name: 'faves',
      castType: 'string',
      isArray: false
    });
  });
  it('is correct for z.file()', () => {
    const schema = z.object({
      file: z.file()
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('file')).toEqual({
      name: 'file',
      castType: 'file',
      isArray: false
    });
  });
  it('is correct for z.array(z.file())', () => {
    const schema = z.object({
      files: z.array(z.file())
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('files')).toEqual({
      name: 'files',
      castType: 'file',
      isArray: true
    });
  });

  it('is correct for a complex schema', () => {
    const schema = z.object({
      name: z.object({
        first: z.string(),
        middle: z.string().optional(),
        last: z.string()
      }),
      faves: z.object({
        number: z.array(z.int()),
        color: z.array(z.enum(['red', 'green', 'blue'])),
        pet: z.array(z.string()),
        files: z.array(z.file())
      })
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs.get('name.first')).toEqual({
      name: 'name.first',
      castType: 'string',
      isArray: false
    });
    expect(defs.get('name.last')).toEqual({
      name: 'name.last',
      castType: 'string',
      isArray: false
    });
    expect(defs.get('name.middle')).toEqual({
      name: 'name.middle',
      castType: 'string',
      isArray: false
    });
    expect(defs.get('faves.number')).toEqual({
      name: 'faves.number',
      castType: 'number',
      isArray: true
    });
    expect(defs.get('faves.color')).toEqual({
      name: 'faves.color',
      castType: 'string',
      isArray: true
    });
    expect(defs.get('faves.pet')).toEqual({
      name: 'faves.pet',
      castType: 'string',
      isArray: true
    });
    expect(defs.get('faves.files')).toEqual({
      name: 'faves.files',
      castType: 'file',
      isArray: true
    });
  });
});

describe('formDataToPojo — file fields', () => {
  const schema = z.object({
    avatar: z.file(),
    attachments: z.array(z.file()).default([])
  });

  const realFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
  // Browsers inject an empty File for unselected file inputs when FormData is
  // built from a form element (e.g. `new FormData(formEl)`).
  const emptyFile = new File([], '');

  describe('single file field (avatar)', () => {
    it('returns the File when a real file is present', () => {
      const fd = new FormData();
      fd.set('avatar', realFile);
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.avatar).toBe(realFile);
    });

    it('returns undefined when the field has no entry', () => {
      const fd = new FormData();
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.avatar).toBeUndefined();
    });

    it('returns undefined when the browser sends an empty string for an unselected input', () => {
      const fd = new FormData();
      fd.set('avatar', ''); // some browsers/implementations send empty string
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.avatar).toBeUndefined();
    });

    it('returns undefined when the browser sends an empty File for an unselected input', () => {
      const fd = new FormData();
      fd.set('avatar', emptyFile); // Chrome sends File{name:"",size:0} for unselected inputs
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.avatar).toBeUndefined();
    });
  });

  describe('array file field (attachments)', () => {
    it('returns [] when there are no entries', () => {
      const fd = new FormData();
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.attachments).toEqual([]);
    });

    it('returns [] when the browser sends an empty string for an unselected input', () => {
      const fd = new FormData();
      fd.append('attachments', '');
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.attachments).toEqual([]);
    });

    it('returns [] when the browser sends an empty File for an unselected input', () => {
      const fd = new FormData();
      fd.append('attachments', emptyFile);
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.attachments).toEqual([]);
    });

    it('returns the files when real files are present', () => {
      const f1 = new File(['a'], 'a.jpg');
      const f2 = new File(['b'], 'b.pdf');
      const fd = new FormData();
      fd.append('attachments', f1);
      fd.append('attachments', f2);
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.attachments).toEqual([f1, f2]);
    });

    it('filters out empty-File placeholders mixed with real files', () => {
      const f1 = new File(['a'], 'a.jpg');
      const fd = new FormData();
      fd.append('attachments', emptyFile);
      fd.append('attachments', f1);
      const result = formDataToPojo(getFormFieldDefinitions(schema), fd);
      expect(result.attachments).toEqual([f1]);
    });
  });
});

// ---------------------------------------------------------------------------
// Additional unwrapZodType cases
// ---------------------------------------------------------------------------

describe('unwrapZodType — additional wrappers', () => {
  it('unwraps exactOptional', () => {
    const inner = z.string();
    expect(unwrapZodType(z.exactOptional(inner))).toBe(inner);
  });

  it('unwraps nonoptional', () => {
    const inner = z.string();
    expect(unwrapZodType(z.nonoptional(inner))).toBe(inner);
  });

  it('unwraps prefault', () => {
    const inner = z.string();
    expect(unwrapZodType(z.prefault(inner, () => 'x'))).toBe(inner);
  });

  it('unwraps lazy', () => {
    const inner = z.string();
    expect(unwrapZodType(z.lazy(() => inner))).toBe(inner);
  });
});

// ---------------------------------------------------------------------------
// Additional getFormFieldDefinitions cases
// ---------------------------------------------------------------------------

describe('getFormFieldDefinitions — scalar cast types and error paths', () => {
  it('maps z.boolean() to castType "boolean"', () => {
    const schema = z.object({ active: z.boolean() });
    expect(getFormFieldDefinitions(schema).get('active')).toEqual({
      name: 'active',
      castType: 'boolean',
      isArray: false
    });
  });

  it('maps z.number() to castType "number"', () => {
    const schema = z.object({ age: z.number() });
    expect(getFormFieldDefinitions(schema).get('age')).toEqual({
      name: 'age',
      castType: 'number',
      isArray: false
    });
  });

  it('maps z.bigint() to castType "bigint"', () => {
    const schema = z.object({ big: z.bigint() });
    expect(getFormFieldDefinitions(schema).get('big')).toEqual({
      name: 'big',
      castType: 'bigint',
      isArray: false
    });
  });

  it('maps z.array(z.number()) to castType "number" isArray true', () => {
    const schema = z.object({ scores: z.array(z.number()) });
    expect(getFormFieldDefinitions(schema).get('scores')).toEqual({
      name: 'scores',
      castType: 'number',
      isArray: true
    });
  });

  it('throws for unsupported leaf type (z.date)', () => {
    // z.date() is not a supported FormShape type; cast to bypass TS to test runtime behavior
    const schema = z.object({ when: z.date() }) as never;
    expect(() => getFormFieldDefinitions(schema)).toThrow();
  });

  it('throws when the top-level schema is not a ZodObject', () => {
    expect(() => getFormFieldDefinitions(z.string() as never)).toThrow(
      'The top level schema must be an instance of ZodObject.'
    );
  });
});

// ---------------------------------------------------------------------------
// pojoToFormData
// ---------------------------------------------------------------------------

describe('pojoToFormData', () => {
  it('sets a string field', () => {
    const schema = z.object({ name: z.string() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { name: 'hello' });
    expect(fd.get('name')).toBe('hello');
  });

  it('sets empty string for undefined string field', () => {
    const schema = z.object({ name: z.string() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, {});
    expect(fd.get('name')).toBe('');
  });

  it('sets "on" for boolean true', () => {
    const schema = z.object({ active: z.boolean() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { active: true });
    expect(fd.get('active')).toBe('on');
  });

  it('omits boolean false', () => {
    const schema = z.object({ active: z.boolean() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { active: false });
    expect(fd.get('active')).toBeNull();
  });

  it('converts number to string', () => {
    const schema = z.object({ age: z.number() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { age: 42 });
    expect(fd.get('age')).toBe('42');
  });

  it('converts bigint to string', () => {
    const schema = z.object({ big: z.bigint() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { big: 9007199254740993n });
    expect(fd.get('big')).toBe('9007199254740993');
  });

  it('appends each item in a string array', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { tags: ['a', 'b', 'c'] });
    expect(fd.getAll('tags')).toEqual(['a', 'b', 'c']);
  });

  it('appends each item in a number array as string', () => {
    const schema = z.object({ scores: z.array(z.number()) });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { scores: [1, 2, 3] });
    expect(fd.getAll('scores')).toEqual(['1', '2', '3']);
  });

  it('sets a File field', () => {
    const schema = z.object({ avatar: z.file() });
    const defs = getFormFieldDefinitions(schema);
    const f = new File(['content'], 'photo.jpg');
    const fd = pojoToFormData(defs, { avatar: f });
    expect(fd.get('avatar')).toBe(f);
  });

  it('omits a file field when undefined', () => {
    const schema = z.object({ avatar: z.file().optional() });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, {});
    expect(fd.get('avatar')).toBeNull();
  });

  it('appends each File in a file array', () => {
    const schema = z.object({ files: z.array(z.file()) });
    const defs = getFormFieldDefinitions(schema);
    const f1 = new File(['a'], 'a.txt');
    const f2 = new File(['b'], 'b.txt');
    const fd = pojoToFormData(defs, { files: [f1, f2] });
    expect(fd.getAll('files')).toEqual([f1, f2]);
  });

  it('handles nested dot-path fields', () => {
    const schema = z.object({
      name: z.object({ first: z.string(), last: z.string() })
    });
    const defs = getFormFieldDefinitions(schema);
    const fd = pojoToFormData(defs, { name: { first: 'John', last: 'Doe' } });
    expect(fd.get('name.first')).toBe('John');
    expect(fd.get('name.last')).toBe('Doe');
  });

  it('throws when a non-array value is passed for an array field', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    const defs = getFormFieldDefinitions(schema);
    expect(() =>
      pojoToFormData(defs, { tags: 'not-an-array' as never })
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// getDefaultData
// ---------------------------------------------------------------------------

describe('getDefaultData', () => {
  it('returns empty string for z.string()', () => {
    expect(getDefaultData(z.object({ name: z.string() }))).toEqual({
      name: ''
    });
  });

  it('returns 0 for z.number()', () => {
    expect(getDefaultData(z.object({ age: z.number() }))).toEqual({ age: 0 });
  });

  it('returns false for z.boolean()', () => {
    expect(getDefaultData(z.object({ active: z.boolean() }))).toEqual({
      active: false
    });
  });

  it('returns 0n for z.bigint()', () => {
    expect(getDefaultData(z.object({ big: z.bigint() }))).toEqual({ big: 0n });
  });

  it('returns [] for z.array()', () => {
    expect(getDefaultData(z.object({ tags: z.array(z.string()) }))).toEqual({
      tags: []
    });
  });

  it('returns the first enum option for z.enum()', () => {
    expect(
      getDefaultData(z.object({ color: z.enum(['red', 'green', 'blue']) }))
    ).toEqual({ color: 'red' });
  });

  it('returns undefined for an optional field', () => {
    const result = getDefaultData(z.object({ note: z.string().optional() }));
    expect(result.note).toBeUndefined();
  });

  it('returns the default value for a field with .default()', () => {
    expect(
      getDefaultData(z.object({ name: z.string().default('Alice') }))
    ).toEqual({ name: 'Alice' });
  });

  it('returns the catch value for a field with .catch()', () => {
    expect(
      getDefaultData(z.object({ name: z.string().catch('fallback') }))
    ).toEqual({ name: 'fallback' });
  });

  it('returns undefined for z.file()', () => {
    const result = getDefaultData(z.object({ avatar: z.file().optional() }));
    expect(result.avatar).toBeUndefined();
  });

  it('recurses into nested objects', () => {
    const schema = z.object({
      name: z.object({ first: z.string(), last: z.string() })
    });
    expect(getDefaultData(schema)).toEqual({
      name: { first: '', last: '' }
    });
  });
});

// ---------------------------------------------------------------------------
// getFormErrors
// ---------------------------------------------------------------------------

describe('getFormErrors', () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(3, 'Too short')
  });

  it('returns {} when data is valid', () => {
    expect(getFormErrors(schema, { name: 'Alice', code: 'ABC' })).toEqual({});
  });

  it('returns error message for an invalid field', () => {
    const errors = getFormErrors(schema, { name: '', code: 'ABC' });
    expect(errors.name).toBe('Name is required');
    expect(errors.code).toBeUndefined();
  });

  it('returns errors for multiple invalid fields', () => {
    const errors = getFormErrors(schema, { name: '', code: 'AB' });
    expect(errors.name).toBe('Name is required');
    expect(errors.code).toBe('Too short');
  });

  it('only records the first error per field path', () => {
    // Two refinements that both fail produce two issues at the same path
    const strictSchema = z.object({
      pw: z
        .string()
        .refine(() => false, 'First error')
        .refine(() => false, 'Second error')
    });
    const errors = getFormErrors(strictSchema, { pw: 'anything' });
    expect(errors.pw).toBe('First error');
    expect(Object.keys(errors).length).toBe(1);
  });

  it('ignores issues with no string path segments', () => {
    // A top-level issue with an empty path yields formPath '' — skipped
    const alwaysFailSchema = z.object({ x: z.string() }).refine(() => false, {
      message: 'always fails',
      path: []
    });
    const errors = getFormErrors(alwaysFailSchema, { x: 'ok' });
    // The refine path is [] → formPath '' → skipped; field 'x' is valid
    expect(errors).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// removeFiles
// ---------------------------------------------------------------------------

describe('removeFiles', () => {
  it('returns null as-is', () => {
    expect(removeFiles(null)).toBeNull();
  });

  it('returns undefined as-is', () => {
    expect(removeFiles(undefined)).toBeUndefined();
  });

  it('replaces a File with undefined', () => {
    expect(removeFiles(new File(['x'], 'x.txt'))).toBeUndefined();
  });

  it('passes through strings', () => {
    expect(removeFiles('hello')).toBe('hello');
  });

  it('passes through numbers', () => {
    expect(removeFiles(42)).toBe(42);
  });

  it('passes through booleans', () => {
    expect(removeFiles(true)).toBe(true);
  });

  it('passes through bigint', () => {
    expect(removeFiles(42n)).toBe(42n);
  });

  it('passes through Date by reference', () => {
    const d = new Date();
    expect(removeFiles(d)).toBe(d);
  });

  it('passes through RegExp by reference', () => {
    const r = /foo/;
    expect(removeFiles(r)).toBe(r);
  });

  it('passes through Map by reference', () => {
    const m = new Map([['k', 'v']]);
    expect(removeFiles(m)).toBe(m);
  });

  it('passes through Set by reference', () => {
    const s = new Set([1, 2]);
    expect(removeFiles(s)).toBe(s);
  });

  it('replaces File entries in an array', () => {
    const f = new File(['x'], 'x.txt');
    expect(removeFiles([f, 'text', 42])).toEqual([undefined, 'text', 42]);
  });

  it('replaces File values in an object', () => {
    const f = new File(['x'], 'x.txt');
    expect(removeFiles({ name: 'Alice', avatar: f })).toEqual({
      name: 'Alice',
      avatar: undefined
    });
  });

  it('recurses into nested objects', () => {
    const f = new File(['x'], 'x.txt');
    expect(removeFiles({ user: { name: 'Alice', avatar: f } })).toEqual({
      user: { name: 'Alice', avatar: undefined }
    });
  });
});

// ---------------------------------------------------------------------------
// isFetchRequest
// ---------------------------------------------------------------------------

describe('isFetchRequest', () => {
  it('returns true when Accept starts with application/json', () => {
    const req = new Request('http://localhost/', {
      headers: { Accept: 'application/json' }
    });
    expect(isFetchRequest(req)).toBe(true);
  });

  it('returns true when Accept starts with application/json followed by other types', () => {
    const req = new Request('http://localhost/', {
      headers: { Accept: 'application/json, text/html' }
    });
    expect(isFetchRequest(req)).toBe(true);
  });

  it('returns false when Accept is text/html', () => {
    const req = new Request('http://localhost/', {
      headers: { Accept: 'text/html,application/xhtml+xml' }
    });
    expect(isFetchRequest(req)).toBe(false);
  });

  it('returns false when Accept header is absent', () => {
    const req = new Request('http://localhost/');
    expect(isFetchRequest(req)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// cloneFormData
// ---------------------------------------------------------------------------

describe('cloneFormData', () => {
  it('copies a single string entry', () => {
    const fd = new FormData();
    fd.set('name', 'Alice');
    const cloned = cloneFormData(fd);
    expect(cloned.get('name')).toBe('Alice');
  });

  it('copies multiple values for the same key', () => {
    const fd = new FormData();
    fd.append('tags', 'a');
    fd.append('tags', 'b');
    fd.append('tags', 'c');
    const cloned = cloneFormData(fd);
    expect(cloned.getAll('tags')).toEqual(['a', 'b', 'c']);
  });

  it('copies multiple distinct keys', () => {
    const fd = new FormData();
    fd.set('first', 'John');
    fd.set('last', 'Doe');
    const cloned = cloneFormData(fd);
    expect(cloned.get('first')).toBe('John');
    expect(cloned.get('last')).toBe('Doe');
  });

  it('mutating the clone does not affect the original', () => {
    const fd = new FormData();
    fd.set('name', 'Alice');
    const cloned = cloneFormData(fd);
    cloned.set('name', 'Bob');
    expect(fd.get('name')).toBe('Alice');
  });

  it('mutating the original does not affect the clone', () => {
    const fd = new FormData();
    fd.set('name', 'Alice');
    const cloned = cloneFormData(fd);
    fd.set('name', 'Bob');
    expect(cloned.get('name')).toBe('Alice');
  });
});
