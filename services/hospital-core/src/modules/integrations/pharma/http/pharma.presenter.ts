import { PharmaProduct } from '../pharma.types.js';
import {
  ListPharmaProductsOutput,
  listPharmaProductsOutputSchema,
} from '../schemas/index.js';

export class PharmaPresenter {
  static toListOutput(products: PharmaProduct[]): ListPharmaProductsOutput {
    return listPharmaProductsOutputSchema.parse(products);
  }
}
