import { Router } from 'express';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import { env } from '@/infra/env.js';
import { RedisCacheProvider } from '@/infra/cache/index.js';
import { ListPharmaProductsUseCase } from '../use-cases/index.js';
import { PharmaController } from './pharma.controller.js';
import { listPharmaProductsInputSchema } from '../schemas/index.js';
import { PharmaClient } from './pharma.client.js';
import { PharmaHttpAdapter } from './pharma-http.adapter.js';
import { CachedPharmaGateway } from './cached-pharma-gateway.js';

const pharmaRouter = Router();

const client = new PharmaClient(env.PHARMA_SERVICE_URL);
const gateway = new CachedPharmaGateway(new PharmaHttpAdapter(client), new RedisCacheProvider());
const controller = new PharmaController(new ListPharmaProductsUseCase(gateway));

pharmaRouter.get('/products', validate({ query: listPharmaProductsInputSchema }), (req, res) =>
  controller.listProducts(req, res),
);

export { pharmaRouter };
