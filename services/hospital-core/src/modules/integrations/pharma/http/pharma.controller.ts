import { Request, Response } from 'express';
import { isLeft, success } from '@shared/core';
import { failureRequest } from '@/shared/http.js';
import { ListPharmaProductsUseCase } from '../use-cases/index.js';
import { PharmaPresenter } from './pharma.presenter.js';
import { ListPharmaProductsInput } from '../schemas/index.js';

export class PharmaController {
  constructor(private listUseCase: ListPharmaProductsUseCase) {}

  async listProducts(req: Request, res: Response) {
    const { ids, names, activeIngredients } = req.query as ListPharmaProductsInput;
    const result = await this.listUseCase.execute({ ids, names, activeIngredients });
    if (isLeft(result)) return failureRequest(res, result.left);
    return res.status(200).send(success(PharmaPresenter.toListOutput(result.right)));
  }
}
