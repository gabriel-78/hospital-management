import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';
import {
  CreateConsultationResultUseCase,
  FindConsultationResultByConsultationIdUseCase,
} from '../use-cases/index.js';
import { ConsultationResultPresenter } from './consultation-result.presenter.js';

export class ConsultationResultController {
  constructor(
    private createUseCase: CreateConsultationResultUseCase,
    private findByConsultationIdUseCase: FindConsultationResultByConsultationIdUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(ConsultationResultPresenter.toCreateOutput(result.right)));
  }

  async findByConsultationId(req: Request, res: Response) {
    const result = await this.findByConsultationIdUseCase.execute(req.params.consultationId);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res
      .status(200)
      .send(success(ConsultationResultPresenter.toFindByConsultationIdOutput(result.right)));
  }
}
