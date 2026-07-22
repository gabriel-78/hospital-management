import { Request, Response } from 'express';
import { AppError } from '@shared/core';

export function failureRequest(res: Response, error: AppError) {
  return res.status(error.getStatusCode()).json({ error: error.message, code: error.code });
}

export function getRouteParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}
