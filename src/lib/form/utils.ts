import z from 'zod';
import type {
  FormErrors,
  FormFieldDefinition,
  FormName,
  FormPrimitive,
  FormPrimitiveCastType,
  FormSchema,
  FormShape
} from './types.ts';

export const unwrapZodType = (s: z.core.SomeType): z.core.SomeType => {
  if (s instanceof z.ZodOptional) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodExactOptional) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodNullable) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodDefault) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodPrefault) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodCatch) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodReadonly) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodNonOptional) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodSuccess) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodLazy) return unwrapZodType(s.unwrap());
  if (s instanceof z.ZodPipe) return unwrapZodType(s.out);
  return s;
};

export const getFormFieldDefinitions = <T extends FormShape>(
  schema: FormSchema<T>
): Map<FormName<T>, FormFieldDefinition<T>> => {
  if (schema instanceof z.ZodObject !== true) {
    throw Error('The top level schema must be an instance of ZodObject.');
  }
  const getScalarCastType = (
    unwrapped: z.core.SomeType
  ): FormPrimitiveCastType => {
    if (unwrapped instanceof z.ZodBoolean) return 'boolean';
    if (unwrapped instanceof z.ZodNumber) return 'number';
    if (unwrapped instanceof z.ZodBigInt) return 'bigint';
    if (unwrapped instanceof z.ZodFile) return 'file';
    // string, enum, literals — all serialize as strings
    if (
      unwrapped instanceof z.core.$ZodString ||
      unwrapped instanceof z.ZodEnum ||
      unwrapped instanceof z.ZodLiteral
    )
      return 'string';
    throw new Error(
      `getSchemaFieldDefinitions: unsupported field type ${unwrapped.constructor.name}`
    );
  };

  const parseObject = (
    s: z.ZodObject,
    currentDefs: FormFieldDefinition<T>[] = [],
    currentPath = ''
  ): FormFieldDefinition<T>[] => {
    for (const [key, fieldSchema] of Object.entries(s.shape)) {
      const newName = [currentPath, key]
        .filter((p) => p.trim().length > 0)
        .join('.') as FormName<T>;
      const unwrapped = unwrapZodType(fieldSchema);
      if (unwrapped instanceof z.ZodArray) {
        const element = unwrapZodType(unwrapped.element);
        currentDefs.push({
          name: newName,
          isArray: true,
          castType: getScalarCastType(element)
        });
        continue;
      }

      if (unwrapped instanceof z.ZodObject) {
        // recurse, don't return — siblings still need processing
        parseObject(unwrapped, currentDefs, newName);
        continue;
      }

      // leaf field
      currentDefs.push({
        name: newName,
        castType: getScalarCastType(unwrapped),
        isArray: false
      });
    }
    return currentDefs;
  };
  const defs = parseObject(schema);
  return new Map<FormName<T>, FormFieldDefinition<T>>(
    defs.map((def) => [def.name, def])
  );
};

export const pojoToFormData = <T extends FormShape>(
  fieldDefinitions: Map<FormName<T>, FormFieldDefinition<T>>,
  pojo: Partial<T>
): FormData => {
  const getPrimitive = (def: {
    name: string;
    castType: FormPrimitiveCastType;
    isArray: boolean;
  }): FormPrimitive | FormPrimitive[] | undefined => {
    const parts = def.name.split('.');
    let value: unknown = pojo;
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    if (value === undefined || value === null) return undefined;
    return value as FormPrimitive | FormPrimitive[];
  };
  const formData = new FormData();
  for (const def of Array.from(fieldDefinitions.values())) {
    const primitive = getPrimitive(def);
    if (primitive === undefined) {
      if (def.castType === 'string' && !def.isArray) {
        formData.set(def.name, '');
      }
      continue;
    }
    if (def.isArray) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `Expected an array for field "${def.name}" but got ${typeof primitive}`
        );
      }
      for (const item of primitive) {
        if (def.castType === 'file' && item instanceof File) {
          formData.append(def.name, item);
        } else {
          formData.append(def.name, String(item));
        }
      }
    } else {
      if (def.castType === 'file' && primitive instanceof File) {
        formData.set(def.name, primitive);
      } else if (def.castType === 'boolean') {
        if (primitive === true) formData.set(def.name, 'on');
        // false → omit, matching unchecked checkbox behavior
      } else {
        formData.set(def.name, String(primitive));
      }
    }
  }
  return formData;
};

export const formDataToPojo = <T extends FormShape>(
  fieldDefinitions: Map<FormName<T>, FormFieldDefinition<T>>,
  formData: FormData
): T => {
  // Browsers inject a placeholder entry for unselected file inputs when
  // FormData is built from a form element: either an empty string (some
  // implementations) or an empty File with name="" size=0 (Chrome). Filter
  // these out so file fields behave like "no selection" → undefined / [].
  const isRealFile = (v: FormDataEntryValue): v is File =>
    v instanceof File && (v.name !== '' || v.size > 0);

  const castValue = (
    raw: FormDataEntryValue,
    castType: FormPrimitiveCastType
  ): FormPrimitive => {
    if (castType === 'file') return raw as File;
    const s = raw as string;
    switch (castType) {
      case 'number':
        return Number(s);
      case 'bigint':
        return BigInt(s);
      case 'boolean':
        return s === 'on';
      default:
        return s;
    }
  };

  const setAtPath = (
    obj: Record<string, unknown>,
    path: string,
    value: unknown
  ) => {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] == null) current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  };

  const pojo: Record<string, unknown> = {};
  for (const def of Array.from(fieldDefinitions.values())) {
    if (def.isArray) {
      if (def.castType === 'file') {
        setAtPath(pojo, def.name, formData.getAll(def.name).filter(isRealFile));
      } else {
        const values = formData.getAll(def.name);
        setAtPath(
          pojo,
          def.name,
          values.map((v) => castValue(v, def.castType))
        );
      }
    } else {
      if (def.castType === 'file') {
        const value = formData.get(def.name);
        if (value !== null && isRealFile(value)) {
          setAtPath(pojo, def.name, value);
        }
      } else {
        const value = formData.get(def.name);
        if (value === null) {
          if (def.castType === 'boolean') {
            setAtPath(pojo, def.name, false);
          }
        } else {
          setAtPath(pojo, def.name, castValue(value, def.castType));
        }
      }
    }
  }
  return pojo as z.infer<FormSchema<T>>;
};

/**
 * Derives sensible initial form data from a schema.
 *
 * - Fields wrapped in ZodOptional / ZodNullable / ZodDefault / ZodCatch are
 *   resolved by parsing `undefined` — Zod returns the appropriate
 *   optional/null/default/catch value automatically.
 * - Remaining types fall back to type-based zero values:
 *   string → '', number → 0, boolean → false, bigint → 0n,
 *   array → [], enum → first option, file → undefined.
 */
export const getDefaultData = <T extends FormShape>(
  schema: FormSchema<T>
): T => {
  const getDefault = (s: z.core.SomeType): unknown => {
    // Let Zod resolve optional / nullable / default / catch wrappers naturally.
    const attempt = (s as z.ZodType).safeParse(undefined);
    if (attempt.success) return attempt.data;

    const unwrapped = unwrapZodType(s);

    if (unwrapped instanceof z.ZodObject) {
      const obj: Record<string, unknown> = {};
      for (const [key, fieldSchema] of Object.entries(unwrapped.shape)) {
        obj[key] = getDefault(fieldSchema as z.core.SomeType);
      }
      return obj;
    }
    if (unwrapped instanceof z.ZodArray) return [];
    if (unwrapped instanceof z.ZodBoolean) return false;
    if (unwrapped instanceof z.ZodNumber) return 0;
    if (unwrapped instanceof z.ZodBigInt) return 0n;
    if (unwrapped instanceof z.ZodEnum) return unwrapped.options[0];
    if (unwrapped instanceof z.ZodFile) return undefined;
    // ZodString / z.core.$ZodString / ZodLiteral → empty string
    return '';
  };

  return getDefault(schema) as T;
};

export const getFormErrors = <T extends FormShape>(
  schema: FormSchema<T>,
  data: Partial<T>
): FormErrors<T> => {
  const result = schema.safeParse(data);
  if (result.success) return {} as FormErrors<T>;
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const formPath = issue.path
      .filter((s): s is string => typeof s === 'string')
      .join('.');
    if (formPath && !errors[formPath]) {
      errors[formPath] = issue.message;
    }
  }
  return errors as FormErrors<T>;
};

/**
 * Removes File objects from data, replacing them with undefined
 * This is necessary because File objects cannot be serialized by devalue
 *
 * @param data - The data object to process
 * @returns A new object with File instances replaced by undefined
 *
 * @example
 * ```ts
 * const data = {
 *   name: 'John',
 *   avatar: new File(['content'], 'avatar.jpg'),
 *   age: 25n, // BigInt preserved
 *   created: new Date() // Date preserved
 * };
 *
 * const sanitized = removeFiles(data);
 * // { name: 'John', avatar: undefined, age: 25n, created: Date }
 * ```
 */
export const removeFiles = <T>(data: T): T => {
  // Handle primitives and null/undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Check if it's a File instance
  if (data instanceof File) {
    return undefined as T;
  }

  // Handle Date, BigInt, and other serializable objects
  if (
    data instanceof Date ||
    typeof data === 'bigint' ||
    data instanceof RegExp ||
    data instanceof Map ||
    data instanceof Set
  ) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => removeFiles(item)) as T;
  }

  // Handle plain objects
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = removeFiles(value);
    }
    return result as T;
  }

  // Return primitives (string, number, boolean) as-is
  return data;
};

export const isFetchRequest = (request: Request): boolean => {
  return (
    request.headers.has('Accept') &&
    (request.headers.get('Accept') || '').startsWith('application/json')
  );
};

/**
 * Clones a FormData object by creating a new instance and copying all entries
 *
 * @param formData - The FormData object to clone
 * @returns A new FormData object with all entries copied from the original
 *
 * @example
 * ```ts
 * const original = new FormData();
 * original.append('name', 'John');
 * original.append('age', '25');
 *
 * const cloned = cloneFormData(original);
 * // cloned contains all the same entries as original
 * ```
 */
export const cloneFormData = (formData: FormData): FormData => {
  const cloned = new FormData();
  formData.forEach((value, key) => {
    cloned.append(key, value);
  });
  return cloned;
};
