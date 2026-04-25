import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ServerFormHandler } from './server-form-handler.js';
import z from 'zod';
import { FlashMessage } from '$lib/message/flash-message.js';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  fail: vi.fn((status: number, data: unknown) => ({ status, data })),
  redirect: vi.fn((status: number, location: string) => {
    throw Object.assign(new Error(`Redirect to ${location}`), {
      status,
      location
    });
  })
}));

vi.mock('$lib/message/flash-message.js', () => ({
  FlashMessage: { set: vi.fn() }
}));

function makeMockEvent(acceptHeader?: string): RequestEvent {
  return {
    request: new Request('http://localhost/', {
      headers: acceptHeader ? { Accept: acceptHeader } : {}
    }),
    cookies: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn().mockReturnValue([]),
      serialize: vi.fn()
    }
  } as unknown as RequestEvent;
}

function makeFormData(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number()
});

describe('ServerFormHandler — constructor', () => {
  it('sets valid=true and coerces data when FormData is valid', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Alice', age: '30' }),
      makeMockEvent()
    );
    expect(handler.valid).toBe(true);
    expect(handler.data.name).toBe('Alice');
    expect(handler.data.age).toBe(30); // string→number coercion via Zod
    expect(handler.errors).toEqual({});
  });

  it('sets valid=false and populates errors when FormData is invalid', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: '', age: '25' }),
      makeMockEvent()
    );
    expect(handler.valid).toBe(false);
    expect(handler.errors.name).toBe('Name is required');
  });

  it('stores raw (un-transformed) data when validation fails', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: '', age: '99' }),
      makeMockEvent()
    );
    // age came in as '99' → cast to 99 by formDataToPojo; Zod rejected due to name error
    expect(handler.data.age).toBe(99);
  });

  it('exposes the RequestEvent on .event', () => {
    const event = makeMockEvent();
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Bob', age: '1' }),
      event
    );
    expect(handler.event).toBe(event);
  });
});

describe('ServerFormHandler#fail()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls fail(400, ...) with the current data and errors by default', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: '', age: '25' }),
      makeMockEvent()
    );
    handler.fail();
    expect(fail).toHaveBeenCalledWith(
      400,
      expect.objectContaining({
        errors: expect.objectContaining({ name: 'Name is required' })
      })
    );
  });

  it('uses custom errors when provided', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: '', age: '25' }),
      makeMockEvent()
    );
    handler.fail({ name: 'Custom error' });
    expect(fail).toHaveBeenCalledWith(
      400,
      expect.objectContaining({ errors: { name: 'Custom error' } })
    );
  });

  it('uses a custom HTTP status when provided', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: '', age: '25' }),
      makeMockEvent()
    );
    handler.fail(undefined, 422);
    expect(fail).toHaveBeenCalledWith(422, expect.any(Object));
  });

  it('strips File objects from data via removeFiles', () => {
    const fileSchema = z.object({
      label: z.string(),
      doc: z.file().optional()
    });
    const fd = new FormData();
    fd.set('label', 'test');
    fd.set('doc', new File(['x'], 'x.pdf'));
    const handler = new ServerFormHandler(fileSchema, fd, makeMockEvent());
    handler.fail();
    const [, payload] = (fail as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(payload.data.doc).toBeUndefined();
  });
});

describe('ServerFormHandler#succeed()', () => {
  it('returns FormState with success and isRedirect=false', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Alice', age: '30' }),
      makeMockEvent()
    );
    const result = handler.succeed({ message: 'Saved!', id: 42 });
    expect(result.success).toMatchObject({
      isRedirect: false,
      message: 'Saved!',
      id: 42
    });
    expect(result.errors).toEqual({});
  });

  it('includes the current data in the result', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Bob', age: '5' }),
      makeMockEvent()
    );
    const result = handler.succeed({ message: 'OK' });
    expect(result.data.name).toBe('Bob');
  });

  it('strips File objects from data', () => {
    const fileSchema = z.object({
      label: z.string(),
      doc: z.file().optional()
    });
    const fd = new FormData();
    fd.set('label', 'test');
    fd.set('doc', new File(['x'], 'x.pdf'));
    const handler = new ServerFormHandler(fileSchema, fd, makeMockEvent());
    const result = handler.succeed({ message: 'OK' });
    expect((result.data as { label: string; doc?: File }).doc).toBeUndefined();
  });
});

describe('ServerFormHandler#redirect()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets a flash message and throws redirect for non-fetch requests', () => {
    const event = makeMockEvent('text/html,application/xhtml+xml');
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Alice', age: '1' }),
      event
    );
    expect(() => handler.redirect('/dashboard', 'Saved!')).toThrow();
    expect(FlashMessage.set).toHaveBeenCalledWith(event, {
      type: 'success',
      message: 'Saved!'
    });
    expect(redirect).toHaveBeenCalledWith(303, '/dashboard');
  });

  it('uses a custom redirect status when provided', () => {
    const event = makeMockEvent('text/html');
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Alice', age: '1' }),
      event
    );
    expect(() => handler.redirect('/home', 'Done', 301)).toThrow();
    expect(redirect).toHaveBeenCalledWith(301, '/home');
  });

  it('returns a success state with isRedirect=true for fetch requests', () => {
    const handler = new ServerFormHandler(
      schema,
      makeFormData({ name: 'Alice', age: '1' }),
      makeMockEvent('application/json')
    );
    const result = handler.redirect('/dashboard', 'Saved!');
    expect(result.success).toMatchObject({
      isRedirect: true,
      message: 'Saved!',
      location: '/dashboard'
    });
    expect(result.errors).toEqual({});
    expect(FlashMessage.set).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
