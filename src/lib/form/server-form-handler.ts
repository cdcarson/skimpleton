import { FlashMessage } from '$lib/message/flash-message.js';
import type {
  FormErrors,
  FormSuccess,
  FormState,
  FormSchema,
  FormShape
} from './types.js';
import {
  isFetchRequest,
  formDataToPojo,
  cloneFormData,
  removeFiles,
  getFormErrors,
  getFormFieldDefinitions,
} from './utils.js';
import {
  fail,
  redirect,
  type ActionFailure,
  type RequestEvent
} from '@sveltejs/kit';

export class ServerFormHandler<T extends FormShape> {
  public readonly event: RequestEvent;
  public readonly data: T;
  public readonly errors: FormErrors<T>;
  public readonly valid: boolean;
  constructor(schema: FormSchema<T>, formData: FormData, event: RequestEvent) {
    this.event = event;
    const rawData = formDataToPojo(
      getFormFieldDefinitions(schema),
      cloneFormData(formData)
    );
    const validationResult = schema.safeParse(rawData);
    this.errors = getFormErrors(schema, rawData as T);
    if (validationResult.success) {
      // Use transformed data from Zod
      this.data = validationResult.data as T;
      this.valid = true;
    } else {
      // Use raw data
      this.data = rawData as T;
      this.valid = false;
    }
  }
  public fail(
    newErrors?: FormErrors<T>,
    status: number = 400 // BAD_REQUEST
  ): ActionFailure<FormState<T>> {
    return fail(status, {
      data: removeFiles(this.data),
      errors: newErrors || this.errors
    });
  }
  public succeed<Success extends Record<string, unknown>>(
    successData: { message: string } & Success
  ): FormState<T, Success> {
    return {
      data: removeFiles(this.data),
      errors: {},
      success: {
        ...successData,
        isRedirect: false
      } as FormSuccess<Success>
    };
  }
  public redirect(
    location: string,
    message: string,
    status: number = 303 // SEE_OTHER
  ): FormState<T> {
    // For non-fetch requests, set flash message and throw redirect
    if (!isFetchRequest(this.event.request)) {
      FlashMessage.set(this.event, {
        type: 'success',
        message
      });
      throw redirect(status, location);
    }

    // For fetch requests, return success state with redirect info
    return {
      data: removeFiles(this.data),
      errors: {},
      success: {
        isRedirect: true,
        message,
        location
      } as FormSuccess
    };
  }
}
