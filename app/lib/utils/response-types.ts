import { z } from 'zod';

export type FormErrors = z.typeToFlattenedError<any, string> | null;
type Error = {
  message: string;
};

type ErrorBody = {
  status: 'error';
  errors?: Error[];
  formErrors?: FormErrors;
} & (
  | {
      errors: Error[];
    }
  | { formErrors: FormErrors }
);

type Data = {};

interface SuccessBody {
  status: 'success';
  data?: Data;
}

export type ActionResult = ErrorBody | SuccessBody;
