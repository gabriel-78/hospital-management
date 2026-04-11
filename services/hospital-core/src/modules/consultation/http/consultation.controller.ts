import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';
import {
  CancelConsultationUseCase,
  CompleteConsultationUseCase,
  CreateConsultationUseCase,
  DeleteConsultationUseCase,
  FindConsultationByIdUseCase,
  ListConsultationsUseCase,
  RescheduleConsultationUseCase,
} from '../use-cases/index.js';
import { ConsultationPresenter } from './consultation.presenter.js';

export class ConsultationController {
  constructor(
    private createUseCase: CreateConsultationUseCase,
    private findByIdUseCase: FindConsultationByIdUseCase,
    private listUseCase: ListConsultationsUseCase,
    private cancelUseCase: CancelConsultationUseCase,
    private completeUseCase: CompleteConsultationUseCase,
    private rescheduleUseCase: RescheduleConsultationUseCase,
    private deleteUseCase: DeleteConsultationUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(ConsultationPresenter.toCreateOutput(result.right)));
  }

  async findById(req: Request, res: Response) {
    const result = await this.findByIdUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ConsultationPresenter.toFindByIdOutput(result.right)));
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ConsultationPresenter.toListOutput(result.right)));
  }

  async cancel(req: Request, res: Response) {
    const result = await this.cancelUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ConsultationPresenter.toCancelOutput(result.right)));
  }

  async complete(req: Request, res: Response) {
    const result = await this.completeUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ConsultationPresenter.toCompleteOutput(result.right)));
  }

  async reschedule(req: Request, res: Response) {
    const result = await this.rescheduleUseCase.execute(req.params.id, req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ConsultationPresenter.toRescheduleOutput(result.right)));
  }

  async delete(req: Request, res: Response) {
    const result = await this.deleteUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(204).send();
  }
}
