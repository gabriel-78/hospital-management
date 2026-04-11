import { Prisma, PrismaClient } from '@prisma/client';

const products: Prisma.ProductCreateInput[] = [
  { name: 'ACEBROFILINA', category: 'BRONCODILATADORES', activeIngredient: 'ACEBROFILINA' },
  { name: 'ACICLOVIR', category: 'ANTIVIRAIS', activeIngredient: 'ACICLOVIR' },
  { name: 'ADRENALINA', category: 'OUTROS PRODUTOS SISTEMICOS', activeIngredient: 'EPINEFRINA' },
  { name: 'ALPRAZOLAM', category: 'ANSIOLITICOS', activeIngredient: 'ALPRAZOLAM' },
  { name: 'AMOXICILINA', category: 'ANTIBIOTICOS', activeIngredient: 'AMOXICILINA' },
  { name: 'BACTRIM', category: 'ANTIBIOTICOS', activeIngredient: 'SULFAMETOXAZOL + TRIMETOPRIMA' },
  { name: 'BENZETACIL', category: 'ANTIBIOTICOS', activeIngredient: 'PENICILINA BENZATINA' },
  { name: 'BISOPROLOL', category: 'ANTI-HIPERTENSIVOS', activeIngredient: 'BISOPROLOL' },
  { name: 'BROMOPRIDA', category: 'PRODUTOS GASTROINTESTINAIS', activeIngredient: 'BROMOPRIDA' },
  { name: 'BUDESONIDA', category: 'ANTIASMATICOS', activeIngredient: 'BUDESONIDA' },
  { name: 'CAPTOPRIL', category: 'ANTI-HIPERTENSIVOS', activeIngredient: 'CAPTOPRIL' },
  { name: 'CEFALEXINA', category: 'ANTIBIOTICOS', activeIngredient: 'CEFALEXINA' },
  { name: 'CETOCONAZOL', category: 'ANTI-FUNGICOS', activeIngredient: 'CETOCONAZOL' },
  { name: 'CIPROFLOXACINO', category: 'ANTIBIOTICOS', activeIngredient: 'CIPROFLOXACINO' },
  { name: 'CLONAZEPAM', category: 'ANSIOLITICOS', activeIngredient: 'CLONAZEPAM' },
  {
    name: 'DEXAMETASONA',
    category: 'GLICOCORTICOIDES SISTEMICOS',
    activeIngredient: 'DEXAMETASONA',
  },
  { name: 'DIAZEPAM', category: 'ANSIOLITICOS', activeIngredient: 'DIAZEPAM' },
  {
    name: 'DICLOFENACO',
    category: 'ANTI-INFLAMATORIOS NAO ESTEROIDAIS',
    activeIngredient: 'DICLOFENACO',
  },
  { name: 'DIPIRONA', category: 'ANALGESICOS NAO NARCOTICOS', activeIngredient: 'DIPIRONA' },
  { name: 'DOMPERIDONA', category: 'PRODUTOS GASTROINTESTINAIS', activeIngredient: 'DOMPERIDONA' },
  { name: 'ENALAPRIL', category: 'ANTI-HIPERTENSIVOS', activeIngredient: 'ENALAPRIL' },
  { name: 'ERITROMICINA', category: 'ANTIBIOTICOS', activeIngredient: 'ERITROMICINA' },
  { name: 'ESCITALOPRAM', category: 'ANTIDEPRESSIVOS', activeIngredient: 'ESCITALOPRAM' },
  { name: 'ESOMEPRAZOL', category: 'ANTIULCEROSOS', activeIngredient: 'ESOMEPRAZOL' },
  {
    name: 'ETORICOXIBE',
    category: 'ANTI-INFLAMATORIOS NAO ESTEROIDAIS',
    activeIngredient: 'ETORICOXIBE',
  },
  { name: 'FENITOINA', category: 'ANTICONVULSIVANTES', activeIngredient: 'FENITOINA' },
  { name: 'FLUCONAZOL', category: 'ANTI-FUNGICOS', activeIngredient: 'FLUCONAZOL' },
  { name: 'FLUOXETINA', category: 'ANTIDEPRESSIVOS', activeIngredient: 'FLUOXETINA' },
  { name: 'FUROSEMIDA', category: 'DIURETICOS', activeIngredient: 'FUROSEMIDA' },
  { name: 'FORMOTEROL', category: 'ANTIASMATICOS', activeIngredient: 'FORMOTEROL' },
  { name: 'GABAPENTINA', category: 'ANTICONVULSIVANTES', activeIngredient: 'GABAPENTINA' },
  { name: 'GENTAMICINA', category: 'ANTIBIOTICOS', activeIngredient: 'GENTAMICINA' },
  { name: 'GLIBENCLAMIDA', category: 'ANTIDIABETICOS', activeIngredient: 'GLIBENCLAMIDA' },
  { name: 'GLIMEPIRIDA', category: 'ANTIDIABETICOS', activeIngredient: 'GLIMEPIRIDA' },
  { name: 'GLICLAZIDA', category: 'ANTIDIABETICOS', activeIngredient: 'GLICLAZIDA' },
  { name: 'HALOPERIDOL', category: 'ANTIPSICOTICOS', activeIngredient: 'HALOPERIDOL' },
  { name: 'HEPARINA', category: 'ANTITROMBOTICOS', activeIngredient: 'HEPARINA' },
  { name: 'HIDRALAZINA', category: 'ANTI-HIPERTENSIVOS', activeIngredient: 'HIDRALAZINA' },
  {
    name: 'HIDROCORTISONA',
    category: 'GLICOCORTICOIDES SISTEMICOS',
    activeIngredient: 'HIDROCORTISONA',
  },
  { name: 'HIOSCINA', category: 'ANTIESPASMODICOS', activeIngredient: 'HIOSCINA' },
  { name: 'IBUPROFENO', category: 'ANALGESICOS NAO NARCOTICOS', activeIngredient: 'IBUPROFENO' },
  { name: 'IMIPRAMINA', category: 'ANTIDEPRESSIVOS', activeIngredient: 'IMIPRAMINA' },
  { name: 'INSULINA', category: 'ANTIDIABETICOS', activeIngredient: 'INSULINA' },
  { name: 'IVERMECTINA', category: 'ANTIPARASITARIOS', activeIngredient: 'IVERMECTINA' },
  { name: 'ITRACONAZOL', category: 'ANTI-FUNGICOS', activeIngredient: 'ITRACONAZOL' },
  { name: 'LOSARTANA', category: 'ANTI-HIPERTENSIVOS', activeIngredient: 'LOSARTANA' },
  { name: 'LORATADINA', category: 'ANTIALERGICOS', activeIngredient: 'LORATADINA' },
  { name: 'LEVOTIROXINA', category: 'HORMONIOS', activeIngredient: 'LEVOTIROXINA' },
  { name: 'LEVOFLOXACINO', category: 'ANTIBIOTICOS', activeIngredient: 'LEVOFLOXACINO' },
  { name: 'LIDOCAINA', category: 'ANESTESICOS', activeIngredient: 'LIDOCAINA' },
];

export async function seedProducts(prisma: Prisma.TransactionClient | PrismaClient) {
  for (const product of products) {
    await (prisma as PrismaClient).product.upsert({
      where: { name: product.name as string },
      update: {},
      create: product,
    });
  }

  console.log(`✔ Products seeded (${products.length} records).`);
}
