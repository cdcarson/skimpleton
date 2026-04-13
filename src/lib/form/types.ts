import z from 'zod';

export type FormPrimitive = string | number | boolean | bigint | File;
export type FormFlatObject = Record<string, FormPrimitive | FormPrimitive[]>;
export type FormShape = Record<
  string,
  FormPrimitive | FormPrimitive[] | FormFlatObject
>;
export type FormName<T extends FormShape> = {
  [K in keyof T & string]: T[K] extends FormPrimitive[]
    ? K
    : T[K] extends FormFlatObject
      ? `${K}.${keyof T[K] & string}`
      : K;
}[keyof T & string];
export type FormSchema<T extends FormShape> = z.ZodType<T>;
export type FormFieldCastType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'file'
  | 'boolean';

export type FormFieldDefinition<
  T extends FormShape,
  CastType extends FormFieldCastType = FormFieldCastType,
  IsArray extends boolean = boolean
> = {
  name: FormName<T>;
  castType: CastType;
  isArray: IsArray;
  options?: readonly string[];
};

export type FieldTypeAt<
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
export type FormErrors<T extends FormShape> = {
  [K in FormName<T>]?: string;
};

export type FormTouched<T extends FormShape> = {
  [K in FormName<T>]?: true;
};
export type FormState<
  T extends FormShape,
  Success extends Record<string, unknown> | undefined = undefined
> = {
  data: T;
  errors: FormErrors<T>;
  success?: FormSuccess<Success>;
};

export type InitialFormState<
  T extends FormShape,
  Success extends Record<string, unknown> | undefined = undefined
> = {
  data: Partial<T>;
  errors?: FormErrors<T>;
  success?: FormSuccess<Success>;
};

export type FormSuccess<
  Success extends Record<string, unknown> | undefined = undefined
> =
  | { isRedirect: true; message: string; location: string }
  | (Success extends undefined
      ? { isRedirect: false; message: string }
      : { isRedirect: false; message: string } & Success);
