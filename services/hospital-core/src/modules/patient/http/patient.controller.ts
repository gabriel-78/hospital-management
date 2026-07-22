import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest, getRouteParam } from '@/shared/http.js';
import {
  CreatePatientUseCase,
  DeletePatientUseCase,
  FindPatientByIdUseCase,
  ListPatientsUseCase,
  UpdatePatientUseCase,
} from '../use-cases/index.js';
import { PatientPresenter } from './patient.presenter.js';

export class PatientController {
  constructor(
    private createUseCase: CreatePatientUseCase,
    private findByIdUseCase: FindPatientByIdUseCase,
    private listUseCase: ListPatientsUseCase,
    private updateUseCase: UpdatePatientUseCase,
    private deleteUseCase: DeletePatientUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(PatientPresenter.toCreateOutput(result.right)));
  }

  async findById(req: Request, res: Response) {
    const result = await this.findByIdUseCase.execute(getRouteParam(req, 'id'));
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(PatientPresenter.toFindByIdOutput(result.right)));
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(PatientPresenter.toListOutput(result.right)));
  }

  async update(req: Request, res: Response) {
    const result = await this.updateUseCase.execute(getRouteParam(req, 'id'), req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(PatientPresenter.toUpdateOutput(result.right)));
  }

  async delete(req: Request, res: Response) {
    const result = await this.deleteUseCase.execute(getRouteParam(req, 'id'));
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(204).send();
  }
}
