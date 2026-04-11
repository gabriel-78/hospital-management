import { Router } from 'express';
import { PrismaProductRepository } from '../infra/prisma-product.repository.js';
import {
  DeleteProductUseCase,
  CreateProductUseCase,
  FindProductByIdUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../use-cases/index.js';
import { ProductController } from './product.controller.js';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import {
  createProductInputSchema,
  updateProductInputSchema,
  findProductByIdInputSchema,
  deleteProductInputSchema,
} from '../schemas/index.js';

const productRouter = Router();

const repository = new PrismaProductRepository();
const controller = new ProductController(
  new CreateProductUseCase(repository),
  new FindProductByIdUseCase(repository),
  new ListProductsUseCase(repository),
  new UpdateProductUseCase(repository),
  new DeleteProductUseCase(repository),
);

productRouter.post('/', validate({ body: createProductInputSchema }), (req, res) =>
  controller.create(req, res),
);
productRouter.get('/', (req, res) => controller.list(req, res));
productRouter.get('/:id', validate({ params: findProductByIdInputSchema }), (req, res) =>
  controller.findById(req, res),
);
productRouter.put(
  '/:id',
  validate({ params: findProductByIdInputSchema, body: updateProductInputSchema }),
  (req, res) => controller.update(req, res),
);
productRouter.delete('/:id', validate({ params: deleteProductInputSchema }), (req, res) =>
  controller.delete(req, res),
);

export { productRouter };
