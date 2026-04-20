import { SvelteMap } from 'svelte/reactivity';
import type {
  FieldTypeAt,
  FormErrors,
  FormFieldCastType,
  FormFieldDefinition,
  FormName,
  FormSchema,
  FormShape,
  InitialFormState,
  FormSuccess,
  FormTouched,
  FormState
} from './types.js';
import {
  formDataToPojo,
  getFormErrors,
  getFormFieldDefinitions,
  pojoToFormData
} from './utils.js';
import type { HTMLFormAttributes } from 'svelte/elements';
import {
  createAttachmentKey,
  fromAction,
  type Attachment
} from 'svelte/attachments';
import { enhance } from '$app/forms';
import type { Action } from 'svelte/action';
import type { SubmitFunction } from '@sveltejs/kit';
import { MessageService } from '$lib/message/message.svelte.js';
import { goto, invalidateAll } from '$app/navigation';
// import { createAttachmentKey, type Attachment } from 'svelte/attachments';

type Definite<T> = Exclude<T, undefined | null>;

type FieldFor<T extends FormShape, N extends FormName<T>> =
  Definite<FieldTypeAt<T, N>> extends File | File[]
    ? FileField<T, Definite<FieldTypeAt<T, N>> extends File[] ? true : false>
    : Definite<FieldTypeAt<T, N>> extends boolean
      ? BooleanField<T>
      : Definite<FieldTypeAt<T, N>> extends number | bigint
        ? NumericField<T>
        : Definite<FieldTypeAt<T, N>> extends string[]
          ? MultipleChoiceField<T>
          : Definite<FieldTypeAt<T, N>> extends string
            ? string extends Definite<FieldTypeAt<T, N>>
              ? StringField<T>
              : SingleChoiceField<T>
            : Field<T>;

export class ClientFormHandler<
  T extends FormShape,
  Success extends FormSuccess = FormSuccess
> {
  #schema: FormSchema<T>;
  #fieldDefinitions: SvelteMap<FormName<T>, FormFieldDefinition<T>>;
  #formData: FormData;
  #data: T;
  #formId: string;
  #touched: FormTouched<T>;
  #externalErrors: FormErrors<T>;
  #computedErrors: FormErrors<T>;
  #errors: FormErrors<T>;
  #shownErrors: FormErrors<T>;
  #valid: boolean;
  #submitting: boolean;
  #success: FormSuccess | undefined;
  #fields: SvelteMap<FormName<T>, Field<T>>;
  #enhanceAttachmentKey: symbol;
  #enhanceAttachment: Attachment<HTMLFormElement>;
  #novalidateKey: symbol;
  #novalidateAttachment: Attachment<HTMLFormElement>;

  constructor(
    schema: FormSchema<T>,
    initialState: InitialFormState<T, Success>
  ) {
    this.#schema = schema;
    this.#formId = `skf-${Math.random().toString(36).substring(2, 15)}`;
    this.#fieldDefinitions = new SvelteMap(
      getFormFieldDefinitions(this.#schema).map(
        (value): [FormName<T>, FormFieldDefinition<T>] => [value.name, value]
      )
    );
    this.#formData = $state(
      pojoToFormData(
        Array.from(this.#fieldDefinitions.values()),
        initialState.data
      )
    );

    this.#fields = new SvelteMap(
      [...this.#fieldDefinitions].map(([name, def]) => [
        name,
        this.#createField(def)
      ])
    );

    // initialize #touched...
    this.#touched = $state(
      Object.keys(initialState.errors || {}).reduce((acc, key) => {
        return { ...acc, [key]: true };
      }, {} as FormTouched<T>)
    );

    this.#data = $derived(
      formDataToPojo(
        Array.from(this.#fieldDefinitions.values()),
        this.#formData
      )
    );

    this.#externalErrors = $state(initialState.errors || {});
    this.#computedErrors = $derived(getFormErrors(this.schema, this.#data));
    this.#errors = $derived({
      ...this.#computedErrors,
      ...this.#externalErrors
    });
    this.#shownErrors = $derived.by(() => {
      const shown: FormErrors<T> = {};
      Object.keys(this.#errors).forEach((key) => {
        if (this.#touched[key as FormName<T>]) {
          shown[key as FormName<T>] = this.#errors[key as FormName<T>];
        }
      });
      return shown;
    });

    this.#valid = $derived(Object.keys(this.#errors).length === 0);
    this.#submitting = $state(false);
    this.#success = $state(initialState?.success ?? undefined);

    this.#novalidateKey = createAttachmentKey();
    this.#novalidateAttachment = fromAction((node: HTMLFormElement) => {
      node.setAttribute('novalidate', '');
      return { destroy() { node.removeAttribute('novalidate'); } };
    });

    this.#enhanceAttachmentKey = createAttachmentKey();
    this.#enhanceAttachment = fromAction(
      enhance as Action<
        HTMLFormElement,
        SubmitFunction<FormState<T, Success>, FormState<T, Success>>
      >,
      () => {
        return async (input) => {
          const msg = MessageService.get();
          this.touchAll();
          if (!this.valid) {
            // todo make configurable
            msg.error(this.#getErrorToastMessage());
            input.cancel();
            return;
          }

          this.#submitting = true;
          msg.wait('Please wait...');
          return async (r) => {
            if (
              'error' === r.result.type ||
              'redirect' === r.result.type ||
              !r.result.data
            ) {
              msg.clear();
              this.#submitting = false;
              await r.update();
              return;
            }
            const data = r.result.data;
            if (r.result.type === 'failure') {
              // todo set data to formData
              // this.data = data.data;
              this.#externalErrors = data.errors;
              msg.error(this.#getErrorToastMessage());
              this.#submitting = false;
              return;
            }

            if (r.result.type === 'success' && data.success) {
              // todo set data to formData
              // this.data = data.data;
              this.#success = data.success;

              await invalidateAll();
              if (data.success.isRedirect === true) {
                // eslint-disable-next-line svelte/no-navigation-without-resolve
                await goto(data.success.location);
              }

              msg.success(data.success.message);
              this.#submitting = false;
              return;
            }
            msg.clear();
            this.#submitting = false;
            await r.update();
          };
        };
      }
    );
  }

  #getErrorToastMessage(): string {
    // todo allow the user to pass a string or function
    return `Please correct the error${Object.keys(this.errors).length > 1 ? 's' : ''}.`;
  }

  #createField(definition: FormFieldDefinition<T>): Field<T> {
    if (definition.castType === 'file') {
      return new FileField(
        this,
        definition as FormFieldDefinition<T, 'file', boolean>
      );
    }
    if (definition.castType === 'boolean') {
      return new BooleanField(
        this,
        definition as FormFieldDefinition<T, 'boolean', false>
      );
    }
    if (
      (definition.castType === 'number' || definition.castType === 'bigint') &&
      !definition.isArray
    ) {
      return new NumericField(
        this,
        definition as FormFieldDefinition<T, 'number' | 'bigint', false>
      );
    }
    if (definition.castType === 'string' && !definition.isArray) {
      if (definition.options) {
        return new SingleChoiceField(
          this,
          definition as FormFieldDefinition<T, 'string', false>
        );
      }
      return new StringField(
        this,
        definition as FormFieldDefinition<T, 'string', false>
      );
    }
    if (definition.castType === 'string' && definition.isArray) {
      return new MultipleChoiceField(
        this,
        definition as FormFieldDefinition<T, 'string', true>
      );
    }
    return new Field(this, definition);
  }

  get schema(): FormSchema<T> {
    return this.#schema;
  }
  get formData(): FormData {
    return this.#formData;
  }
  get data(): T {
    return this.#data;
  }

  get formId(): string {
    return this.#formId;
  }

  get errors(): FormErrors<T> {
    return this.#errors;
  }

  get shownErrors(): FormErrors<T> {
    return this.#shownErrors;
  }

  get valid(): boolean {
    return this.#valid;
  }

  get submitting(): boolean {
    return this.#submitting;
  }

  get success(): FormSuccess | undefined {
    return this.#success;
  }

  field<N extends FormName<T>>(name: N): FieldFor<T, N> {
    return this.#fields.get(name) as FieldFor<T, N>;
  }

  touchAll() {
    this.#touched = this.#fieldDefinitions
      .values()
      .toArray()
      .reduce((acc, def) => {
        return { ...acc, [def.name]: true };
      }, {} as FormTouched<T>);
  }
  untouchAll() {
    this.#touched = {};
  }
  touch(path: FormName<T>) {
    this.#touched[path] = true;
  }

  untouch(path: FormName<T>) {
    const touched = { ...this.#touched };
    delete touched[path];
    this.#touched = touched;
  }

  attributes(): HTMLFormAttributes {
    const hasFileField = this.#fieldDefinitions
      .values()
      .some((def) => def.castType === 'file');
    return {
      id: this.#formId,
      method: 'post',
      ...(hasFileField ? { enctype: 'multipart/form-data' } : {}),
      [this.#novalidateKey]: this.#novalidateAttachment,
      [this.#enhanceAttachmentKey]: this.#enhanceAttachment,
      onfocusout: (event) => {
        const target = event.target as HTMLInputElement;
        if (target.type === 'file') return;
        const name = target.name as FormName<T>;
        if (name) {
          this.touch(name);
        }
      },
      oninput: (event) => {
        this.#formData = new FormData(event.currentTarget);
        const name = (event.target as HTMLInputElement).name as FormName<T>;
        if (name && name in this.#externalErrors) {
          const updated = { ...this.#externalErrors };
          delete updated[name];
          this.#externalErrors = updated;
        }
      }
    };
  }
}

class Field<
  T extends FormShape,
  CastType extends FormFieldCastType = FormFieldCastType,
  IsArray extends boolean = boolean
> {
  #handler: ClientFormHandler<T>;
  #definition: FormFieldDefinition<T, CastType, IsArray>;
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, CastType, IsArray>
  ) {
    this.#handler = handler;
    this.#definition = definition;
  }
  get handler(): ClientFormHandler<T> {
    return this.#handler;
  }
  get definition(): FormFieldDefinition<T, CastType, IsArray> {
    return this.#definition;
  }
  get name(): string {
    return this.definition.name;
  }
  get id(): string {
    return [this.#handler.formId, ...this.#definition.name.split('.')].join(
      '-'
    );
  }
}

class FileField<T extends FormShape, IsArray extends boolean> extends Field<
  T,
  'file',
  IsArray
> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'file', IsArray>
  ) {
    super(handler, definition);
  }
  attributes() {
    return {
      name: this.name,
      id: this.id,
      type: 'file',
      multiple: this.definition.isArray,
      onchange: () => {
        this.handler.touch(this.name as FormName<T>);
      }
    };
  }
}

class BooleanField<T extends FormShape> extends Field<T, 'boolean', false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'boolean', false>
  ) {
    super(handler, definition);
  }
  attributes() {
    return {
      name: this.name,
      id: this.id,
      type: 'checkbox',
      checked: this.handler.formData.get(this.name) === 'on'
    };
  }
}

type NumericFieldAs = 'number' | 'range';
type NumericFieldOptions = { as: NumericFieldAs };

class NumericField<T extends FormShape> extends Field<
  T,
  'number' | 'bigint',
  false
> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'number' | 'bigint', false>
  ) {
    super(handler, definition);
  }
  attributes(options: NumericFieldOptions) {
    const value = (this.handler.formData.get(this.name) as string) ?? '';
    return { name: this.name, id: this.id, type: options.as, value };
  }
}

class SingleChoiceField<T extends FormShape> extends Field<T, 'string', false> {
  #options: readonly string[];
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', false>
  ) {
    super(handler, definition);
    if (!definition.options) {
      throw new Error(
        `SingleChoiceField: field "${definition.name}" must use z.enum() as its type`
      );
    }
    this.#options = definition.options;
  }
  get options(): readonly string[] {
    return this.#options;
  }
  #value(): string {
    return (this.handler.formData.get(this.name) as string) ?? '';
  }
  radioAttributes(value: string) {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'radio' as const,
      value,
      checked: this.#value() === value
    };
  }
  selectAttributes() {
    return {
      name: this.name,
      id: this.id
    };
  }
  optionAttributes(value: string) {
    return {
      value,
      selected: this.#value() === value
    };
  }
}

type StringFieldAs =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'hidden'
  | 'textarea';

type StringFieldOptions = { as: StringFieldAs };

class MultipleChoiceField<T extends FormShape> extends Field<
  T,
  'string',
  true
> {
  #options: readonly string[];
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', true>
  ) {
    super(handler, definition);
    if (!definition.options) {
      throw new Error(
        `MultipleChoiceField: field "${definition.name}" must use z.enum() as its array element type`
      );
    }
    this.#options = definition.options;
  }
  get options(): readonly string[] {
    return this.#options;
  }
  #selected(): Set<string> {
    return new Set(this.handler.formData.getAll(this.name) as string[]);
  }
  checkboxAttributes(value: string) {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'checkbox' as const,
      value,
      checked: this.#selected().has(value)
    };
  }
  selectAttributes() {
    return {
      name: this.name,
      id: this.id,
      multiple: true as const
    };
  }
  optionAttributes(value: string) {
    return {
      value,
      selected: this.#selected().has(value)
    };
  }
}

class StringField<T extends FormShape> extends Field<T, 'string', false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', false>
  ) {
    super(handler, definition);
  }
  attributes(options: StringFieldOptions) {
    const value = (this.handler.formData.get(this.name) as string) ?? '';
    const base = { name: this.name, id: this.id, value };
    if (options.as === 'textarea') {
      return base;
    }
    return { ...base, type: options.as };
  }
}
