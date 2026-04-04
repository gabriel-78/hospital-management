import { AppError } from './appError';
import { Response } from 'express';

export type Result<T, E = unknown> = { success: true; data: T } | { success: false; error: E };

export function success<T>(schema: T) {
  return {
    isSuccess: true,
    data: schema,
  };
}

export function failure(error: string) {
  return {
    isSuccess: false,
    error: error,
  };
}

export function failureRequest(reply: Response, error: AppError) {
  const statusCode = error.getStatusCode();

  if (statusCode === 500) return reply.status(500).send();

  return reply.status(statusCode).send(failure(error.message));
}
