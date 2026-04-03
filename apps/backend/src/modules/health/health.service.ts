import { HealthRepository } from './health.repository';

export class HealthService {
  constructor(private repository: HealthRepository) {}

  async execute() {
    const data = await this.repository.getStatus();

    if (!data) {
      throw new Error('Health check record not found in database');
    }

    return {
      status: 'ok',
      database: true,
      message: data.message,
      timestamp: new Date().toISOString(),
    };
  }
}
