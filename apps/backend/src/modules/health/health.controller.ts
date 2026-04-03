import { Request, Response } from 'express';
import { HealthService } from './health.service';

export class HealthController {
  constructor(private service: HealthService) {}

  async handle(req: Request, res: Response) {
    try {
      const result = await this.service.execute();

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
