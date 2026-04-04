import { Request, Response } from 'express';
import { isLeft } from '@/shared/either';
import { failureRequest, success } from '@/shared/result';
import { CreateCompanyUseCase } from '../use-cases/create-company.use-case';
import { FindCompanyByIdUseCase } from '../use-cases/find-company-by-id.use-case';
import { ListCompaniesUseCase } from '../use-cases/list-companies.use-case';
import { UpdateCompanyUseCase } from '../use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../use-cases/delete-company.use-case';

export class CompanyController {
  constructor(
    private createUseCase: CreateCompanyUseCase,
    private findByIdUseCase: FindCompanyByIdUseCase,
    private listUseCase: ListCompaniesUseCase,
    private updateUseCase: UpdateCompanyUseCase,
    private deleteUseCase: DeleteCompanyUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(result.right));
  }

  async findById(req: Request, res: Response) {
    const result = await this.findByIdUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(result.right));
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(result.right));
  }

  async update(req: Request, res: Response) {
    const result = await this.updateUseCase.execute(req.params.id, req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(result.right));
  }

  async delete(req: Request, res: Response) {
    const result = await this.deleteUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(204).send();
  }
}
