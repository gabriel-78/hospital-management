import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';
import {
  FindProductByIdUseCase,
  DeleteProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  ListProductsUseCase,
} from '../use-cases/index.js';
import { ProductPresenter } from './product.presenter.js';
import { ListProductsInput } from '../schemas/index.js';

export class ProductController {
  constructor(
    private createUseCase: CreateProductUseCase,
    private findByIdUseCase: FindProductByIdUseCase,
    private listUseCase: ListProductsUseCase,
    private updateUseCase: UpdateProductUseCase,
    private deleteUseCase: DeleteProductUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUseCase.execute(req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(201).send(success(ProductPresenter.toCreateOutput(result.right)));
  }

  async findById(req: Request, res: Response) {
    const result = await this.findByIdUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ProductPresenter.toFindByIdOutput(result.right)));
  }

  async list(req: Request, res: Response) {
    const { ids, names, activeIngredients } = req.query as ListProductsInput;
    const result = await this.listUseCase.execute({ ids, names, activeIngredients });
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ProductPresenter.toListOutput(result.right)));
  }

  async update(req: Request, res: Response) {
    const result = await this.updateUseCase.execute(req.params.id, req.body);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(ProductPresenter.toUpdateOutput(result.right)));
  }

  async delete(req: Request, res: Response) {
    const result = await this.deleteUseCase.execute(req.params.id);
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(204).send();
  }
}
