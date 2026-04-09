import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { failure } from '../result';

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        console.error('Validation error:', err.issues);
        const message = err.issues
          .map(({ message, path }) => `${path.join('.')}: ${message}`)
          .join('; ');
        return res.status(422).send(failure(message));
      }
      next(err);
    }
  };
}
