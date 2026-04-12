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
  FormTouched
} from './types.js';
import {
  formDataToPojo,
  getFormErrors,
  getFormFieldDefinitions,
  pojoToFormData
} from './utils.js';
import type { HTMLFormAttributes } from 'svelte/elements';
// import { createAttachmentKey, type Attachment } from 'svelte/attachments';

type FieldFor<T extends FormShape, N extends FormName<T>> =
  FieldTypeAt<T, N> extends File | File[]
    ? FileField<T, FieldTypeAt<T, N> extends File[] ? true : false>
    : FieldTypeAt<T, N> extends boolean
      ? BooleanField<T>
      : FieldTypeAt<T, N> extends string
        ? StringField<T>
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
    if (definition.castType === 'string' && !definition.isArray) {
      return new StringField(
        this,
        definition as FormFieldDefinition<T, 'string', false>
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

  attributes(): HTMLFormAttributes {
    return {
      id: this.#formId,
      method: 'post',

      oninput: (event) => {
        this.#formData = new FormData(event.currentTarget);
        const name = (event.target as HTMLInputElement).name as FormName<T>;
        console.log(name);
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
      multiple: this.definition.isArray
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

type StringFieldOptions =
  | { element?: 'input'; type?: string }
  | { element: 'textarea' };

class StringField<T extends FormShape> extends Field<T, 'string', false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', false>
  ) {
    super(handler, definition);
  }
  attributes(options?: StringFieldOptions) {
    const value = (this.handler.formData.get(this.name) as string) ?? '';
    const base = { name: this.name, id: this.id, value };
    if (options?.element === 'textarea') {
      return base;
    }
    return {
      ...base,
      type: (options as { element?: 'input'; type?: string } | undefined)?.type ?? 'text'
    };
  }
}
