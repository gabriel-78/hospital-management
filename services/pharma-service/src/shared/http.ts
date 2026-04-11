import { Response } from 'express';
import { AppError } from '@shared/core';

export function failureRequest(res: Response, error: AppError) {
  return res.status(error.getStatusCode()).json({ error: error.message, code: error.code });
}
