import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function toError(error: unknown) {
  if (error instanceof ZodError) {
    console.error(fromZodError(error));
  } else if (error instanceof Error) {
    console.error(error);
  } else {
    console.error(error);
  }
  process.exit(1);
}
