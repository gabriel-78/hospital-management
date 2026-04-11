import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';
import {
  CreateDoctorUseCase,
  DeleteDoctorUseCase,
  FindDoctorByIdUseCase,
  ListDoctorsUseCase,
  UpdateDoctorUseCase,
} from '../use-cases/index.js';
import { DoctorPresenter } from './doctor.presenter.js';

export class DoctorController {
  constructor(
    private createUseCase: CreateDoctorUseCase,
    private findByIdUseCase: FindDoctorByIdUseCase,
    private listUseCase: ListDoctorsUseCase,
    private updateUseCase: UpdateDoctorUseCase,
    private deleteUseCase: DeleteDoctorUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(DoctorPresenter.toCreateOutput(result.right)));
  }

  async findById(req: Request, res: Response) {
    const result = await this.findByIdUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(DoctorPresenter.toFindByIdOutput(result.right)));
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(DoctorPresenter.toListOutput(result.right)));
  }

  async update(req: Request, res: Response) {
    const result = await this.updateUseCase.execute(req.params.id, req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(DoctorPresenter.toUpdateOutput(result.right)));
  }

  async delete(req: Request, res: Response) {
    const result = await this.deleteUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(204).send();
  }
}
