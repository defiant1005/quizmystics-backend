import { ZodError } from 'zod';
import { IZodError } from './types.js';

export function errorHandler(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function mapZodErrors(errors: ZodError): IZodError[] {
  return errors.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
