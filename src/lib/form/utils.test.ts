import { describe, it, expect } from 'vitest';
import {
  unwrapZodType,
  getFormFieldDefinitions,
  formDataToPojo
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
      isArray: false,
      options: ['red', 'green', 'blue']
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
      isArray: true,
      options: ['red', 'green', 'blue']
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
      isArray: true,
      options: ['red', 'green', 'blue']
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
      isArray: true,
      options: ['red', 'green', 'blue']
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
