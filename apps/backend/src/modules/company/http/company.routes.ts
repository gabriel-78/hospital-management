import { Router } from 'express';
import { PrismaCompanyRepository } from '../infra/prisma-company.repository';
import { CreateCompanyUseCase } from '../use-cases/create-company.use-case';
import { FindCompanyByIdUseCase } from '../use-cases/find-company-by-id.use-case';
import { ListCompaniesUseCase } from '../use-cases/list-companies.use-case';
import { UpdateCompanyUseCase } from '../use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../use-cases/delete-company.use-case';
import { CompanyController } from './company.controller';

const companyRouter = Router();

const repository = new PrismaCompanyRepository();
const controller = new CompanyController(
  new CreateCompanyUseCase(repository),
  new FindCompanyByIdUseCase(repository),
  new ListCompaniesUseCase(repository),
  new UpdateCompanyUseCase(repository),
  new DeleteCompanyUseCase(repository),
);

companyRouter.post('/', (req, res) => controller.create(req, res));
companyRouter.get('/', (req, res) => controller.list(req, res));
companyRouter.get('/:id', (req, res) => controller.findById(req, res));
companyRouter.put('/:id', (req, res) => controller.update(req, res));
companyRouter.delete('/:id', (req, res) => controller.delete(req, res));

export { companyRouter };
