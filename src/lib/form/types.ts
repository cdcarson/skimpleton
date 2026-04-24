import z from 'zod';

export type FormPrimitive = string | number | boolean | bigint | File;

// boolean[] is not supported by the form API (booleans are encoded as
// present/absent checkbox values, not array entries)
export type FormArrayPrimitive = string | number | bigint | File;

export type FormPrimitiveCastType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'file'
  | 'boolean';

export type FormFlatObject = Record<
  string,
  FormPrimitive | FormArrayPrimitive[]
>;

export type FormShape = Record<
  string,
  FormPrimitive | FormArrayPrimitive[] | FormFlatObject
>;

export type FormName<T extends FormShape> = {
  [K in keyof T & string]: T[K] extends FormPrimitive[]
    ? K
    : T[K] extends FormFlatObject
      ? `${K}.${keyof T[K] & string}`
      : K;
}[keyof T & string];

export type FormFieldDefinition<
  T extends FormShape,
  CastType extends FormPrimitiveCastType = FormPrimitiveCastType,
  IsArray extends boolean = boolean
> = {
  name: FormName<T>;
  castType: CastType;
  isArray: IsArray;
};

export type FormSchema<T extends FormShape> = z.ZodType<T>;

export type FormErrors<T extends FormShape> = {
  [K in FormName<T>]?: string;
};

export type FormTouched<T extends FormShape> = {
  [K in FormName<T>]?: true;
};

export type FormSuccess<
  Success extends Record<string, unknown> | undefined = undefined
> =
  | { isRedirect: true; message: string; location: string }
  | (Success extends undefined
      ? { isRedirect: false; message: string }
      : { isRedirect: false; message: string } & Success);

export type FormState<
  T extends FormShape,
  Success extends Record<string, unknown> | undefined = undefined
> = {
  data: T;
  errors: FormErrors<T>;
  success?: FormSuccess<Success>;
};

export type ClientField<
  T extends FormShape,
  CastType extends FormPrimitiveCastType = FormPrimitiveCastType,
  IsArray extends boolean = boolean
> = FormFieldDefinition<T, CastType, IsArray> & {
  id: string;
  shownError: string | undefined;
};
