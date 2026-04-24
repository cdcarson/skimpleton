import { SvelteMap } from 'svelte/reactivity';
import type {
  FormErrors,
  FormFieldDefinition,
  FormFlatObject,
  FormName,
  FormPrimitiveCastType,
  FormSchema,
  FormShape,
  FormState,
  FormSuccess,
  FormTouched
} from './types.ts';
import {
  formDataToPojo,
  getFormErrors,
  getFormFieldDefinitions,
  pojoToFormData
} from './utils.ts';
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
import type { HTMLFormAttributes } from 'svelte/elements';

export class ClientFormHandler<
  T extends FormShape,
  Success extends Record<string, unknown> | undefined = undefined
> {
  #schema: FormSchema<T>;
  #fieldDefinitions: SvelteMap<FormName<T>, FormFieldDefinition<T>>;
  #formData: FormData;
  #data: T;
  #fields: { [N in FormName<T>]: FieldFor<T, N> };
  #formId: string;
  #touched: FormTouched<T>;
  #externalErrors: FormErrors<T>;
  #computedErrors: FormErrors<T>;
  #errors: FormErrors<T>;
  #shownErrors: FormErrors<T>;

  #valid: boolean;
  #submitting: boolean;
  #success: FormSuccess | undefined;
  #enhanceAttachmentKey: symbol;
  #enhanceAttachment: Attachment<HTMLFormElement>;
  #novalidateKey: symbol;
  #novalidateAttachment: Attachment<HTMLFormElement>;

  constructor(
    schema: FormSchema<T>,
    initialState?: Partial<FormState<T, Success>>
  ) {
    this.#schema = schema;
    this.#formId = `skf-${Math.random().toString(36).substring(2, 15)}`;
    this.#fieldDefinitions = new SvelteMap(
      getFormFieldDefinitions(this.schema)
    );
    this.#formData = $state(
      pojoToFormData(this.fieldDefinitions, initialState?.data || {})
    );

    this.#fields = Object.fromEntries(
      [...this.#fieldDefinitions].map(([name, def]) => [
        name,
        this.#createField(def)
      ])
    ) as { [N in FormName<T>]: FieldFor<T, N> };

    this.#data = $derived(
      formDataToPojo(this.fieldDefinitions, this.#formData)
    );

    this.#touched = $state(
      Object.keys(initialState?.errors || {}).reduce((acc, key) => {
        return { ...acc, [key]: true };
      }, {} as FormTouched<T>)
    );
    this.#externalErrors = $state(initialState?.errors || {});
    this.#computedErrors = $derived(getFormErrors(this.schema, this.data));
    this.#errors = $derived({
      ...this.computedErrors,
      ...this.externalErrors
    });
    this.#shownErrors = $derived.by(() => {
      const shown: FormErrors<T> = {};
      Object.keys(this.errors).forEach((key) => {
        if (this.touched[key as FormName<T>]) {
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
      return {
        destroy() {
          node.removeAttribute('novalidate');
        }
      };
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
              this.#formData = pojoToFormData(this.fieldDefinitions, data.data);
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

  get schema(): FormSchema<T> {
    return this.#schema;
  }

  get fieldDefinitions(): SvelteMap<FormName<T>, FormFieldDefinition<T>> {
    return this.#fieldDefinitions;
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
  get touched(): FormTouched<T> {
    return this.#touched;
  }
  get externalErrors(): FormErrors<T> {
    return this.#externalErrors;
  }
  get computedErrors(): FormErrors<T> {
    return this.#computedErrors;
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
    return this.#fields[name];
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
  touch(name: FormName<T>) {
    this.#touched[name] = true;
  }

  untouch(name: FormName<T>) {
    const touched = { ...this.#touched };
    delete touched[name];
    this.#touched = touched;
  }

  attributes(): HTMLFormAttributes {
    const hasFileField = this.#fieldDefinitions
      .values()
      .some((def) => def.castType === 'file');
    return {
      method: 'post',
      ...(hasFileField ? { enctype: 'multipart/form-data' } : {}),
      [this.#novalidateKey]: this.#novalidateAttachment,
      [this.#enhanceAttachmentKey]: this.#enhanceAttachment,
      oninput: (event) => {
        this.#formData = new FormData(event.currentTarget);
        const name = (event.target as HTMLInputElement).name as FormName<T>;
        if (name && name in this.#externalErrors) {
          const updated = { ...this.#externalErrors };
          delete updated[name];
          this.#externalErrors = updated;
        }
      },
      onfocusout: (event) => {
        const name = (event.target as HTMLInputElement).name as FormName<T>;
        const def = this.fieldDefinitions.get(name);
        // don't do this for file inputs, since the picker blurs the input
        if (def && def.castType !== 'file') {
          this.touch(name);
        }
      },
      onchange: (event) => {
        const name = (event.target as HTMLInputElement).name as FormName<T>;
        const def = this.fieldDefinitions.get(name);
        // only do this for file inputs, see above
        if (def && def.castType === 'file') {
          this.touch(name);
        }
      }
    };
  }

  #createField(definition: FormFieldDefinition<T>): BaseField<T> {
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
    if (definition.castType === 'number' || definition.castType === 'bigint') {
      if (definition.isArray) {
        return new NumericMultipleChoiceField(
          this,
          definition as FormFieldDefinition<T, 'number' | 'bigint', true>
        );
      } else {
        return new NumericField(
          this,
          definition as FormFieldDefinition<T, 'number' | 'bigint', false>
        );
      }
    }
    if (definition.castType === 'string') {
      if (definition.isArray) {
        return new StringMultipleChoiceField(
          this,
          definition as FormFieldDefinition<T, 'string', true>
        );
      } else {
        return new StringField(
          this,
          definition as FormFieldDefinition<T, 'string', false>
        );
      }
    }
    const _exhaustive: never = definition.castType;
    throw new Error(`Unhandled castType: ${_exhaustive}`);
  }

  #getErrorToastMessage(): string {
    // todo allow the user to pass a string or function
    return `Please correct the error${Object.keys(this.errors).length > 1 ? 's' : ''}.`;
  }
}

type Definite<T> = Exclude<T, undefined | null>;

type FieldTypeAt<
  T extends FormShape,
  N extends FormName<T>
> = N extends `${infer K}.${infer SubK}`
  ? K extends keyof T
    ? T[K] extends FormFlatObject
      ? SubK extends keyof T[K]
        ? T[K][SubK]
        : never
      : never
    : never
  : N extends keyof T
    ? T[N]
    : never;

type FieldFor<T extends FormShape, N extends FormName<T>> =
  Definite<FieldTypeAt<T, N>> extends File[]
    ? FileField<T, true>
    : Definite<FieldTypeAt<T, N>> extends File
      ? FileField<T, false>
      : Definite<FieldTypeAt<T, N>> extends boolean
        ? BooleanField<T>
        : Definite<FieldTypeAt<T, N>> extends (number | bigint)[]
          ? NumericMultipleChoiceField<T, 'number' | 'bigint'>
          : Definite<FieldTypeAt<T, N>> extends number | bigint
            ? NumericField<T, 'number' | 'bigint'>
            : Definite<FieldTypeAt<T, N>> extends string[]
              ? StringMultipleChoiceField<T>
              : Definite<FieldTypeAt<T, N>> extends string
                ? StringField<T>
                : never;

type BaseFieldAttributes = {
  name: string;
  id: string;
};

class BaseField<
  T extends FormShape,
  CastType extends FormPrimitiveCastType = FormPrimitiveCastType,
  IsArray extends boolean = boolean
> {
  #handler: ClientFormHandler<T>;
  #fieldDefinition: FormFieldDefinition<T, CastType, IsArray>;
  constructor(
    handler: ClientFormHandler<T>,
    fieldDefinition: FormFieldDefinition<T, CastType, IsArray>
  ) {
    this.#handler = handler;
    this.#fieldDefinition = fieldDefinition;
  }
  get handler(): ClientFormHandler<T> {
    return this.#handler;
  }
  get fieldDefinition(): FormFieldDefinition<T, CastType, IsArray> {
    return this.#fieldDefinition;
  }
  get name(): FormName<T> {
    return this.fieldDefinition.name;
  }
  get id(): string {
    return [this.handler.formId, ...this.name.split('.')].join('-');
  }
}

class BooleanField<T extends FormShape> extends BaseField<T, 'boolean', false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'boolean', false>
  ) {
    super(handler, definition);
  }

  checkboxAttributes(): BaseFieldAttributes & {
    type: 'checkbox';
    checked: boolean;
  } {
    return {
      name: this.name,
      id: this.id,
      type: 'checkbox',
      checked: this.handler.formData.get(this.name) === 'on'
    };
  }

  radioAttributes(value: boolean): BaseFieldAttributes & {
    type: 'radio';
    value: 'on' | '';
    checked: boolean;
  } {
    return {
      name: this.name,
      id: `${this.id}-${value ? 'on' : 'off'}`,
      type: 'radio',
      value: value ? 'on' : '',
      checked: (this.handler.formData.get(this.name) === 'on') === value
    };
  }

  selectAttributes(): BaseFieldAttributes {
    return {
      name: this.name,
      id: this.id
    };
  }

  optionAttributes(value: boolean): { value: 'on' | ''; selected: boolean } {
    return {
      value: value ? 'on' : '',
      selected: (this.handler.formData.get(this.name) === 'on') === value
    };
  }

  hiddenAttributes(): BaseFieldAttributes & {
    type: 'hidden';
    value: 'on' | '';
  } {
    return {
      name: this.name,
      id: this.id,
      type: 'hidden',
      value: this.handler.formData.get(this.name) === 'on' ? 'on' : ''
    };
  }
}

class FileField<T extends FormShape, IsArray extends boolean> extends BaseField<
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
  inputAttributes(): BaseFieldAttributes & {
    type: 'file';
    multiple: IsArray;
  } {
    return {
      name: this.name,
      id: this.id,
      type: 'file',
      multiple: this.fieldDefinition.isArray
    };
  }
}

class NumericField<
  T extends FormShape,
  CastType extends 'number' | 'bigint'
> extends BaseField<T, CastType, false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, CastType, false>
  ) {
    super(handler, definition);
  }

  inputAttributes<As extends 'number' | 'range' | 'hidden'>(
    as: As
  ): BaseFieldAttributes & { value: string; type: As } {
    return {
      name: this.name,
      id: this.id,
      type: as,
      value: (this.handler.formData.get(this.name) || '').toString()
    };
  }
}

class NumericMultipleChoiceField<
  T extends FormShape,
  CastType extends 'number' | 'bigint'
> extends BaseField<T, CastType, true> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, CastType, true>
  ) {
    super(handler, definition);
  }

  checkboxAttributes(value: number | bigint): BaseFieldAttributes & {
    value: string;
    checked: boolean;
    type: 'checkbox';
  } {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'checkbox',
      value: value.toString(),
      checked: this.handler.formData
        .getAll(this.name)
        .includes(value.toString())
    };
  }

  selectAttributes(): BaseFieldAttributes & { multiple: true } {
    return {
      name: this.name,
      id: this.id,
      multiple: true
    };
  }
  optionAttributes(value: number | bigint): {
    value: string;
    selected: boolean;
  } {
    return {
      value: value.toString(),
      selected: this.handler.formData
        .getAll(this.name)
        .includes(value.toString())
    };
  }
  hiddenAttributes(value: number | bigint): BaseFieldAttributes & {
    value: string;
    type: 'hidden';
  } {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'hidden',
      value: value.toString()
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
  | 'hidden';

class StringField<T extends FormShape> extends BaseField<T, 'string', false> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', false>
  ) {
    super(handler, definition);
  }
  textareaAttributes(): BaseFieldAttributes & { value: string } {
    return {
      name: this.name,
      id: this.id,
      value: (this.handler.formData.get(this.name) || '').toString()
    };
  }
  selectAttributes(): BaseFieldAttributes {
    return {
      name: this.name,
      id: this.id
    };
  }
  optionAttributes(value: string): { value: string; selected: boolean } {
    return {
      value,
      selected: this.handler.formData.get(this.name) === value
    };
  }
  radioAttributes(
    value: string
  ): BaseFieldAttributes & { value: string; checked: boolean; type: 'radio' } {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'radio',
      value,
      checked: this.handler.formData.get(this.name) === value
    };
  }
  inputAttributes<As extends StringFieldAs>(
    as: As
  ): BaseFieldAttributes & { value: string; type: As } {
    return {
      name: this.name,
      id: this.id,
      type: as,
      value: (this.handler.formData.get(this.name) || '').toString()
    };
  }
}

class StringMultipleChoiceField<T extends FormShape> extends BaseField<
  T,
  'string',
  true
> {
  constructor(
    handler: ClientFormHandler<T>,
    definition: FormFieldDefinition<T, 'string', true>
  ) {
    super(handler, definition);
  }

  checkboxAttributes(value: string): BaseFieldAttributes & {
    value: string;
    checked: boolean;
    type: 'checkbox';
  } {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'checkbox',
      value,
      checked: this.handler.formData.getAll(this.name).includes(value)
    };
  }

  selectAttributes(): BaseFieldAttributes & { multiple: true } {
    return {
      name: this.name,
      id: this.id,
      multiple: true
    };
  }
  optionAttributes(value: string): { value: string; selected: boolean } {
    return {
      value,
      selected: this.handler.formData.getAll(this.name).includes(value)
    };
  }
  hiddenAttributes(value: string): BaseFieldAttributes & {
    value: string;
    type: 'hidden';
  } {
    return {
      name: this.name,
      id: `${this.id}-${value}`,
      type: 'hidden',
      value
    };
  }
}
