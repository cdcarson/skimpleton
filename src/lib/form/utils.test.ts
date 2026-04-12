import { describe, it, expect } from 'vitest';
import { unwrapZodType, getFormFieldDefinitions } from './utils.js';
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
    expect(defs[0]).toEqual({
      name: 'name.first',
      castType: 'string',
      isArray: false
    });
    expect(defs[1]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({
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
    expect(defs[0]).toEqual({ name: 'file', castType: 'file', isArray: false });
  });
  it('is correct for z.array(z.file())', () => {
    const schema = z.object({
      files: z.array(z.file())
    });
    const defs = getFormFieldDefinitions(schema);
    expect(defs[0]).toEqual({ name: 'files', castType: 'file', isArray: true });
  });

  it('is correct tor a complex schema', () => {
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
    expect(defs).toContainEqual({
      name: 'name.first',
      castType: 'string',
      isArray: false
    });
    expect(defs).toContainEqual({
      name: 'name.last',
      castType: 'string',
      isArray: false
    });
    expect(defs).toContainEqual({
      name: 'name.middle',
      castType: 'string',
      isArray: false
    });
    expect(defs).toContainEqual({
      name: 'faves.number',
      castType: 'number',
      isArray: true
    });
    expect(defs).toContainEqual({
      name: 'faves.color',
      castType: 'string',
      isArray: true
    });
    expect(defs).toContainEqual({
      name: 'faves.pet',
      castType: 'string',
      isArray: true
    });
    expect(defs).toContainEqual({
      name: 'faves.files',
      castType: 'file',
      isArray: true
    });
  });
});
