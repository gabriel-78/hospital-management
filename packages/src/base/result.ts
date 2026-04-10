export type Result<T, E = unknown> =
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T): Result<T> {
  return {
    success: true,
    data,
  };
}

export function failure<E = string>(error: E): Result<never, E> {
  return {
    success: false,
    error,
  };
}
