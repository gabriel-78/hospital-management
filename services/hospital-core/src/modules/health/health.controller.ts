import { Request, Response } from 'express';
import { HealthService } from './health.service.js';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';

export class HealthController {
  constructor(private service: HealthService) {}

  async handle(req: Request, res: Response) {
    const result = await this.service.execute();

    if (isLeft(result)) {
      return failureRequest(res, result.left);
    }

    return res.status(200).send(success(result));
  }
}
