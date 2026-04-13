export interface PharmaProductRaw {
  id: string;
  name: string;
  category: string;
  activeIngredient: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PharmaProduct {
  id: string;
  name: string;
  category: string;
  activeIngredient: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PharmaApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PharmaListProductsFilters {
  ids?: string[];
  names?: string[];
  activeIngredients?: string[];
}
