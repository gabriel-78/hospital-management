import { Company } from '../company.domain.js';
import {
  createCompanyOutputSchema,
  CreateCompanyOutput,
  findCompanyByIdOutputSchema,
  FindCompanyByIdOutput,
  listCompaniesOutputSchema,
  ListCompaniesOutput,
  updateCompanyOutputSchema,
  UpdateCompanyOutput,
} from '../schemas/output/index.js';

const toPlain = (company: Company) => ({
  id: company.id.value,
  name: company.name.value,
  cnpj: company.cnpj.value,
  type: company.type.value,
  address: company.address.value,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
  deletedAt: company.deletedAt,
});

export class CompanyPresenter {
  static toCreateOutput(company: Company): CreateCompanyOutput {
    return createCompanyOutputSchema.parse(toPlain(company));
  }

  static toFindByIdOutput(company: Company): FindCompanyByIdOutput {
    return findCompanyByIdOutputSchema.parse(toPlain(company));
  }

  static toListOutput(companies: Company[]): ListCompaniesOutput {
    return listCompaniesOutputSchema.parse(companies.map(toPlain));
  }

  static toUpdateOutput(company: Company): UpdateCompanyOutput {
    return updateCompanyOutputSchema.parse(toPlain(company));
  }
}
