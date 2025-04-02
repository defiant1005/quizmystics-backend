export function errorHandler(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}
